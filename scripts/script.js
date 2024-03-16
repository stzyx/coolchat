if (localStorage.getItem('token') === null) {
    window.location.replace("/identity/");
} else {
const sendBtn = document.querySelector('.wrapper span');
const chatbox = document.getElementById('chatbox');

const ws = new WebSocket('wss://socket.styy.me');
ws.onmessage = async function incoming(event) {
  const dataText = await event.data.text();  
  const data = JSON.parse(dataText);
  const avatar = data.avatar;
  const msg = data.msg;
  const username = data.username
    
  const chatContainer = document.createElement('div');
chatContainer.className = 'rText';
  const message = document.createElement('div');
  message.className = 'rMessage';
  message.innerHTML = `
    <img class="rAvatar" src=${avatar} alt="Avatar">
    <div class="rMessageContent">
        <span class="rUsername">${username}</span>
     <p class="rMessageText">${msg}</p>
     </div>
    `;
    chatContainer.appendChild(message);
    chatbox.appendChild(chatContainer);
    chatbox.scrollTop = chatbox.scrollHeight;
};
function sendMessage() {
    const luid = localStorage.getItem('uid');
    const tsend = {
        uid: luid,
        msg: document.getElementById('message').value
    }
    const payload = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(tsend)
    }
    fetch("https://api.styy.me/v1/chat/send", payload)
}
sendBtn.addEventListener('click', () => {
    sendMessage();
    document.getElementById('message').value = null;
    chatbox.scrollTop = chatbox.scrollHeight;
});
}    