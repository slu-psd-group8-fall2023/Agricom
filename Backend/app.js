const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database/db");
const { cors, handleError } = require("./middleware");
const api = require("./api");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: "50mb", extended: true }));

// Connect to Database
db();

// Register middleware
app.use(cors);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT,GET,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Register authentication routes
app.post("/login", api.handleLogin);
app.post("/signup", api.handleSignup);
app.post("/forgot-password", api.handleForgotPassword);
app.post("/reset-password/:token", api.handleResetPassword);
app.post("/posts", api.userPost);
app.post("/retrieveposts", api.retrievePosts);
app.post("/postcomments", api.addCommentToPost);
app.post("/getpostcomments", api.getCommentsForPost);
app.post("/deleteuserpost", api.deleteUserPosts);
app.post("/edituserpost", api.editUserPosts);
app.post("/marketpost", api.MarketUserPost);
app.post("/retrievemarketposts", api.retrieveMarketPosts);
app.post("/filtermarketposts", api.filterMarketPosts);
app.post("/deletemarketpost", api.deleteMarketPosts);
app.post("/editmarketpost", api.editMarketPosts);

// Handle errors
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
