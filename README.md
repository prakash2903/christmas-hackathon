
# Personal Data Vault 🚀

A secure, encrypted file management and sharing application to protect your data and collaborate seamlessly.

![Python](https://img.shields.io/badge/Python-3.10-blue)
![Flask](https://img.shields.io/badge/Flask-2.1.3-lightgrey)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13.3-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-06B6D4)
![License](https://img.shields.io/badge/License-MIT-green)

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Demo](#demo)
4. [Technologies Used](#technologies-used)
5. [Getting Started](#getting-started)
6. [Usage](#usage)
7. [Future Enhancements](#future-enhancements)
8. [Contributing](#contributing)
9. [License](#license)

## Overview

Personal Data Vault is a secure platform that allows users to:

- Upload and encrypt files.
- Manage and download their own files securely.
- Share files with other users with complete control over access.
- View files shared with them by others.

The app ensures robust security by encrypting files using **Fernet symmetric encryption** and isolating user data in a multi-user system.

### Why Use Personal Data Vault?

🔒 **Enhanced Security**: All files are encrypted and decrypted seamlessly.
📂 **Easy Sharing**: Share files with your friends effortlessly.
🎨 **Modern UI**: Built with TailwindCSS for a sleek, responsive design.
🛠️ **Customizable**: Open-source and easily extensible.

## Features

1. **User Authentication**

   - Secure registration and login with hashed passwords.
   - Session-based access control.
2. **File Management**

   - Upload and encrypt files with a unique encryption key.
   - View and download uploaded files.
3. **File Sharing**

   - Share files with other registered users.
   - Dedicated "Shared with Me" section for shared files.
4. **File Security**

   - Uses **Fernet symmetric encryption** for secure file handling.
   - Isolated file access ensures no unauthorized access.
5. **Dynamic Frontend**

   - TailwindCSS-powered responsive design.
   - Smooth user experience with intuitive navigation.

## Demo

### Login and File Management

![Login Demo](demo/login.gif)

### File Sharing

![Sharing Demo](demo/share.gif)

### File Download

![Download Demo](demo/download.gif)

## Technologies Used

1. **Backend**: Flask (Python)

   - RESTful API for user authentication, file handling, and sharing.
2. **Database**: PostgreSQL

   - Stores user details, file metadata, and sharing information.
3. **Frontend**: HTML, TailwindCSS, JavaScript

   - Modern and responsive design.
4. **Security**:

   - Passwords hashed using `werkzeug.security`.
   - File encryption with `cryptography.fernet`.
5. **Deployment**:

   - Easily deployable to platforms like Heroku, Render, or AWS.

## Getting Started

### Prerequisites

- Python 3.10+
- PostgreSQL 13+
- Node.js (optional, for TailwindCSS development)

### Installation

Clone the repository:

```bash
git clone https://github.com/your-username/personal-data-vault.git
cd personal-data-vault
```

Activate Virtual Environment:

```bash
python -m venv venv

source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

pip install -r requirements.txt

python app.py
```

---

## **Usage**

1. **Register** as a new user or log in to an existing account.
2. **Upload Files**:
   - Navigate to the Upload page.
   - Select a file and optionally categorize it.
3. **Share Files**:
   - Share files with friends by providing their username.
4. **View Shared Files**:
   - Access the "Shared with Me" page to download files shared by others.

## Future Enhancements

1. **File Previews**:

   - Add preview functionality for images and PDFs.
2. **Audit Logs**:

   - Track file access and sharing history.
3. **User Notifications**:

   - Notify users when files are shared with them.
4. **File Versioning**:

   - Allow users to upload and manage different versions of the same file.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit and push your changes.
4. Submit a pull request explaining your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
