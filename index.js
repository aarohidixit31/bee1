// const express = require("express");
// const cors = require("cors");
// const app = express();
// const port = 3001;
// app.use(express.json());
// app.use(cors());
// app.get("/", (req, res) => {
//   res.status(200).send("Home Page...");
// });

// app.get("/about", (req, res) => {
//   res.send("About Page....");
// });
// const users = [];

// app.post("/register_user", (req, res) => {
//   let user_id;
//   if (users.length === 0) {
//     user_id = 1;
//   } else {
//     user_id = users[users.length - 1].id + 1;
//   }
//   const new_user = {
//     id: user_id,
//     name: req.body.name,
//     age: req.body.age,
//     email: req.body.email,
//     password: req.body.password,
//     phone: req.body.phone,
//   };
//   users.push(new_user);
//   console.log(users);
//   res.status(201).json({ message: "User Registered..." });
// });
// app.listen(port, () => {
//   console.log("Server Running....");
// });

const express = require("express");
const app = express();
const port = 3001;

app.use(express.json());

// In-memory book inventory
let books = [];
let nextId = 1;

app.get("/", (req, res) => {
  res.send("Welcome to the Book Bazaar Inventory API!");
});

// Create a New Book
app.post("/books", (req, res) => {
  const { title, author, price } = req.body;
  if (!title || !author || price == null || price <= 0) {
    return res
      .status(400)
      .json({
        error: "All fields are required and price must be a positive number",
      });
  }
  const book = { id: nextId++, title, author, price };
  books.push(book);
  res.status(201).json(book);
});

// Read All Books
app.get("/books", (req, res) => {
  res.status(200).json(books);
});

// Read a Specific Book
app.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.status(200).json(book);
});

// Update Book Information
app.put("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  const { title, author, price } = req.body;
  if (!title || !author || price == null || price <= 0) {
    return res
      .status(400)
      .json({
        error: "All fields are required and price must be a positive number",
      });
  }
  book.title = title;
  book.author = author;
  book.price = price;
  res.status(200).json(book);
});

// Delete a Book
app.delete("/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }
  books.splice(index, 1);
  res.status(204).send();
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
