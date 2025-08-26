const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "db4v8vybo",   // your cloud name
  api_key: "687916416731427", // your api key
  api_secret: "trsarmb1dxerSRAAbL57" // your api secret
});

module.exports = cloudinary;
