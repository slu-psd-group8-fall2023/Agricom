echo "Starting AgriCom"
cp -r node_modules Frontend/
cd Frontend && sudo ng build
echo "build completed"
cd ../
npm run start:backend & 
cd Frontend && http-server dist/agri-com