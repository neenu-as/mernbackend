// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema({
//   customerName: { type: String, required: true },
//   customerPhone: { type: String, required: true },
//   address: { type: String, required: true },
//   items: [
//     {
//       name: String,
//       price: Number,
//       quantity: Number,
//     }
//   ],
//   totalPrice: Number,
//   paymentMethod: { type: String, default: "Cash on Delivery" },
//   status: { type: String, default: "Pending" },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Order", OrderSchema);
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // new
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  address: { type: String, required: true },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    }
  ],
  totalPrice: Number,
  paymentMethod: { type: String, default: "Cash on Delivery" },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
