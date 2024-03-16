if (localStorage.getItem('token') === null) {
    window.location.replace("/identity/");
} else {
const avatars = document.querySelectorAll('.avatarsList img')

avatars.forEach((avatar) => {
    avatar.addEventListener('click', () => {
        var uid = localStorage.getItem('uid');
        var token = localStorage.getItem('token');
        const data = {
            avatar: event.target.src.split('/').pop(),
            avuid: uid,
            avtoken: token
        };
        const payload = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }
        fetch('https://api.styy.me/v1/avatar/update', payload)
        .then(response => response.text())
        .then(data => {
            if (data === "ok") {
                window.location.replace("/app/");
            } else {
                alert("smth went wrong whdafack!")
            }})
        .catch(error => {console.error('Error:', error);});
    });
});}