import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv() # Load environment variables from .env file

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev_secret_key_replace_in_production_9d8cq@')
    MONGO_URI = os.environ.get('MONGO_URI') # Default local URI
    UPLOAD_FOLDER = 'static/uploads'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    PERMANENT_SESSION_LIFETIME = timedelta(days=30) # Requires: from datetime import timedelta at top 