const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  colour: {
    type: String,
  },
});
const category = mongoose.model("category", categorySchema);
module.exports = category;
