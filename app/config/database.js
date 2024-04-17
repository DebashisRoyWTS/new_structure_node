const mongoose = require("mongoose");

// const URI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;

let option = {
  auth: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
   useCreateIndex: true,
   useNewUrlParser: true,
   useUnifiedTopology: true,
  useFindAndModify: false
};

module.exports = async () => {
  try {
    await mongoose.connect(URI, option);
    console.log("DB connected successfully");
  } catch (error) {
    console.error(error.message);
  }
};
