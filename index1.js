const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

app.use(express.json());

const PRODUCTS_FILE = "products.json";
const REVIEWS_FILE = "reviews.json";

const readData = (file) => {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8"));
};

const writeData = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// POST /products - Add a new product
app.post("/products", (req, res) => {
  const products = readData(PRODUCTS_FILE);
  const { name, description } = req.body;
  const newProduct = { id: uuidv4(), name, description, averageRating: 0 };
  products.push(newProduct);
  writeData(PRODUCTS_FILE, products);
  res.status(201).json(newProduct);
});

// GET /products - Retrieve all products with sorting
app.get("/products", (req, res) => {
  let products = readData(PRODUCTS_FILE);
  if (req.query.sortBy === "rating") {
    products.sort((a, b) => b.averageRating - a.averageRating);
  }
  res.json(products);
});

// POST /reviews - Submit a review
app.post("/reviews", (req, res) => {
  const reviews = readData(REVIEWS_FILE);
  const products = readData(PRODUCTS_FILE);
  const { productId, rating, message } = req.body;
  const product = products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const newReview = {
    id: uuidv4(),
    productId,
    timestamp: new Date().toISOString(),
    rating,
    message,
  };
  reviews.push(newReview);
  writeData(REVIEWS_FILE, reviews);

  // Update average rating
  const productReviews = reviews.filter((r) => r.productId === productId);
  product.averageRating =
    productReviews.reduce((sum, r) => sum + r.rating, 0) /
    productReviews.length;
  writeData(PRODUCTS_FILE, products);

  res.status(201).json(newReview);
});

// GET /reviews - Retrieve recent reviews
app.get("/reviews", (req, res) => {
  let reviews = readData(REVIEWS_FILE);
  reviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(reviews);
});

// GET /products/:id - Retrieve a specific product with its reviews
app.get("/products/:id", (req, res) => {
  const products = readData(PRODUCTS_FILE);
  const reviews = readData(REVIEWS_FILE);
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  product.reviews = reviews.filter((r) => r.productId === product.id);
  res.json(product);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
