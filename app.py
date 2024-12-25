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
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Generate a key for encryption
key = Fernet.generate_key()
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

# Protect upload and download routes
@app.route('/upload', methods=['POST'])
@login_required
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400
        file = request.files['file']
        category = request.form.get('category', 'uncategorized')  # Default category if not provided
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # Encrypt file content
        file_content = file.read()
        encrypted_content = cipher.encrypt(file_content)

        # Save the encrypted file
        with open(filepath, 'wb') as encrypted_file:
            encrypted_file.write(encrypted_content)

        # Save metadata to the database
        encryption_key = key
        cursor.execute(
            "INSERT INTO files (filename, filepath, encryption_key, category) VALUES (%s, %s, %s, %s)",
            (filename, filepath, encryption_key, category)
        )
        conn.commit()

        return jsonify({
            "message": "File uploaded, encrypted, and metadata saved successfully!",
            "filename": filename,
            "category": category
        })
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/download/<filename>', methods=['GET'])
@login_required
def download_file(filename):
    try:
        # Fetch file metadata from the database
        cursor.execute("SELECT filepath, encryption_key FROM files WHERE filename = %s", (filename,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"error": "File not found"}), 404

        filepath, encryption_key = result
        cipher = Fernet(encryption_key)

        # Decrypt the file content
        with open(filepath, 'rb') as encrypted_file:
            encrypted_content = encrypted_file.read()
        decrypted_content = cipher.decrypt(encrypted_content)

        # Save the decrypted content temporarily for download
        temp_filepath = os.path.join(app.config['UPLOAD_FOLDER'], f"decrypted_{filename}")
        with open(temp_filepath, 'wb') as temp_file:
            temp_file.write(decrypted_content)

        return send_file(temp_filepath, as_attachment=True)
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
