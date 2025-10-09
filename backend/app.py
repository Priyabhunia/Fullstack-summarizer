

from flask import Flask, request
from flask_cors import CORS
from auth import auth_bp
from summarize import summarize_bp
from database import init_db

app = Flask(__name__)

# ADDED: Request logging middleware
@app.before_request
def log_request_info():
    print('Headers:', dict(request.headers))
    print('Body:', request.get_json(silent=True))
    print('URL:', request.url)
    print('Method:', request.method)

# MODIFIED: Enhanced CORS configuration
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type"]
    }
})

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(summarize_bp, url_prefix='/summarize')

# Initialize database
init_db()

# ADDED: Explicit host and port configuration
if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)  # Listen on all interfaces
    # Development only - don't use in production
    # app.run(debug=True, host='127.0.0.1', port=5000, ssl_context=None)




