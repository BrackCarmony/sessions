const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressSession = require('express-session');

const config = require('./config');
const port = config.port || 8080;

//Middleware
app.use(bodyParser.json())

app.use(expressSession({
  secret:config.sessionSecret, // Secret we use to make sure that cookies
                               // we get back are sent from us.
  resave:false,                // Don't save sessions if no changes have
                               // been made
  saveUninitialized:true,      // Create a session for users even if nothing
                               // has been saved to the session
  cookie:{maxAge:24*60*60*1000,// How many miliseconds the browser should
                               // keep the cookie
          secure:false         // Don't require https to send the cookie
        }
}))

// Serve the build folder even though there's not really a front end in
// this project.  But this will let you see it save the cookie in the
// browser.  Devtools -> Application (top) -> Cookies (left)
app.use(express.static(__dirname+'/../build'));

app.post('/api/login/:username', function(req, res){
  // here we are just assigning a username to the session,
  // In a real application you'd have a password of some sort
  // or a 3rd party autentication such as facebook, google, or Auth0
  req.session.username = req.params.username;
  res.status(200).send("Logged In");
})

app.get('/api/me', function(req, res){
  // Returning all the information saved on the session so we can see
  // what is being saved
  res.send(req.session);
})

app.post('/api/cart', function(req, res){
  // Check to make sure a cart has been created, if not add a card to the
  // session object
  if (!req.session.cart) {
    req.session.cart = [];
  }
  // Push the item they sent in on the body to the cart
  req.session.cart.push(req.body);
  // Send back all the items in the cart
  res.send({message:"Cart contains", cart:req.session.cart});
})

app.delete('/api/cart/:product', function(req, res){
  // Check to see if there is a cart before deleting anything from it
  if (!req.session.cart){
    return res.send("You have no cart");
  }
  // Filter through the items in the cart
  // Keep all items that don't match the product you are deleting
  req.session.cart = req.session.cart
    .filter(e=>e.product != req.params.product)

  // Send back all the items still in the cart
  res.send({message:"Cart contains", cart:req.session.cart});
})

app.listen(port, function(){
  console.log("Listening on port", port);
})
