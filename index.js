const express = require('express');//framework that  helps manage servers
const cors = require('cors');// eliminate communictaion error
const app = express();//library
const monk = require('monk')//substantial usability improvements for MongoDB usage within Node.JS
const db = monk(process.env.MONGO_URI || 'localhost/feeder');//mongodb
const feed = db.get('feed');//create collection in database

app.use(cors());//stops fetch error
app.use(express.json());//parse and put in body


//When you receive a GET request run this function, req= request & res = response
app.get('/',(req,res)=>{
  //when the client makes a get request respond with
  res.json({
    message: 'hey!'
  });
})

app.get('/feed',(req,res)=>{
  feed
  .find()
  .then(feed => {
    res.json(feed);
  });
});

//This function makes sure the input fields are not empty
function isValidFeed(val){
  return val.name && val.name.toString().trim() !== '' &&
    val.username && val.username.toString().trim() !== '' &&
    val.post && val.post.toString().trim() !== '';
}

//This is the proccess of the feed being created going through neccesary conditions
app.post('/feed', (req, res)=>{
  if(isValidFeed(req.body)){//validate
    const info ={
      name: req.body.name.toString(),
      username: req.body.username.toString(),
      post: req.body.post.toString()
    };
    feed
      .insert(info)
      .then(createdFeed =>{
          res.json(createdFeed);
      });
  }else{
    res.status(422);
    res.json({
      message: "Content requiered"
    });
  }
})

app.listen(5000, ()=>{//backend server listen on 5000
  console.log('listening on http://localhost:5000');
});
