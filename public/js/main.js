const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

//get username and room name from URL 
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix : true
});


const socket = io();

//join chat room

socket.emit('joinRoom', {username, room})
//Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);
  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message submit

chatForm.addEventListener('submit', (e) =>  {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  console.log(msg);
  //get username, format messages with username nad shit 
  //outputMessage(msg);
  socket.emit('chatMessage', msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//output message 

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = ` <p class="meta"> ${message.username }<span> ${message.time}</span> </p> <p class = "text">
    ${message.text}
    </p>`;
  
  document.querySelector('.chat-messages').appendChild(div);
}