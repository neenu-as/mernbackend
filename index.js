// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const path = require("path");





// const User = require("./models/User");
// const Menu = require("./models/Menu");
// const Order= require("./models/Order");

// const app = express();
// app.use(cors());
// app.use(express.json());


// make uploads folder public
// app.use("/uploads", express.static("uploads"));

// Multer storage config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
    // cb(null, "uploads/"); 
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname)); 
//   }
// });

// const upload = multer({ storage: storage });

// Connect to MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/cafeapp")
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.log(err));


  
// const JWT_SECRET = "your_secret_key"; 

// Create admin if not exists
// async function createAdmin() {
//   const adminEmail = "admin@gmail.com";
//   const adminPassword = "admin@123";

  // const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Upsert: create if not exists, otherwise update password
  // await User.findOneAndUpdate(
  //   { email: adminEmail },
  //   { name: "Admin", email: adminEmail, password: hashedPassword, role: "admin" },
  //   { upsert: true }
  // );

//   console.log("Admin account ensured in DB");
// }
// createAdmin();


// Signup route - only for normal users
// app.post("/api/signup", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     await User.create({ name, email, password: hashedPassword, role: "user" });
//     res.status(201).json({ message: "User created successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Login route
// app.post("/api/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
//     res.json({ token, role: user.role, name: user.name });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id, role: user.role }, "secretkey", { expiresIn: "1d" });

//     res.json({
//       token,
//       role: user.role,
//       user: { _id: user._id, name: user.name, email: user.email }
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });


// // Protected route example
// app.get("/api/protected", (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token provided" });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     res.json({ message: `Hello ${decoded.role}`, user: decoded });
//   } catch {
//     res.status(401).json({ message: "Invalid token" });
//   }
// });

//Admin menu create //

// Add menu item with image
// app.post("/menu", upload.single("image"), async (req, res) => {
//   try {
//     console.log("Incoming body:", req.body);
//     console.log("Incoming file:", req.file);

//     const newItem = new Menu({
//       name: req.body.name,
//       description: req.body.description,
//       price: Number(req.body.price), // ensure number
//       category: req.body.category,
//       image: req.file ? `/uploads/${req.file.filename}` : "",
//     });

//     await newItem.save();
//     res.json(newItem);
//   } catch (err) {
//     console.error("Error saving menu item:", err); // 👈 full error in terminal
//     res.status(500).json({ error: err.message });
//   }
// });


// Get all items
// app.get("/menu", async (req, res) => {
//   const items = await Menu.find();
//   res.json(items);
// });
// Get single menu item
// app.get("/menu/:id", async (req, res) => {
//   try {
//     const item = await Menu.findById(req.params.id);
//     res.json(item);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// ✅ Update (Edit menu item)
// Update menu item with optional image upload
// app.put("/menu/:id", upload.single("image"), async (req, res) => {
//   try {
    // 🟢 1. Log incoming data (for debugging)
    // console.log("Updating menu item:", req.params.id);
    // console.log("Incoming body:", req.body);
    // console.log("Incoming file:", req.file);

    // 🟢 2. Prepare update fields
    // let updateData = {
    //   name: req.body.name,
    //   description: req.body.description,  
    //   price: Number(req.body.price),      
    //   category: req.body.category,       
    // };

    // 🟢 3. If new image uploaded, add to updateData
    // if (req.file) {
    //   updateData.image = `/uploads/${req.file.filename}`;
    // }

    // 🟢 4. Update in MongoDB
    // const updatedItem = await Menu.findByIdAndUpdate(
    //   req.params.id,   
    //   updateData,      
    //   { new: true }   
    // );

    // 🟢 5. If no item found
    // if (!updatedItem) {
    //   return res.status(404).json({ message: "Menu item not found" });
    // }

    // 🟢 6. Success response
  //   res.json(updatedItem);
  // } catch (err) {
    // 🟢 7. Error handling
//     console.error("Error updating menu item:", err);
//     res.status(500).json({ error: err.message });
//   }
// });


// ✅ Delete (Remove menu item)
// app.delete("/menu/:id", async (req, res) => {
//   try {
//     await Menu.findByIdAndDelete(req.params.id);
//     res.json({ message: "Item deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });



//Place new order

// app.post("/order", async (req, res) => {
//   try {
//     const newOrder = new Order(req.body);
//     await newOrder.save();
//     res.json({ success: true, message: "Order placed successfully!", order: newOrder });
//   } catch (err) {
//     console.error("Error placing order:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });


// app.post("/api/orders", async (req, res) => {
//   try {
//     const { customerId, customerName, customerPhone, address, items, totalPrice } = req.body;

//     const newOrder = new Order({
     // customerId,   // store which user placed it
    //   customerName,
    //   customerPhone,
    //   address,
    //   items,
    //   totalPrice,
    // });

//     await newOrder.save();
//     res.json({ message: "Order placed successfully!" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


// Get all orders (Admin use)
// app.get("/orders", async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Update order status (Pending → Confirmed → Delivered)
// app.put("/orders/:id/status", async (req, res) => {
//   try {
//     const { status } = req.body;
//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );
//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });



// Fetch only Active Orders (Pending & Confirmed)
// app.get("/orders", async (req, res) => {
//   try {
//     const activeOrders = await Order.find({ status: { $ne: "Delivered" } }).sort({ createdAt: -1 });
//     res.json(activeOrders);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Fetch Delivered Orders (Order History)
// app.get("/orders/history", async (req, res) => {
//   try {
//     const deliveredOrders = await Order.find({ status: "Delivered" }).sort({ createdAt: -1 });
//     res.json(deliveredOrders);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });



// Get orders for a specific customer
// app.get("/api/myorders/:userId", async (req, res) => {
//   try {
//     const orders = await Order.find({ customerId: req.params.userId }).sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


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
mongoose.connect("mongodb+srv://neenuajithkumar:MBJpafTdhvEGgpUf@cafeappcluster.5nfuipy.mongodb.net/?retryWrites=true&w=majority&appName=CafeAppCluster")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

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
app.post("/menu", upload.single("image"), async (req, res) => {
  try {
    const newItem = new Menu({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      image: req.file ? `/uploads/${req.file.filename}` : "",
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

app.put("/menu/:id", upload.single("image"), async (req, res) => {
  try {
    let updateData = {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
    };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
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
app.listen(5000, () => console.log("Server running on port 5000"));


























app.listen(5000, () => console.log("Server running on port 5000"));