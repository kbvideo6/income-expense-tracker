const mongoose = require("mongoose");

const mongoURI = "mongodb+srv://artstudio2023:PxRSQJTr9DFsXgJG@v1.jozylak.mongodb.net/V1?retryWrites=true&w=majority&appName=V1://localhost:27017/mydatabase";

const dbConnect = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = dbConnect;
