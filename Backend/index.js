const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models/db');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

db();

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});