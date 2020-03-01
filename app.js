//jshint esversion:6

//==============================================================================
// Initialize Website
//==============================================================================
// require modules
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
// const _ = require("lodash");

// create express function
const app = express();

console.log(process.env.API_KEY);
// use express
app.use(express.static("public"));
// set EJS
app.set('view engine', 'ejs');
// use body parser
app.use(bodyParser.urlencoded({
  extended: true
}));
//==============================================================================
// Initialize Mongoose
//==============================================================================
// Connect to a server
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});

// Create schemas
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

// Add encryption capabilites to the userSchema

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

// Create models
const User = mongoose.model("User", userSchema);

// Initialize default users

// Create the users array
// let articles = [];
//==============================================================================
app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (!err){
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    } else{
      console.log(err);
    }
  });
});
//==============================================================================



//==============================================================================
app.listen(3000, function(){
  console.log("Server started on port 3000");
});
