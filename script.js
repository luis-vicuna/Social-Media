const form = document.querySelector('form');//form that collects data
const API_URL = 'http://localhost:5000/feed'//where is the data going to .. send to dynamic server
const feedElement = document.querySelector('.feed');//feed that contains data
const posts = document.getElementById('posts');//posts the data on the site
const btn = document.getElementById('toggle');//submit button



btn.onclick = function () {
  if (posts.style.display === 'none') {
    posts.style.display = 'block';
  } else {
    posts.style.display = 'none';
  }
};

listfeed();

form.addEventListener('submit', (event)=>{
  event.preventDefault();//prevent what browser usually does when information submitted
  //grab info submitted
  const formData = new FormData(form);
  const name = formData.get('name');
  const username = formData.get('username');
  const post = formData.get('post');

  const info = {//object
    name,
    username,
    post
  };
  console.log(info);
  fetch(API_URL, {//make a request
    method:'POST',//send data
    body: JSON.stringify(info),//turn object into something the server can understand
    headers:{ //what are we sending it
      'content-type':'application/json'//Sending an application
    }
  })
  .then(response =>response.json())//give response back
    .then(createdFeed=>{//after this is done
      console.log(createdFeed);
      form.reset();//clear form
      listfeed();
    });
});


//once all inputs are filled and submit button is clicked
//this function logs the data to mongoDB and displayed using html
function listfeed(){
  feedElement.innerHTML = '';// blank what element was there
  fetch(API_URL)//make request to server
    .then(response=> response.json())//give response back
    .then(feed=>{
    console.log(feed);
    feed.reverse();//recent first
    feed.forEach(info=>{// for every element in array place on page
      const div = document.createElement('div');// create div
      div.className= "card darkmode my-3 p-3 shadow";

      const header = document.createElement('h3');
      header.textContent = info.name;

      const header1 = document.createElement('h6');
      header1.textContent = '@' + info.username;
      header1.className= "text-primary";

      const posts = document.createElement('p');
      posts.textContent = info.post;


      div.appendChild(header);
      div.appendChild(header1);
      div.appendChild(posts);


      feedElement.appendChild(div);
    });
  });
}
