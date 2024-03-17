if (localStorage.getItem('token')) {
    fetch("https://api.styy.me/v1/check/data", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            uid: localStorage.getItem('uid'),
            check: "avatar"
        })
    }).then(response => response.text()).then(data => {
        if (data != "yep") {
            window.location.replace("/avatars/");
        } else {
            window.location.replace("/app/");
        }
    })
} else {    
const createBtn = document.querySelector('span');
var userid = document.getElementById('username');
var pass = document.getElementById('pass');

function changeUi() {
    createBtn.innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>';
}
function dataApi() {
    if (userid.value === '' || pass.value === '') {
        alert('Username and password cannot be empty.');
        location.reload(); // Reload the page
        return; // Exit the function
    }
    const data = {
        username: userid.value,
        password: pass.value
    };
    const payload = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }
    fetch('https://api.styy.me/v1/create', payload)
    .then(response => response.text())
    .then(data => {
            localStorage.setItem('token', JSON.parse(data).token);
            localStorage.setItem('uid', JSON.parse(data).uid);
            window.location.replace("/avatars/")
    })
    .catch(error => {console.error('Error:', error);});
}

createBtn.addEventListener('click', () => {
    changeUi();
    dataApi();
});
}