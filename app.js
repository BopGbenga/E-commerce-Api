const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const db = require("./db");

require("dotenv/config");
db.connect();

const Port = process.env.PORT || 3000;
const api = process.env.API_URL;
//connecting to db

//middleware

app.use(bodyParser.json());
app.use(morgan("tiny"));

//routes
// const productRoutes = require("./routers/products");
// const categoryRoutes = require("./routers/category");
// const userRoutes = require("./routers/users");
const productRoutes = require("./product-Authentication/productRouter");
const categoryRoutes = require("./catregoryAuthentciation/categoryRouter");
const userRoutes = require("./userAuthentiation/userRouter");
const orderRoutes = require("./OrderAuthentication/orderRouter");
const paymentRoutes = require("./payment/paymentRouter");

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/paystack", paymentRoutes);

// app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("hello world");
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

app.get("*", (req, res) => {
  res.status(404).send("Route does not exist");
});

app.listen(Port, () => {
  console.log(api);
  console.log(`server is running on ${Port}`);
});
