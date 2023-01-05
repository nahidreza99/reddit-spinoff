function convertTime(time){
    time = secondsSinceEpoch - time;
    if(time < 60){
            var text = document.createTextNode(time + "s ago");
        }
        else if(time/60 < 60){
            time = parseInt(time / 60);
            var text = document.createTextNode(time + "s ago");
        }
        else if(time/3600<24){
            time = parseInt(time/3600);
            var text = document.createTextNode(time+"h ago");
        }
        else if(time/86400<30){
            time = parseInt(time/86400);
            var text = document.createTextNode(time+"d ago");
        }
        else if(time/2628002<12){
            time = parseInt(time/2628002);
            var text = document.createTextNode(time+"m ago");
        }
        else{
            y = parseInt(time/31104000);
            m = parseInt((time%31104000)/2628002);
            var text = document.createTextNode(y+"y "+m+"m");
        }

        return text;
}


// search js 


  const searchForm = document.getElementById('stext');
  const resultsDiv = document.getElementById('slist');

  // Add an event listener to the search form to handle form submissions
  searchForm.addEventListener('submit', (event) => {
    // Prevent the form from submitting
    event.preventDefault();

    // Get the search query from the form
    const query = document.getElementById('query').value;

    // Search for subreddits using PRAW
    //const redditjs = JSON.parse(redditjson);
    const xhr = new XMLHttpRequest();
 
    xhr.open('POST', '/api/search-subreddits', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = () => {
    if (xhr.status === 200) {
    // Parse the response from the server
    const response = JSON.parse(xhr.responseText);
    console.log(response)
    // Clear the results div
    resultsDiv.innerHTML = '';
    // Display the results
    response.subreddit_name.forEach((name) => {
        const p = document.createElement('li');
        p.innerHTML = '<a href="/r/'+name+'">'+name+'</a>';
        resultsDiv.appendChild(p);
        
    }
    );
    } else {
    // Display an error message if the request fails
    resultsDiv.innerHTML = 'An error occurred';
    }

    var searchResults = document.querySelector('#slist');
    searchResults.classList.toggle('open');
  



    };
    xhr.send(`query=${query}`);
//$('#results').slideDown();
    });



//search text
// document.querySelector('button[type="submit"]').addEventListener('click', function(event) {
//     event.preventDefault();
//     var input = document.querySelector('input[type="search"]');
//     var searchText = input.value;
//     console.log(searchText);
//   });
  

  const toggleButton = document.getElementById('toggle-button');
  const inputArea = document.getElementById('input-area');
  const createmod = document.getElementById('create-mod');
  const addmod = document.getElementById('new-mod');

  toggleButton.addEventListener('click', function() {
    if (inputArea.style.display === 'none') {
      inputArea.style.display = 'block';
    } else {
      inputArea.style.display = 'none';
    }
  });

  createmod.addEventListener('click', (event) => {
    // Prevent the form from submitting
    event.preventDefault();
    if (inputArea.style.display === 'none') {
        inputArea.style.display = 'block';
      } else {
        inputArea.style.display = 'none';
      } 

    // Get the search query from the form
    const query = document.getElementById('input-field').value;

    // Search for subreddits using PRAW
    //const redditjs = JSON.parse(redditjson);
    const xhr = new XMLHttpRequest();
 
    xhr.open('POST', '/add_mod', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function ()  {
    if (xhr.status === 200) {
    // Parse the response from the server
    const response = JSON.parse(xhr.responseText);
    console.log(response)
    // Clear the results div
    
    // Display the results
    const p = document.createElement('div');
    p.innerHTML+=' <div class="feature flex"><a class="clickable flex" href=""><i class="fa-brands fa-reddit-alien"></i><p >'+query+'</p></a><div class="info"><ul><li><i class="fa-solid fa-flag"></i></li><li><p>10k</p></li><li><i class="fa-solid fa-ellipsis-vertical"></i></li></ul></div></div>';
    addmod.appendChild(p);
   
   
    
   
  
    } else {
    // Display an error message if the request fails
    addmod.innerHTML = 'An error occurred';
    }

   
  



    };
    xhr.send(`query=${query}`);
//$('#results').slideDown();
    });



// Chat box 



const messege = document.getElementById('message-box');
const send = document.getElementById('send-msg');
const addmsg = document.getElementById('shout-box');


send.addEventListener('click', (event) => {
  // Prevent the form from submitting
  event.preventDefault();
  const query = messege.value;
  messege.value='';
  // Search for subreddits using PRAW
  //const redditjs = JSON.parse(redditjson);
  const xhr = new XMLHttpRequest();

  xhr.open('POST', '/send_msg', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function ()  {
  if (xhr.status === 200) {
  const response = JSON.parse(xhr.responseText);
  const p = document.createElement('div');
  if (response.res=='OK')
  {p.innerHTML+='<div class="message"><div class="msg-info flex"><p class="grey">'+'just now'+'</p><i class="fa-solid fa-circle active"></i></div><p><span class="red">'+'you'+'</span>:</p><p class="msg-body">'+query+'</p></div>';
  }
  else{
    p.innerHTML+='!!!! you need to be logged in '
  }
  addmsg.appendChild(p);
 
 
  
 

  } else {
  // Display an error message if the request fails
  addmsg.innerHTML = 'An error occurred';
  }

 




  };
  xhr.send(`query=${query}`);
  
  });


  // after clicking a playlists , its subreddits will be displayed

  // Get a reference to the container element
  var playlist = document.querySelector('.Playlist');
  const mysubreddit = document.getElementById('my-sub-list');
  // Add an event listener to the container that listens for click events
  playlist.addEventListener('click', function(event) {
    // Check if the clicked element has the 'item' class
    event.preventDefault();
    mysubreddit.innerHTML=''
    if (event.target.classList.contains('item')) {
      // If it does, log the id of the clicked element
      query=event.target.id;
      console.log('playlist '+query)
      const xhr = new XMLHttpRequest();

      xhr.open('POST', '/get_subs/'+query, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onload = function ()  {
      if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      const p = document.createElement('div');

      response.subnames.forEach((name) => {
        
        p.innerHTML += ' <div class=" tttt"><a class="clickable flex  " href="/r/'+name+'" id="subname">'+name+'</a><a  onclick=remove() href="/remove/'+name+'/'+query+'">remove</a></div>';
        
        
    })
     
    mysubreddit.appendChild(p);
    
    
      } else {
      // Display an error message if the request fails
      mysubreddit.innerHTML = 'An error occurred';
      }
    
     
    
    
    
    
      };
      xhr.send(`query=${query}`);




    }
  });

// // now when a user removes a subreddit from playlist it should refresh
// const mysublist = document.querySelector('.tttt');
// mysublist.addEventListener('click', function(event) {
//   // Check if the clicked element has the 'item' class
//   event.preventDefault();

//   if (event.target.classList.contains('xxx')) {
//     // If it does, log the id of the clicked element
//     link=event.target.attr('href');
//     console.log('link '+link)
//     const xhr = new XMLHttpRequest();

//     xhr.open('POST', link, true);
//     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//     xhr.onload = function ()  {
//     if (xhr.status === 200) {
//     const response = JSON.parse(xhr.responseText);
    

//     response.subnames.forEach((name) => {
      
//       console.log(name);
      
      
//   })
   
  
  
  
//     } 
  
   
  
  
  
  
//     };
//     xhr.send(`query=${link}`);




//   }
// });
$('.xxx').click(function(e) {
  e.preventDefault(); // Prevent the link from being followed
  var link = $(this).attr('href'); // Get the link
  console.log(link);
  const xhr = new XMLHttpRequest();
  

  xhr.open('GET', link, true);
  const myArray = link.split("/")
 
   a=xhr.send();
    // Update the text of the element


    $(this).remove();





});
/// updating messegs ///

// Select the element
var element = document.querySelector("#shout-box");

// Add a click event listener to the element
element.addEventListener("click", function(event) {
  // Create a textarea element
  var textarea = document.createElement("textarea");

  // Set the textarea's value to the element's current text
  if (event.target.classList.contains('msg-body'))
  {textarea.value = event.target.innerHTML;
  var id= event.target.id
  console.log('msg '+id);

  // Insert the textarea after the element
  event.target.insertAdjacentElement("afterend", textarea);

  // Remove the element
  //event.target.remove();

  // Focus the textarea
  textarea.focus();
  var msg= document.getElementById(id)
  // Add a blur event listener to the textarea
  textarea.addEventListener("keydown", function(event) {
    // Create a new element
    var newElement = document.createElement("div");

    if (event.key == "Enter") {
      msg.innerHTML = event.target.value;

      xhr.open('POST', '/update_msd/'+id, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onload = function ()  {
      const response = JSON.parse(xhr.responseText);
      console.log(response);
      
    
     
    
      };
      xhr.send(`query=${msg}`);





      // Remove the textarea
      event.target.remove();
    }
    

  });
  textarea.addEventListener("blur", function(event) {
   
      // Remove the textarea
      event.target.remove();
  
    

  });






}



});



   
// function reloadmsg(){
//   console.log('changed ');
//   const xhr = new XMLHttpRequest();
//   const p = document.getElementById('shout-box');
//   xhr.open('GET', '/get_msg', true);
//   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//   xhr.onload = function ()  {
  
//   const response = JSON.parse(xhr.responseText);
  
//   response.forEach((i) => {
//     p.innerHTML+=
//     '<div class="message"> <div class="msg-info flex"> <p class="grey">'+i.created+'</p><i class="fa-solid fa-circle active"></i></div> <p><span class="red">'+i.owner+'</span>:</p><p class="msg-body" id="'+i.id+'">'+i.message+'</p></div>'

// } )

 

//   };
//   xhr.send(`query=${query}`);

// }


let observer = new MutationObserver(mutationRecords => {
  console.log('changed ');
  const xhr = new XMLHttpRequest();
  const p = document.getElementById('shout-box');
  xhr.open('GET', '/get_msg', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function ()  {
    console.log(xhr.responseText);
  const response = JSON.parse(xhr.responseText);
  console.log(response);
  response.res.forEach((i) => {
    p.innerHTML+=
    '<div class="message"> <div class="msg-info flex"> <p class="grey">'+i.created+'</p><i class="fa-solid fa-circle active"></i></div> <p><span class="red">'+i.owner+'</span>:</p><p class="msg-body" id="'+i.id+'">'+i.message+'</p></div>'

} )

 

  };
  xhr.send();




});
// observe everything except attributes
observer.observe(document.getElementById('shout-box'), {
  childList: true, // observe direct children
  subtree: true, // lower descendants too
  characterDataOldValue: true, // pass old data to callback
});


