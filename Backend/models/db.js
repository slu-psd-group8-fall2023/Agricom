const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    await mongoose.connect('mongodb+srv://agrocom0532:Agro0532@agrocom-1.zckjtaq.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

module.exports = connectToDatabase;
