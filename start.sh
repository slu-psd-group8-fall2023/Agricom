echo "Starting AgriCom"
cd Frontend && ng build
echo "build completed"
cd ../
npm run start:backend & sudo npm run start:frontend