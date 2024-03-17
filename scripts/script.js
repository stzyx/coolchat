if (localStorage.getItem('token') === null) {
    window.location.replace("/identity/");
} else {
loadMessages();    
const sendBtn = document.querySelector('.wrapper span');
const chatbox = document.getElementById('chatbox');
    //console.log(chatbox)
const ch = document.getElementById('handle')
var isLoading = false;    
const ws = new WebSocket('wss://socket.styy.me');
ws.onmessage = async function incoming(event) {
  const dataText = await event.data.text();
  const data = JSON.parse(dataText);
  const avatar = data.avatar;
  const msg = data.msg;
  const msg_id = data.msg_id;  
  const username = data.username;
  const mtype = 'rMessageContent';  
  addMessage(msg_id, avatar, msg, username, mtype);
  document.getElementById(`${msg_id}`).scrollIntoView({ behavior: 'smooth' });
};
function addMessage(msg_id, avatar, msg, username, mtype) {
    const rmessage = document.createElement('div');
    rmessage.className = 'rMessage';
    rmessage.id = `${msg_id}`;
    const avatarImg = document.createElement('img');
    avatarImg.className = 'rAvatar';
    avatarImg.src = avatar;
    avatarImg.alt = 'Avatar';
    const usernameSpan = document.createElement('span');
    usernameSpan.className = 'rUsername';
    usernameSpan.textContent = username;
    const messageText = document.createElement('p');
    messageText.className = 'rMessageText';
    messageText.textContent = msg;
    const messageContent = document.createElement('div');
    messageContent.className = mtype;
    messageContent.appendChild(usernameSpan);
    messageContent.appendChild(messageText);
    rmessage.appendChild(avatarImg);
    rmessage.appendChild(messageContent);
    chatbox.appendChild(rmessage);
}    
function loadMessages() {
        if (isLoading) return;
        isLoading = true;
        $.ajax({
          url: 'https://api.styy.me/v1/chat/history',
          method: 'POST',
          data: { offset: 0, limit: 100 },
          success: function(response) {
            displayMessages(response);
            isLoading = false;
          },
          error: function(xhr, status, error) {
            console.error('Error loading messages:', error);
            isLoading = false;
          }
        });
    }
    

function displayMessages(messages) {
        //console.log(messages) 
        messages.forEach(function(message, index) {
        const username = message.username;
        const msg = message.msg;
        const avatar = message.avatar;
        const mtype = "rMessageContentHistory"
        const msg_id = message.msg_id;    
        addMessage(msg_id, avatar, msg, username, mtype);
        if (index === messages.length - 1) {
            document.getElementById(`${msg_id}`).scrollIntoView({ behavior: 'smooth' });
        }
        });
    }
    
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
});
document.querySelector('#menu').addEventListener('click',() => {
    if (document.querySelector('#menu').innerText === "menu") {
        document.querySelector(".drawer").style.width = "300px";
        fetch('https://api.styy.me/v1/get/avatar', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                uid: localStorage.getItem('uid')
            })
        }).then(response => response.text()).then(data => {
            //console.log(data)
            document.getElementById('pfp').src = JSON.parse(data).avatar;
        });
        document.querySelector(".drawer").style.border = "2px solid whitesmoke";
        document.querySelector('#menu').innerText = "close";
    }
    else {
        document.querySelector(".drawer").style.width = "0";
        document.querySelector(".drawer").style.border = "none";
        document.querySelector('#menu').innerText = "menu"
    }
});
    
document.querySelector(".avCh").addEventListener('click', () => {
    window.location.href = "http://localhost:8080/avatars/"
});
document.querySelector(".nameEdit").addEventListener('click', () => {
    let uInput = document.getElementById('toChange').value.toString();
    if (uInput.length > 26) {
        uInput = uInput.substring(16);
    } else {}
    
    fetch('https://api.styy.me/v1/edit/username', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                uid: localStorage.getItem('uid'),
                token: localStorage.getItem('token'),
                usern: uInput
            })
        }).then(response => response.text()).then(data => {
            if (data === "ok") {
                alert("Changed Succesfully!");
                document.getElementById('toChange').value = '';
            }
        });
});
}    