
# **Personal Data Vault** 🚀🔒

A secure, encrypted file management and sharing application to protect your data and collaborate seamlessly.

![Python](https://img.shields.io/badge/Python-3.10-blue)
![Flask](https://img.shields.io/badge/Flask-2.1.3-lightgrey)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13.3-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-06B6D4)

<img src= "https://github.com/prakash2903/christmas-hackathon/blob/main/src/index.png" height = 300, width = 325, align=left>

<img src= "https://github.com/prakash2903/christmas-hackathon/blob/main/src/upload.png" height = 300, width = 325>

---
## 📖 **Table of Contents**

1. [🌟 Overview](#-overview)
2. [✨ Features](#-features)
3. [🎥 Demo](#-demo)
4. [💻 Technologies Used](#-technologies-used)
5. [🚀 Getting Started](#-getting-started)
6. [⚙️ Usage](#-usage)
7. [📈 Future Enhancements](#-future-enhancements)
8. [🤝 Contributing](#-contributing)

---

## 🌟 **Overview**

Personal Data Vault is a secure platform that allows users to:

- 🔒 **Upload and Encrypt Files:** Safely upload and store encrypted files.  
- 👥 **Share Files:** Share files with friends or colleagues securely.  
- 📂 **Manage and Download Files:** Organize and retrieve files with ease.  
- 🔍 **Access Shared Files:** View files shared by others.

**Why Choose Personal Data Vault?**

- 🔐 **Top-Notch Security:** Your files are encrypted with state-of-the-art technology.  
- 🚀 **Modern Design:** Responsive and sleek UI built with TailwindCSS.  
- ⚡ **Fast and Scalable:** Designed for efficient file sharing and management.  

---

## ✨ **Features**

1. **🔑 User Authentication**
   - Secure registration and login with hashed passwords.
   - Session-based access control.

2. **📁 File Management**
   - Upload and encrypt files with unique keys.
   - Download files securely.

3. **🤝 File Sharing**
   - Share files with other registered users.
   - View files shared with you in a dedicated section.

4. **🛡️ File Security**
   - Powered by **Fernet symmetric encryption**.
   - Prevent unauthorized access with robust isolation.

5. **🎨 Dynamic Frontend**
   - TailwindCSS-powered design.
   - Intuitive and user-friendly navigation.

<img src= "https://github.com/prakash2903/christmas-hackathon/blob/main/src/dashboard.png" height = 400, width = 600 align=center>

---

## 🎥 **Demo**

-  ✏️ Login and File Management ✅
-  📤 File Sharing ✅
-  📥 File View/Download ✅

Check the model demo 👉 [here](https://drive.google.com/drive/folders/1T4gK84A6gDwuiwaVzlteX6PnSMZMiift?usp=drive_link)

---

## 💻 **Technologies Used**

1. **Backend:** ⚙️ Flask (Python)  
   - RESTful API for authentication, file uploads, and sharing.

2. **Database:** 🐘 PostgreSQL  
   - User information, file metadata, and sharing details.

3. **Frontend:** 🎨 TailwindCSS + JavaScript  
   - Responsive and interactive design.

4. **Security:** 🛡️  
   - Password hashing with `werkzeug.security`.  
   - File encryption using `cryptography.fernet`.

5. **Deployment:** 🚀  
   - Ready for platforms like Heroku, Render, or AWS.

---

## 🚀 **Getting Started**

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

## 📈 **Future Enhancements**

1. **File Previews**:

   - Add preview functionality for images and PDFs.
2. **Audit Logs**:

   - Track file access and sharing history.
3. **User Notifications**:

   - Notify users when files are shared with them.
4. **File Versioning**:

   - Allow users to upload and manage different versions of the same file.

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit and push your changes.
4. Submit a pull request explaining your changes.
