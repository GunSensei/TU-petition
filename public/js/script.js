document.getElementById('show-password').addEventListener('click', function (event) {
    event.preventDefault();

    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('img');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.src = 'img/visibility_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg';
    } else {
        passwordInput.type = 'password';
        icon.src = 'img/visibility_off_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg';
    }
});

document.getElementById('clear-name').addEventListener('click', function () {
    document.getElementById('username').value = '';
});

document.getElementById('clear-password').addEventListener('click', function () {
    document.getElementById('password').value = '';
});

function handleLogout() {
    document.getElementById('message').innerText = '';
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.innerText = 'Login';
    loginBtn.disabled = false;
    document.getElementById('display-container').innerHTML = '';
    document.getElementById('username').value ='';
    document.getElementById('password').value='';
    console.log('User has logged out');
}

function submitLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    const loginBtn = document.getElementById('loginBtn');
    const accessToken = `TU694c294fdf7bd8bd4cf7cbd5704b5b0b03c48cd28406758657cd1035a6f9120efe3437be04d02ec0b8ad19ed9e51d4d9`;
    const displayID = document.getElementById('display-container');
    
    loginBtn.innerText = "Logging in...";
    loginBtn.disabled = true;

    document.getElementById('clear-name').disabled = true;
    document.getElementById('clear-password').disabled = true;
    document.getElementById('show-password').disabled = true;
    
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
            throw new Error('Login failed. Please check your credentials.');    
        }
        return response.json();
    })
    .then(data => {
        if (data.displayname_th) {
            setTimeout(() => {
                messageDiv.innerText = `Name: ${data.displayname_th}`;
                loginBtn.innerText = "Logged In";
                loginBtn.disabled = true;

                document.getElementById('username').disabled = true;
                document.getElementById('password').disabled = true;

                displayID.innerHTML = `
                <p>${data.message}</p>
                <p>${data.displayname_th}, ${data.faculty}</p>
                `;

                fetch("http://localhost:8080/api/students/add", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "engName": data.displayname_en,
                        "email": data.email,
                        "faculty": data.faculty,
                        "type": data.type,
                        "userName": data.userName,
                        "password": password
                    })
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Data saved to database:', data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }, 2000);
        } else {
            messageDiv.innerText = "Login failed, please try again.";
            loginBtn.innerText = "Login";
            loginBtn.disabled = false;
        }
    })
    .catch(error => {
        console.error('Error occurred:', error);
        messageDiv.innerText = "Something went wrong. Please try again.";
        loginBtn.innerText = "Login";
        loginBtn.disabled = false;
        alert("Login Failed: " + error.message);
    });
}
    