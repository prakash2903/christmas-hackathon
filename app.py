import os
from flask import Flask, request, jsonify, send_file, session, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from cryptography.fernet import Fernet
import psycopg2
from flask_cors import CORS
from psycopg2 import OperationalError

# Flask app setup
app = Flask(__name__, static_folder='frontend')  # Serve frontend files from 'frontend' folder
app.secret_key = "e5e9fa1ba31ecd1ae84f75caaa474f3a663f05f4fede3e4550bff3d0f44ba8b7"  # Replace with a secure random key
CORS(app, supports_credentials=True)

# Configure upload folder
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')  # Use the current working directory
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)  # Create the folder if it doesn't exist
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Path to store the encryption key
KEY_FILE = 'encryption.key'

# Generate or load the key
if os.path.exists(KEY_FILE):
    with open(KEY_FILE, 'rb') as key_file:
        key = key_file.read()  # Load the existing key
else:
    key = Fernet.generate_key()
    with open(KEY_FILE, 'wb') as key_file:
        key_file.write(key)  # Save the key for future use

cipher = Fernet(key)

# Database connection
try:
    conn = psycopg2.connect(
        dbname="personal_data_vault",
        user="postgres",  # Replace with your PostgreSQL username
        password="kash29",  # Replace with your PostgreSQL password
        host="localhost"
    )
    cursor = conn.cursor()
except OperationalError as e:
    print("Database connection failed:", e)
    conn = None
    cursor = None

# Serve static frontend files
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:filename>')
def serve_file(filename):
    return send_from_directory(app.static_folder, filename)

# Routes for authentication
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data['username']
        password = data['password']

        # Hash the password
        hashed_password = generate_password_hash(password)

        # Save user to the database
        cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed_password))
        conn.commit()
        return jsonify({"message": "User registered successfully!"})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data['username']
        password = data['password']

        # Fetch user from the database
        cursor.execute("SELECT password FROM users WHERE username = %s", (username,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"error": "Invalid username or password"}), 401

        hashed_password = result[0]
        if check_password_hash(hashed_password, password):
            session['user'] = username
            return jsonify({"message": "Login successful!"})
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({"message": "Logged out successfully!"})

# Middleware to check authentication
def login_required(f):
    def wrapper(*args, **kwargs):
        if 'user' not in session:
            return jsonify({"error": "Unauthorized. Please log in."}), 401
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper

@app.route('/upload', methods=['POST'])
@login_required
def upload_file():
    try:
        # Check if a file is in the request
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        # Retrieve the file and category from the request
        file = request.files['file']
        category = request.form.get('category', 'uncategorized')  # Default category if not provided

        # Validate file presence
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Generate a secure filename
        filename = secure_filename(file.filename)

        # Construct the filepath
        if 'UPLOAD_FOLDER' not in app.config:
            raise ValueError("UPLOAD_FOLDER is not configured")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # Debug: Log where the file is being uploaded
        print(f"Uploading file to: {filepath}")

        # Read the file content and encrypt it
        file_content = file.read()
        encrypted_content = cipher.encrypt(file_content)

        # Save the encrypted file to the filesystem
        with open(filepath, 'wb') as encrypted_file:
            encrypted_file.write(encrypted_content)

        # Save metadata to the database
        encryption_key = key  # Use the generated key
        cursor.execute(
            "INSERT INTO files (filename, filepath, encryption_key, category, username) VALUES (%s, %s, %s, %s, %s)",
            (filename, filepath, encryption_key, category, session['user'])
        )
        conn.commit()

        # Success response
        return jsonify({
            "message": "File uploaded, encrypted, and metadata saved successfully!",
            "filename": filename,
            "category": category
        })

    except Exception as e:
        # Debug: Log the exact error to the terminal
        print(f"Error in upload route: {e}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@app.route('/download/<filename>', methods=['GET'])
@login_required
def download_file(filename):
    try:
        print(f"Attempting to download file: {filename}")  # Debug log

        # Fetch file metadata from the database
        cursor.execute("SELECT filepath, encryption_key FROM files WHERE filename = %s AND username = %s",
                       (filename, session.get('user')))
        result = cursor.fetchone()

        if not result:
            print("File not found in database or does not belong to the user")  # Debug log
            return jsonify({"error": "File not found or unauthorized access"}), 404

        filepath, encryption_key = result
        print(f"Filepath: {filepath}, Encryption Key: {encryption_key}")  # Debug log

        if not os.path.exists(filepath):
            print("File does not exist on disk")  # Debug log
            return jsonify({"error": "File does not exist"}), 404

        # Initialize the cipher with the encryption key
        cipher = Fernet(encryption_key)

        # Decrypt the file content
        with open(filepath, 'rb') as encrypted_file:
            encrypted_content = encrypted_file.read()
        decrypted_content = cipher.decrypt(encrypted_content)

        # Save the decrypted content temporarily for download
        temp_filepath = os.path.join(app.config['UPLOAD_FOLDER'], f"decrypted_{filename}")
        with open(temp_filepath, 'wb') as temp_file:
            temp_file.write(decrypted_content)

        print(f"Decrypted file saved at: {temp_filepath}")  # Debug log
        return send_file(temp_filepath, as_attachment=True)

    except Exception as e:
        print(f"An error occurred: {e}")  # Debug log
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@app.route('/files', methods=['GET'])
@login_required
def get_files():
    try:
        username = session['user']  # Get the logged-in user's username
        cursor.execute("SELECT filename, category FROM files WHERE username = %s", (username,))
        files = cursor.fetchall()
        return jsonify({"files": [{"filename": f[0], "category": f[1]} for f in files]})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500



if __name__ == "__main__":
    app.run(debug=True)
