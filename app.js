const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 5011;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));


app.get("/", (req, res) => {
    res.status(200).send("Home Page...");
});


const users = [];

app.post('/submit', (req, res) => {
    console.log('Form Data Received:', req.body); 

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
    console.log(users); 
    res.status(202).json({ message: "User Registered..." });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
