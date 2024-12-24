const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 5010;

// Middleware to parse form data (urlencoded) and JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Serve static files (make sure your HTML is in the 'public' folder)
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get("/", (req, res) => {
    res.status(200).send("Home Page...");
});

// Users array to store registered users
const users = [];

// Register user route (single POST route)
app.post('/submit', (req, res) => {
    console.log('Form Data Received:', req.body); // Check if data is received properly

    let user_id;
    if (users.length === 0) {
        user_id = 1;
    } else {
        user_id = users[users.length - 1].id + 1;
    }

    const new_user = {
        id: user_id,
        name: req.body.name,
        email: req.body.email,
        user: req.body.user,
        phone: req.body.phone,
        password: req.body.password
    };

    users.push(new_user);
    console.log(users); // Logs the updated list of users
    res.status(202).json({ message: "User Registered..." });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
