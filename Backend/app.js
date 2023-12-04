const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database/db");
const { cors, handleError } = require("./middleware");
const api = require("./api");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server); // Attach WebSocket server to the HTTP server
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

io.on("connection", (socket) => {
  console.log("A user connected");

  // Example: Broadcasting a message when a post is created
  socket.on("newFeedPost", (postData) => {
    console.log("Received new post data from client:", postData);
    io.emit("newFeedPost", postData); // Broadcast the new post data to all connected clients
  });

  // Example: Broadcasting a message when a new comment is add to a post
  socket.on("newComment", (postData) => {
    console.log("Received commenton the post from client:", postData);
    io.emit("newComment", postData); // Broadcast the deleted post ID to all connected clients
  });

  // Example: Broadcasting a message when a new market post is created
  socket.on("newMarketPost", (postData) => {
    console.log("Received new post data from client:", postData);
    io.emit("newMarketPost", postData); // Broadcast the new post data to all connected clients
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
