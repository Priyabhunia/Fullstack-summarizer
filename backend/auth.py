from flask import Blueprint, request, jsonify
from passlib.hash import  bcrypt  # Use passlib.hash instead of just passlib
import jwt
import sqlite3
from datetime import datetime, timedelta
from database import get_db_connection
import os

# load_dotenv()
JWT_SECRET = os.getenv('JWT_SECRET')

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    print("recieived sighup request")
    print("headers", request.headers)
    print("data", request.get_json())

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password required'}), 400

    # hashed_pw = passlib.hashpw(password.encode('utf-8'), passlib.gensalt())
    hashed_pw = bcrypt.hash(password)
    conn = get_db_connection()
    c = conn.cursor()

    try:
        c.execute('INSERT INTO users (email, password) VALUES (?, ?)', (email, hashed_pw))
        conn.commit()
        return jsonify({'message': 'User created'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Email already exists'}), 400
    finally:
        conn.close()

@auth_bp.route('/login', methods=['POST'])  # Changed from GET to POST
def login():
    conn = None  #initialize conn to none
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400

        email = data.get('email')
        password = data.get('password')

        # Validate input
        if not email or not password:
            return jsonify({'message': 'Email and password required'}), 400

        # Get database connection
        conn = get_db_connection()
        c = conn.cursor()
        
        # Get user from database
        c.execute('SELECT * FROM users WHERE email = ?', (email,))
        user = c.fetchone()
        
        # if user:
        #     # Convert stored password from bytes to string if needed
        #     stored_password = user['password']
        #     if isinstance(stored_password, bytes):
        #         stored_password = stored_password.decode('utf-8')

        #     # Verify password using passlib
        #     if ph.bcrypt.verify(password, stored_password):
        print(f"Attempting login for email: {email}")
        print(f"User found in DB: {user is not None}")
        if user:
            stored_password = user['password']
            if isinstance(stored_password, bytes):
                stored_password = stored_password.decode('utf-8')
            print(f"Stored password type: {type(stored_password)}")

            # If password verification fails, this returns 401
            if bcrypt.verify(password, stored_password):
                # Generate token
                token = jwt.encode(
                    {
                        'user_id': user['id'],
                        'exp': datetime.utcnow() + timedelta(hours=24)
                    },
                    JWT_SECRET,
                    algorithm='HS256'
                )

            return jsonify({
                'token': token,
                'message': 'Login successful'
            }), 200
    
# This is the 401 response you're seeing
        return jsonify({'message': 'Invalid email or password'}), 401
                
        #         return jsonify({
        #             'token': token,
        #             'message': 'Login successful'
        #         }), 200
            
        # # Invalid credentials
        # return jsonify({'message': 'Invalid email or password'}), 401

    except Exception as e:
        print(f"Login error: {str(e)}")  # Log the error
        return jsonify({'message': 'Server error'}), 500
    
    finally:
        if conn :
            conn.close()

def token_required(f):
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'message': 'Token required'}), 401
        token = token.split(' ')[1]
        try:
            decoded = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            request.user_id = decoded['user_id']
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__  # Preserve function name for Flask
    return wrapper





