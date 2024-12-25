// Handle login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Login successful!');
            window.location.href = 'upload.html';  // Redirect to upload page
        } else {
            console.error(data);
            alert(data.error || 'Login failed.');
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred. Check the console for details.');
    }
});

// Handle registration
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        const response = await fetch('http://127.0.0.1:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please log in.');
            document.getElementById('register-form').reset();
        } else {
            console.error(data);
            alert(data.error || 'Registration failed.');
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred. Check the console for details.');
    }
});

// Handle file upload
document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('file');
    const categoryInput = document.getElementById('category');

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('category', categoryInput.value || 'uncategorized');

    try {
        const response = await fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            credentials: 'include', // Include cookies for session handling
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            alert(`File uploaded successfully!\nFilename: ${data.filename}\nCategory: ${data.category}`);
            document.getElementById('upload-form').reset();
        } else {
            alert(data.error || 'File upload failed.');
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred. Check the console for details.');
    }
});


// Handle logout
document.addEventListener('DOMContentLoaded', () => {
    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            console.log("Logout button clicked");
            try {
                const response = await fetch('http://127.0.0.1:5000/logout', {
                    method: 'POST',
                    credentials: 'include', // Include session cookies
                });

                const data = await response.json();
                if (response.ok) {
                    alert(data.message); // Display success message
                    window.location.href = '/'; // Redirect to the login page
                } else {
                    alert(data.error || 'Logout failed.');
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred. Check the console for details.');
            }
        });
    } else {
        console.error("Logout button not found in the DOM.");
    }
});
