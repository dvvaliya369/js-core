document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    alert(`Login attempt:\nUsername: ${username}\nPassword: ${password}`);
    // In a real application, you would send this data to a server for authentication
});