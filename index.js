


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const User = require("./models/User");
const Menu = require("./models/Menu");
const Order = require("./models/Order");
const cloudinary = require("./cloudinary"); 




const app = express();
app.use(cors());
app.use(express.json());

// make uploads folder public
app.use("/uploads", express.static("uploads"));

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Connect to MongoDB
// Connect to MongoDB Atlas
mongoose.connect(
  "mongodb+srv://neenuajithkumar:neenumern2app@cafeappcluster.5nfuipy.mongodb.net/cafeapp?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

const JWT_SECRET = "your_secret_key"; // ✅ Use same everywhere

// Create admin if not exists
async function createAdmin() {
  const adminEmail = "admin@gmail.com";
  const adminPassword = "admin@123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await User.findOneAndUpdate(
    { email: adminEmail },
    { name: "Admin", email: adminEmail, password: hashedPassword, role: "admin" },
    { upsert: true }
  );

  console.log("Admin account ensured in DB");
}
createAdmin();

// Signup route
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, role: "user" });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      role: user.role,
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Menu Routes
// app.post("/menu", upload.single("image"), async (req, res) => {
//   try {
//     const newItem = new Menu({
//       name: req.body.name,
//       description: req.body.description,
//       price: Number(req.body.price),
//       category: req.body.category,
//       image: req.file ? `/uploads/${req.file.filename}` : "",
//     });
//     await newItem.save();
//     res.json(newItem);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// ✅ Add Menu Item with Cloudinary Upload
app.post("/menu", upload.single("image"), async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "cafeapp/menu"
      });
      imageUrl = uploadResult.secure_url;  // ✅ Cloudinary direct link
    }

    const newItem = new Menu({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      image: imageUrl,
    });

    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/menu", async (req, res) => {
  const items = await Menu.find();
  res.json(items);
});

app.get("/menu/:id", async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// app.put("/menu/:id", upload.single("image"), async (req, res) => {
//   try {
//     let updateData = {
//       name: req.body.name,
//       description: req.body.description,
//       price: Number(req.body.price),
//       category: req.body.category,
//     };
//     if (req.file) {
//       updateData.image = `/uploads/${req.file.filename}`;
//     }
//     const updatedItem = await Menu.findByIdAndUpdate(req.params.id, updateData, { new: true });
//     if (!updatedItem) return res.status(404).json({ message: "Menu item not found" });
//     res.json(updatedItem);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// ✅ Update Menu Item with Cloudinary Upload
app.put("/menu/:id", upload.single("image"), async (req, res) => {
  try {
    let updateData = {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
    };

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "cafeapp/menu"
      });
      updateData.image = uploadResult.secure_url;
    }

    const updatedItem = await Menu.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedItem) return res.status(404).json({ message: "Menu item not found" });

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete("/menu/:id", async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Orders
app.post("/api/orders", async (req, res) => {
  try {
    const { customerId, customerName, customerPhone, address, items, totalPrice } = req.body;

    const newOrder = new Order({
      customerId,
      customerName,
      customerPhone,
      address,
      items,
      totalPrice,
    });

    await newOrder.save();
    res.json({ message: "Order placed successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: All Orders
// Get all orders for admin (Admin Orders Page)
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Admin: Active Orders (Pending + Confirmed)
// Fetch only active orders (Pending & Confirmed) - for customers
app.get("/orders/active", async (req, res) => {
  try {
    const activeOrders = await Order.find({ status: { $ne: "Delivered" } }).sort({ createdAt: -1 });
    res.json(activeOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Admin: Delivered Orders (History)
app.get("/orders/history", async (req, res) => {
  try {
    const deliveredOrders = await Order.find({ status: "Delivered" }).sort({ createdAt: -1 });
    res.json(deliveredOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Update order status
app.put("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Customer: My Orders
app.get("/api/myorders/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3001;  // use Render's port or fallback to 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





























