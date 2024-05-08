import config from './config.js';

console.log(config.apiKey); // This will output the API key
const api_key=config.apiKey;

window.addEventListener('DOMContentLoaded', (event) => {   //this will load the stack from the storage
    loadStackFromStorage();
});

function loadStackFromStorage() {
    const storedStack = localStorage.getItem('stack'); //local storage makes sure the values are
    if (storedStack) {
        stack.items = JSON.parse(storedStack);
          //update the table if there are elements in the stack
    }
}

function updateStorage() {
    localStorage.setItem('stack', JSON.stringify(stack.items));  //this will store a json value
}











class Stack {   //stack datastructure to keep store of the videos
  
    constructor() {
      this.items = [];
    }
  
    // Push a triple of items to the top of the stack
    pushTriple(item1, item2, item3) {
      this.items.push([item1, item2, item3]);
      updateStorage(); // Update localStorage after pushing
      console.log("Pushed");
    }
  
    // Pop and return the top triple of items from the stack
    popTriple() {
      if (this.isEmpty()) {
        return "Underflow";
      }
      
      const poppedItem=this.items.pop();
      updateStorage(); 
      return poppedItem;
    }
  
    // Peek at the top triple of items without removing it
    peekTriple() {
      return this.items[this.items.length - 1];
    }
  
    // Check if the stack is empty
    isEmpty() {
      return this.items.length === 0;
    }
  
    // Return the size of the stack
    size() {
      return this.items.length;
    }
  
    // Clear the stack
    clear() {
      this.items = [];
    }
  
    // Print the stack elements
    print() {
      console.log(this.items.map(triple => `[${triple[0]}, ${triple[1]}, ${triple[2]}]`).join(', '));
    }
  }
  
  const stack = new Stack();

  
























 let alertDiv = document.querySelector('.alert');
  alertDiv.style.display = 'none'; // Hide the alert

function extractVideoId(url) { 
  // Regular expression to match YouTube video ID in various URL formats
  const pattern =
    /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(pattern);

  if (match) {
    // Extracted video ID is in the first capturing group
    return match[1];
  } else {
    // No match found
    return null;
  }
}

function updateText()
{
    const some_text=document.getElementById('empty');
    loadStackFromStorage(); //if there is storage
    if(stack.size()>0) some_text.textContent="";
    else some_text.textContent="No videos added";
}


function updateTable() {
     const tableBody = document.getElementById('stack-table-body');
    
    console.log("Updating table...")
    tableBody.innerHTML = ''; // Clear previous content

    // Iterate through stack items and create table rows for each pair
    stack.items.forEach(([title, thumbnailUrl, url], index) => {
        const newRow = tableBody.insertRow();
        const titleCell = newRow.insertCell(0);
        const link_to_yt=document.createElement('a');
        link_to_yt.textContent=title;
        link_to_yt.href=url;
        titleCell.appendChild(link_to_yt);
        console.log("the title is ", titleCell);
        const thumbnailCell = newRow.insertCell(1);
        const thumbnailImage = document.createElement('img');
        thumbnailImage.src = thumbnailUrl; 
        thumbnailImage.alt = 'Thumbnail';
        thumbnailImage.width =180; 
        thumbnailImage.height=100;
        thumbnailCell.appendChild(thumbnailImage);
    });
}

// const api_key='AIzaSyC12JIrK_zlltWnNlYFMWKRQ69g6uSsIDk';  //api key


function displayAlert() {  //this is to display the alert
    const alertDiv = document.querySelector('.alert');
    alertDiv.style.display = 'block'; // Show the alert
    setTimeout(() => {
        alertDiv.style.display = 'none'; // Hide the alert after 3 seconds
    }, 3000);
}
function handleBnState()   //button to be disabled when the input is empty
{
    const videoUrl = document.getElementById("video-url").value;
    const addButton = document.getElementById("add_button");
    
    if (videoUrl === "") {
        addButton.disabled = true;
    } else {
        addButton.disabled = false;
    }
}


function addVideo() {   //add video
  const videoUrl = document.getElementById("video-url").value;
  const videoId = extractVideoId(videoUrl);
  console.log("Clicked!");
  console.log("Video ID:", videoId); 
  console.log("fetching details.........");
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${api_key}&part=snippet`;
    
    fetch(url)
    .then(response=>response.json())
    .then(data=>
        {
            console.log('API response:',data.items[0].snippet.title);
            console.log('Thumbnail URL :', data.items[0].snippet.thumbnails.default.url)
            let url_video=data.items[0].snippet.title;
            let url_thumbnail=data.items[0].snippet.thumbnails.default.url;
            stack.pushTriple(url_video,url_thumbnail,videoUrl); //pushing in stack
            handleButtonState();
            updateTable();
            updateText();
    })
    .catch(error => {
        console.error('Error fetching video details:', error);
        displayAlert();
    });


  
}
function clearTable() 
{
    console.log("cleared!");
    const tableBody = document.getElementById('stack-table-body');
    stack.clear();
    localStorage.clear();
    updateTable();
    updateText();
    updateStorage(); //update the storage settings

}
function removeTop()
{
    console.log("popping");
    stack.popTriple();
    updateStorage();
    handleButtonState();

    updateTable();
    updateText();

}
function handleButtonState()
{
    const top_button=document.getElementById("clear__top_button");
    loadStackFromStorage();
    if(stack.size() >0) top_button.disabled=false;
    else top_button.disabled=true;
}
handleButtonState();
updateTable(); //update the table after accessing the local storage and filling up the stack
updateText(); //call update text in the starting to see cuz we might have elements in the starting
document.getElementById("clear__top_button").addEventListener("click",removeTop);
document.getElementById("clear_button").addEventListener("click",clearTable);
document.getElementById("video-url").addEventListener("input",handleBnState);
handleBnState();
document.getElementById('add_button').addEventListener('click', () => {
    addVideo(); 
});
//some changes
