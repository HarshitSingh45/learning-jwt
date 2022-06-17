require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const port = 8000;

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

app.post('/login', (req,res) => {
    //authenticate user
    const username = req.body.username;
    const user = { name: username};
    // creating json web token
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken});

})

// creating middleware to get token from request header
// jab ek kaam kai baar karna pade then we use middleware 
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

// app.get('/api', (req, res) => {
//     return res.json({
//         message: 'Welcome to this api'
//     })
// });

// // generating a token
// app.post('/api/sign', (req, res) => {
//     const user = {
//         id: 28,
//         username: 'Harshit',
//         email: 'harshit@sj.com'
//     }
//     jwt.sign({user}, 'secret',{expiresIn: '6000s'} , (err, token) => {
//         return res.json({
//             token
//         })
//     })
// })

// app.post('/api/verify', takeToken, (req, res)=> {
//     jwt.verify(req.token, 'secret', (err, data) => {
//         if(err){
//             res.sendStatus(403);
//         }
//         else{
//             res.json({
//                 message: 'User access granted',
//                 data
//             })
//         }
//     })  
// })

// // creating middleware to get token from request header
// // jab ek kaam kai baar karna pade then we use middleware 
// function takeToken(req, res, next){
//     const bearerHeader = req.headers['authorization'];
//     if(bearerHeader !== undefined){
//         const bearer = bearerHeader.split(' ');
//         const bearerToken = bearer[1];
//         req.token = bearerToken;
//         next();
//     }
//     else{
//         return res.sendStatus(403);
//     }
// }

app.listen(port, err => {
    if(err){ console.log('error in running the server'); return}
    console.log(`Server is up and running on port: ${port}`);
})

// creating token
// node 
// require('crypto').randomBytes(64).toString('hex')