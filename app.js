require('dotenv').config(); 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var md5 = require('md5');




const app = express();



app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended:true
}));



main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/userDB');
}


const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


const User = new mongoose.model("User",userSchema);






app.get("/" , function(req, res){
   res.render("home");
});

app.get("/login" , function(req, res){
    res.render("login");
 });

 app.get("/register" , function(req, res){
    res.render("register");
 });

 app.post("/register" , function(req, res){
    const newUser = new User({
        email:req.body.username,
        password:md5(req.body.password)
    });

      newUser.save()
      .then(function() {
        res.render("secrets");
      })
      .catch(function(err) {
        console.log(err);
      });

 });

 app.post("/login", function(req, res){

   const username = req.body.username;
   const password = md5(req.body.password);

   User.findOne({email: username})
      .then(function (foundUser) {
        if(foundUser.password === password){
            res.render("secrets");
        }    else {
            res.send("User email or password is incorrect");
        }
      })
      .catch(function(err) {
        console.log(err);
        res.send("An error occurred while logging in");
      });
  });











app.listen(3000, function(){
    console.log("Server is running on port 3000.");
});