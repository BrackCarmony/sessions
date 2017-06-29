const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressSession = require('express-session');

const config = require('./config');
const port = config.port || 8080;

//Middleware
app.use(bodyParser.json())
app.use(expressSession({
  secret:config.sessionSecret,
  resave:false,
  saveUninitialized:true,
  cookie:{maxAge:24*60*60*1000, secure:false}
}))

app.use(express.static(__dirname+'/../build'));

app.post('/api/login/:username', function(req, res){
  // Check DB to see if username and encrypted password match
  req.session.username = req.params.username;
  res.status(200).send("Logged In");
})

app.get('/api/me', function(req, res){
  res.send(req.session);
})

app.post('/api/cart', function(req, res){
  if (!req.session.cart) {
    req.session.cart = [];
  }
  req.session.cart.push(req.body);
  res.send({message:"Cart contains", cart:req.session.cart});
})

app.delete('/api/cart/:product', function(req, res){
  if (!req.session.cart){
    return res.send("You have no cart");
  }
  req.session.cart = req.session.cart
    .filter(e=>e.product != req.params.product)
  res.send({message:"Cart contains", cart:req.session.cart});
})

app.listen(port, function(){
  console.log("Listening on port", port);
})
