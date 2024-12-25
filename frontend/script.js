document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        console.log('Login form found and ready.'); // Debug message
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission
            console.log('Login form submitted.'); // Debug message

            try {
                const username = document.getElementById('login-username').value;
                const password = document.getElementById('login-password').value;

                console.log(`Sending login request for user: ${username}`); // Debug message
                const response = await fetch('http://127.0.0.1:5000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();
                console.log('Server response:', data); // Debug message

                if (response.ok) {
                    alert('Login successful!');
                    console.log('Redirecting to upload.html');
                    window.location.href = 'upload.html'; // Redirect to upload.html
                } else {
                    alert(data.error || 'Login failed.');
                }
            } catch (err) {
                console.error('Error in login form submission:', err);
                alert('An error occurred. Check the console for details.');
            }
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

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
                    registerForm.reset(); // Clear the form
                } else {
                    alert(data.error || 'Registration failed.');
                }
            } catch (err) {
                console.error('Error in registration form submission:', err);
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

document.addEventListener('DOMContentLoaded', () => {
    // Load categories
    const categoriesContainer = document.getElementById('categories');
    const fileTableBody = document.getElementById('file-table-body');
    const categoryTitle = document.getElementById('category-title');

    if (categoriesContainer) {
        fetch('http://127.0.0.1:5000/files', {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            if (data.files) {
                const categories = new Set(data.files.map(file => file.category));
                categoriesContainer.innerHTML = '';
                categories.forEach(category => {
                    const categoryButton = document.createElement('button');
                    categoryButton.textContent = category;
                    categoryButton.className = 'bg-gradient-to-r from-purple-500 to-pink-400 text-white py-2 px-6 rounded-full hover:bg-gradient-to-r hover:from-pink-400 hover:to-purple-500 transform transition-all duration-300 hover:scale-100 font-roboto text-sm font-semibold tracking-wide shadow-sm hover:shadow-md hover:shadow-pink-400';
                    categoryButton.addEventListener('click', () => {
                        displayFilesByCategory(category, data.files);
                    });
                    categoriesContainer.appendChild(categoryButton);
                });
    
                // Show all files by default
                displayFilesByCategory('All', data.files);
            }
        })
        .catch(err => console.error(err));
    }
    
    
    function displayFilesByCategory(category, files) {
        fileTableBody.innerHTML = '';
        categoryTitle.textContent = category === 'All' ? 'All Files' : `Files in ${category}`;
        files
            .filter(file => category === 'All' || file.category === category)
            .forEach(file => {
                const row = document.createElement('tr');

                const filenameCell = document.createElement('td');
                filenameCell.className = 'p-4';
                filenameCell.textContent = file.filename;

                const actionCell = document.createElement('td');
                actionCell.className = 'p-4';
                const downloadButton = document.createElement('button');
                downloadButton.textContent = 'Download';
                downloadButton.className = 'bg-green-600 text-white p-2 rounded hover:bg-green-700';
                downloadButton.addEventListener('click', () => {
                    window.location.href = `http://127.0.0.1:5000/download/${file.filename}`;
                });
                actionCell.appendChild(downloadButton);

                row.appendChild(filenameCell);
                row.appendChild(actionCell);

                fileTableBody.appendChild(row);
            });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const categoriesBtn = document.getElementById('categories-btn');
    if (categoriesBtn) {
        categoriesBtn.addEventListener('click', () => {
            console.log("Navigating to dashboard for categories"); // Debug log
            window.location.href = 'dashboard.html'; // Navigate to dashboard.html
        });
    }
});