document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Security: Never expose the password in alerts, logs, or any UI output.
    // Doing so constitutes a credential disclosure vulnerability.
    alert(`Login attempt:\nUsername: ${username}`);

    // In a real application, send credentials securely to the server via an
    // HTTPS POST request. Never display or log the password on the client side.
    // Example:
    // fetch('/api/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, password })
    // });
});