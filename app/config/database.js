const mongoose = require("mongoose");

const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;

let options = {
  auth: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

module.exports = async () => {
  try {
    await mongoose.connect(URI, options);
    console.log("DB connected successfully");
  } catch (error) {
    console.error(error.message);
  }
};
