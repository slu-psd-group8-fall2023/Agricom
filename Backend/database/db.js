const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    // Attempt to connect to the MongoDB database using provided connection URL and options
    await mongoose.connect(
      "mongodb+srv://agrocom0532:Agro0532@agrocom-1.zckjtaq.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true, // Use the new URL parser
        useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
      }
    );
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};
// Export the connectToDatabase function for use in other parts of the application
module.exports = connectToDatabase;
