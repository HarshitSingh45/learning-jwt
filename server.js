require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const port =3000;

const app = express();

// this lets our application to use json from the body 
app.use(express.json());

const posts = [
    {
        username: 'Harshit',
        title: "Hey there"
    },
    {
        username: 'Ankit',
        title: "Hello"
    },
    {
        username: 'Ankur',
        title: "Whats up !! "
    },
]

app.get('/posts',authenticateToken, (req,res) => {
    res.json(posts.filter(post => post.username === req.user.name));
})

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    // Bearer Token
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user;
        next();
    })
}

app.listen(port, err => {
    if(err){ console.log('error in running the server'); return}
    console.log(`Server is up and running on port: ${port}`);
})

