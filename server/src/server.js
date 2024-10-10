const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const loanRoutes = require("./routes/loanRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const stripeRoutes = require("./routes/stripe");
const cors = require("cors");
const morgan = require("morgan");

console.log("loaded");

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use((r, s, n) => {
  console.log("running morgan");
  n();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/loans", loanRoutes);
console.log("zz");
app.use("/api/payments", paymentRoutes);
app.use("/api/stripe", stripeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
