const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  const user = users.find(elem=>{
    return elem.userName === username
  });
  return !!user;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const user = users.find(elem=>{
    return elem.userName === username && elem.password === password;
  });

  return !!user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {userName, password} = req.body;
  if(!userName || !password){
    return res.status(400).json({message:'User name and password are required'});
  }

  if(authenticatedUser(userName, password)){
    // Sign JWT
    const accessToken = jwt.sign({userName, password}, 'access', {expiresIn: 60 * 60});
    req.session.accessToken = accessToken;
    return res.status(200).json({message:'User successfully logged in'});
  } else{
    return res.status(401).json({message:'Invalid Login'})
  }

  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.query.review;
  const isbn = req.params.isbn;

  if(!review || !review.trim()){
    return res.status(400).json({message:'Please provide a review'})
  }

  const book = books[isbn];
  if(!book){
    return res.status(404).json({message:'Book not found'});
  }
  const userName = req.user.userName;
  book.reviews[userName] = review;
  return res.status(301).json({message: `Review was successfully added for the book`});
  // return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;

  const book = books[isbn];
  if(!book){
    return res.status(404).json({message:'Book not found'});
  }
  const userName = req.user.userName;
  delete book.reviews[userName];
  return res.status(301).json({message: `Review was successfully deleted for the book`});
  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
