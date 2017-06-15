'use strict';

var cookieSession = require('cookie-session');
var jwt = require('jsonwebtoken');
var express = require('express');
var app = express();

app.use(cookieSession({
  name: 'session',
  keys: ['Katie'], //this is the password for the cookie

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


app.get('/login' , (req, res, next) => {
  //normally check req.body and verify username/pw in DB.

  var token = jwt.sign({loggedIn: true}, 'shhhPasswordSecret');

  req.session.jwt = token;

  res.send("Logged In");

});

app.get('/secret', loggedIn, (req, res, next) => {
  res.send("you should be logged in to see this!");
});

function loggedIn(req, res, next){
  if(req.session.jwt){
    //Validate JWT token
    jwt.verify(req.session.jwt, 'shhhPasswordSecret', function(err,decoded){
      if (err) {
        res.sendStatus(403);
      } else {
        req.user = decoded;
        console.log(decoded);
      }
      // console.log(decoded.foo);
    });
  }
};

function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin){
    console.log("is admin");
  } else {
    res.sendStatus(403);
  }
  next();
}

app.listen(3000 , function() {
  console.log("listening on port 3000");
});
