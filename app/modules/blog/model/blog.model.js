const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    writer: { type: String, required: true },
    image: { type: String, required: true },
    content: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, enum: [true, false] },
  },
  { timestamps: true, versionKey: false }
);

// create the model for Shop and expose it to our app
module.exports = mongoose.model("Blog", BlogSchema);
