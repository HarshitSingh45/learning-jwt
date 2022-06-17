// implement refresh token 
// 2 servers 1 server for token generation , deletion refres
// other for api use case 
// this allows us 

// why we need refresh token
// so what token we created has no expiration date
// it means if anyone has access to this token will have forever access like api key
// so idea of refresh token is you use refresh token and access token will have expiry in very short duration
// so if anyone got your access token, they will have access for very short duration
// using logout route you can delete refresh token
// 2 reasons for using refresh token is
// invalidating fake user
// move the authorization requests to another server
 

require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const port =4000;

const app = express();

app.use(express.json());

let refreshTokens = []

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

app.post('/login', (req, res) => {
  // Authenticate User

  const username = req.body.username
  const user = { name: username }

  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)
  res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}


app.listen(port, err => {
    if(err){ console.log('error in running the server'); return}
    console.log(`Server is up and running on port: ${port}`);
})
