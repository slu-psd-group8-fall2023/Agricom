from flask_cors import CORS
import os
from flask import Flask, render_template, request, jsonify
from PIL import Image
import torchvision.transforms.functional as TF
import CNN
import numpy as np
import torch
import pandas as pd

# Load disease and supplement info



# Define a function for making predictions
class model:
    def __init__(self):
        # Load the pre-trained model
        self._model = CNN.CNN(39)
        self._model.load_state_dict(torch.load("plant_disease_model_1_latest.pt"))
        self._model.eval()
    def prediction(self,image_path):
        try:
            image = Image.open(image_path).resize((224, 224))
            input_data = TF.to_tensor(image).view((-1, 3, 224, 224))
            output =self._model(input_data).detach().numpy()
            index = np.argmax(output)
            return index
        except Exception as e:
            return -1
class prediction_data:
    def __init__(self,pred):
        # Load disease and supplement info
        self._pred=pred
        self._disease_info = pd.read_csv('disease_info.csv', encoding='cp1252')
        self._supplement_info = pd.read_csv('supplement_info.csv', encoding='cp1252')
    def return_disease_data(self):
        result = {
            'title': self._disease_info['disease_name'][self._pred],
            'description': self._disease_info['description'][self._pred],
            'prevent': self._disease_info['Possible Steps'][self._pred],
            'image_url': self._disease_info['image_url'][self._pred],
        }
        return result
    def return_supplement_data(self):
        result = {
            'supplement_name' : self._supplement_info['supplement name'][self._pred],
            'supplement_image_url' : self._supplement_info['supplement image'][self._pred],
            'supplement_buy_link' : self._supplement_info['buy link'][self._pred]
        }
        return result

class decorator(prediction_data):
    def __init__(self,prediction):
        self._prediction=prediction

class disease_data(decorator):
    def return_disease_data(self):
        return self._prediction.return_disease_data()

class suppliment(decorator):
    def return_supplement_data(self):
        return self._prediction.return_supplement_data()

class total_data():
    def __init__(self,pred):
        self._prediction=prediction_data(pred)
        self._disease_data=disease_data(self._prediction)
        self._suppliment=suppliment(self._prediction)
    def return_data(self):
        return {**self._disease_data.return_disease_data(), **self._suppliment.return_supplement_data()}


app = Flask(__name__)
CORS(app)

@app.route('/submit', methods=['GET', 'POST'])
def submit():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'})
    if request.method == 'POST':
        image = request.files['image']
        filename = image.filename
        file_path = os.path.join('static/uploads', filename)
        image.save(file_path)
        print(file_path)

        # Get prediction information
        model_to_predict=model()
        pred = model_to_predict.prediction(file_path)
        if pred == -1:
            return jsonify({'error': 'Failed to process the image'})
        predict=total_data(pred)
        result=predict.return_data()
        print(result)
        return jsonify({'result':result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
