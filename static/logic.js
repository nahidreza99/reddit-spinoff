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
  