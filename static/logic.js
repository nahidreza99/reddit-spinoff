const mysubreddit = document.getElementById('my-sub-list');



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

let requestSent = false;
// search js 


  const searchForm = document.getElementById('stext');
  const resultsDiv = document.getElementById('slist');

  // Add an event listener to the search form to handle form submissions
  searchForm.addEventListener('click', (event) => {
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
    
    // Display the results
    response.subreddit_name.forEach((name) => {
        const p = document.createElement('div');
        let sub = '<a href="/r/'+name+'">'+name+'</a>';
        p.innerHTML += '<div class="feature flex"><a class="clickable flex" href=""> <i class="fa-brands fa-reddit-alien"></i><p>'+sub+'</p></a><div class="info"><ul><li><i class="fa-solid fa-flag"></i></li><li><p>10k</p></li><li><i id="'+'r_'+name+'" class="fa-solid fa-circle-plus"></i></li></ul></div></div>';
        mysubreddit.appendChild(p);
        let newVar = document.getElementById('r_'+name);
        let showMods = document.getElementById('add-sub');
        newVar.addEventListener('click',(event) => {
          console.log('working');
          var xhr = new XMLHttpRequest();
          xhr.open("POST", "/get_mods", true);
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          xhr.onload = function ()  {
          if (xhr.status === 200) {
          // Parse the response from the server
            var newRes = JSON.parse(xhr.responseText);
            newRes.list.forEach((newName)=>{
              //showMods.innerHTML += '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton " id="playlist-list">{%for item in get_mods(session["user_id"])%}{%endfor%}</div>'
              showMods.innerHTML += '<a class="dropdown-item" href="/add_to_playlist/'+newName.id+'/'+name+'">'+newName.name+'</a>';
            });

          }
          };
          xhr.send();
          });
    }
    );
    } else {
    // Display an error message if the request fails
    //resultsDiv.innerHTML = 'An error occurred';
    }

    var searchResults = document.querySelector('#slist');
    //searchResults.classList.toggle('open');
  



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
  
//// Create Playlist
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
  requestSent = false;
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

  var playlist = document.querySelector('.Playlist');
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
        
        //p.innerHTML += '<div class=" tttt"><a class="clickable flex  " href="/r/'+name+'" id="subname">'+name+'</a><a  onclick=remove() href="/remove/'+name+'/'+query+'">remove</a></div>';
        p.innerHTML += '<div class="feature flex"><a class="clickable flex" href=""> <i class="fa-brands fa-reddit-alien"></i><p>'+name+'</p></a><div class="info"><ul><li><i class="fa-solid fa-flag"></i></li><li><p>10k</p></li><li><a  onclick=remove() href="/remove/'+name+'/'+query+'"><i class="fa-solid fa-xmark"></i></a></li></ul></div></div>';
        
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

/// this is the remove subreddit part that doesnt work
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
  console.log('msg '+id);
  var msg= document.getElementById(id);
  // Add a blur event listener to the textarea
  textarea.addEventListener("keydown", function(e) {
    // Create a new element
    var newElement = document.createElement("div");

    if (e.key == "Enter") {
      console.log(textarea.value)
      msg.innerText = textarea.value;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/update_msg/'+Number(id.split('-')[1]), true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onload = function ()  {
       
      console.log(xhr.responseText);
      
    
     
    
      };
      console.log('text'+msg.value);
      xhr.send(`query=${msg.innerText}`);





      // Remove the textarea
      e.target.remove();
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
//   p.innerHTML='';
//   console.log(response)
//   response.res.forEach((i) => {
//     p.innerHTML+=
//     '<div class="message"> <div class="msg-info flex"> <p class="grey">'+i.created+'</p><i class="fa-solid fa-circle active"></i></div> <p><span class="red">'+i.owner+'</span>:</p><p class="msg-body"  id="'+i.id+'">'+i.message+'</p></div>'

// } )

 

//   };
//   xhr.send();

// }

// refresh the shout box on new messenge 
let observer = new MutationObserver(mutations => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0 &&  !requestSent ) {
      console.log('changed ');
      const xhr = new XMLHttpRequest();
      const p = document.getElementById('shout-box');
      xhr.open('GET', '/get_msg', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send();
      xhr.onload = function ()  {
         requestSent = true;
        console.log(xhr.responseText);
      const response = JSON.parse(xhr.responseText);
      console.log(response);
      p.innerHTML=''
      response.res.forEach((i) => {
        p.innerHTML+=
        '<div class="message"> <div class="msg-info flex"> <p class="grey">'+i.created+'</p><i class="fa-solid fa-circle active"></i></div> <p><span class="red">'+i.owner+'</span>:</p><p class="msg-body" id="msg-'+i.id+'">'+i.message+'</p></div>'
    
    } )
    
     
    
      };
      

    }
  });
  




});
// observe everything except attributes
var s=document.getElementById('shout-box');
observer.observe(s, {
  childList:true,

});


// theme

const theme = document.getElementById('theme');
let theme_toggle = 0;
theme.addEventListener('click',function(event) {
  const nav = document.getElementById('nav');
  const par = document.getElementsByTagName('p');
  const logo = document.getElementsByClassName('logo');
  const left = document.getElementById('left');
  const center = document.getElementById('center');
  const user = document.getElementById('user-info');
  const shoutbox = document.getElementById('shoutbox');
  nav.classList.toggle("light-main");
  if(theme_toggle){
    left.classList.replace("light-main","dark-main");
    center.classList.replace("light-main","dark-main");
    user.classList.replace("light-main","dark-main");
    shoutbox.classList.replace("light-main","dark-main");
    theme_toggle=0;
    for(var p of par){
      p.classList.toggle("dark-font");
    }
  }
  else{
    left.classList.replace("dark-main", "light-main");
    center.classList.replace("dark-main","light-main");
    user.classList.replace("dark-main","light-main");
    shoutbox.classList.replace("dark-main", "light-main");
    theme_toggle=1;
  }
});
