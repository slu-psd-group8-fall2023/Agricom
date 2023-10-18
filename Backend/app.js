const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database/db');
const { cors, handleError, notFound } = require('./middleware');
const { handleLogin, handleSignup, handleForgotPassword, handleResetPassword } = require('./api');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Connect to Database
db();

// Register middleware
app.use(cors);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods","PUT,GET,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");    
    next();
  });

// Register authentication routes
app.post('/login', handleLogin);
app.post('/signup', handleSignup);
app.post('/forgot-password', handleForgotPassword);
app.post('/reset-password/:token', handleResetPassword);

// Handle 404 Not Found
app.use(notFound);

// Handle errors
app.use(handleError);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
