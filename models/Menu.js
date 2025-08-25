const mongoose = require("mongoose");

// Menu schema
const MenuSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String, // store filename / path
});

// Export properly
module.exports = mongoose.model("Menu", MenuSchema);
