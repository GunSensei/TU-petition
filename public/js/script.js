document.getElementById('show-password').addEventListener('click', function (event) {
    event.preventDefault();

    const passwordInput = document.getElementById('password'); 
    const icon = this.querySelector('img'); 

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';  
        icon.src = 'img/visibility_off_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg';  
    } else {
        passwordInput.type = 'password'; 
        icon.src = 'img/visibility_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg';  
    }
});

function handleLogout() {
    console.log("Logout button clicked!");
}

function submitLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    const loginBtn = document.getElementById('loginBtn'); 
    const accessToken = `TU694c294fdf7bd8bd4cf7cbd5704b5b0b03c48cd28406758657cd1035a6f9120efe3437be04d02ec0b8ad19ed9e51d4d9`;

    loginBtn.innerText = "Logging in...";
    loginBtn.disabled = true;

    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Application-Key': accessToken,
        },
        body: JSON.stringify({
            UserName: username,
            PassWord: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.displayname_th) {
            messageDiv.innerText = "Name: " + data.displayname_th;
            loginBtn.innerText = "Logged In"; 
            loginBtn.disabled = true; 
        } else {
            messageDiv.innerText = "Login failed, please try again.";
            loginBtn.innerText = "Login"; 
            loginBtn.disabled = false;
        }
    })
    .catch(error => {
        console.error('Error occurred:', error);
        messageDiv.innerText = "Error occurred during login: " + error.message;
        loginBtn.innerText = "Login";
        loginBtn.disabled = false;
    });
}
