document.addEventListener('DOMContentLoaded', () => {
    // Handle login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const username = document.getElementById('login-username').value;
                const password = document.getElementById('login-password').value;

                const response = await fetch('http://127.0.0.1:5000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Login successful!');
                    window.location.href = 'upload.html'; 
                } else {
                    console.error(data);
                    alert(data.error || 'Login failed.');
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred. Check the console for details.');
            }
        });
    }

    // Handle registration
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const username = document.getElementById('register-username').value;
                const password = document.getElementById('register-password').value;

                const response = await fetch('http://127.0.0.1:5000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Registration successful! Please log in.');
                    registerForm.reset();
                } else {
                    console.error(data);
                    alert(data.error || 'Registration failed.');
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred. Check the console for details.');
            }
        });
    }

    // Handle file upload
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
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
                    body: formData,
                });

                const data = await response.json();
                if (response.ok) {
                    alert(`File uploaded successfully!\nFilename: ${data.filename}\nCategory: ${data.category}`);
                    uploadForm.reset();
                } else {
                    alert(data.error || 'File upload failed.');
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred. Check the console for details.');
            }
        });
    }

    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            console.log('Logout button clicked');
            try {
                const response = await fetch('http://127.0.0.1:5000/logout', {
                    method: 'POST',
                    credentials: 'include',
                });

                const data = await response.json();
                if (response.ok) {
                    alert(data.message);
                    window.location.href = '/'; 
                } else {
                    alert(data.error || 'Logout failed.');
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred. Check the console for details.');
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    // Load files for the dashboard
    const fileTableBody = document.getElementById('file-table-body');
    if (fileTableBody) {
        fetch('http://127.0.0.1:5000/files', {
            method: 'GET',
            credentials: 'include', // Include session cookies
        })
        .then(response => response.json())
        .then(data => {
            if (data.files) {
                data.files.forEach(file => {
                    const row = document.createElement('tr');

                    const filenameCell = document.createElement('td');
                    filenameCell.textContent = file.filename;

                    const categoryCell = document.createElement('td');
                    categoryCell.textContent = file.category;

                    const actionCell = document.createElement('td');
                    const downloadButton = document.createElement('button');
                    downloadButton.textContent = 'Download';
                    downloadButton.addEventListener('click', () => {
                        window.location.href = `http://127.0.0.1:5000/download/${file.filename}`;
                    });
                    actionCell.appendChild(downloadButton);

                    row.appendChild(filenameCell);
                    row.appendChild(categoryCell);
                    row.appendChild(actionCell);

                    fileTableBody.appendChild(row);
                });
            } else {
                alert(data.error || 'Failed to load files.');
            }
        })
        .catch(err => {
            console.error(err);
            alert('An error occurred while loading files.');
        });
    }
});
