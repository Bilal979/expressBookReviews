const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  //Write your code here
  const {userName, password } = req.body;
  if(!userName || !password){
    return res.status(400).json({message:'Username and Password are required'});
  }

  if(isValid(userName)){
   return res.status(400).json({message:'Username already registered'}); 
  }

  users.push(
    {
      userName,
      password
    }
  );
  return res.status(201).json({message:`User ${userName} was registered successfully`});
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
  // return res.status(300).json({message: "Yet to be implemented"});
});

// get book list using promise with axios
public_users.get('/async', (req, res)=>{
  const fetchBooks = new Promise((resolve, reject)=>{

    const bookData = axios.get('http://localhost:5000/').then((response)=>{
      resolve(response);
    }).catch((err)=>{
      reject(err);
    });
   
  });

  fetchBooks.then((bookData)=>{
    res.json(bookData.data);
  }).catch((err)=>{
    res.status(500).json({message:'Error fetching book data', error: err.message});
  });

})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const filteredBooks = Object.fromEntries(Object.entries(books).filter(([key, value])=>{
    return key === isbn;
  }));
  return res.json(filteredBooks);
  // return res.status(300).json({message: "Yet to be implemented"});
 });

 // Get async book details based on ISBN
public_users.get('/async/isbn/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  try{
    const response = await axios.get('http://localhost:5000/isbn/'+isbn);
    return res.json(response.data);
  }catch(err){
    return res.status(500).json({message:'Error fetching book data', error: err.message});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  const filteredBooks = Object.fromEntries(Object.entries(books).filter(([key, value])=>{
    return value.author === author;
  }))
  return res.json(filteredBooks);
  // return res.status(300).json({message: "Yet to be implemented"});
});


// Get async book details based on author
public_users.get('/async/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author;
  try{
    const response = await axios.get('http://localhost:5000/author/'+author);
    return res.json(response.data);
  }catch(err){
    return res.status(500).json({message:'Could not fetch boks', err: err.message});
  }

  
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title.trim();
    console.log(title)

  const filteredBooks = Object.fromEntries(Object.entries(books).filter(([key, value])=>{
    return value.title === title;
  }))
  return res.json(filteredBooks);
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get async all books based on title
public_users.get('/async/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title.trim();

    const fetchBooks = new Promise((resolve, reject)=>{
      const data = axios.get('http://localhost:5000/title/'+title).then(data=>{
        resolve(data);
      }).catch(err=>{
        reject(err);
      })
    });

    fetchBooks.then(data=>{
      return res.json(data.data);
    }).catch(err=>{
      return res.status(500).json({message:"could not fetch books", err:err.message});
    });

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn.trim();

  const filteredBooks = Object.entries(books).filter(([key, value])=>{
    return key === isbn;
  });
  if(filteredBooks.length == 0){
    return res.status(400).json({message:'No Books Found'});
  }
  return res.json(filteredBooks[0][1].reviews);
  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
