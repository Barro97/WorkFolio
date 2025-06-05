# from urllib import request

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import pymongo
from flask import Blueprint, render_template, request, redirect, url_for, jsonify, session
from werkzeug.security import check_password_hash
from datetime import timedelta
import os

# about blueprint definition
login = Blueprint(
    'login',
    __name__,
    static_folder='static',
    static_url_path='/login',
    template_folder='templates'
)

# MongoDB setup
uri = os.getenv('MONGO_URI')
myclient = MongoClient(uri, server_api=ServerApi('1'))
mydb = myclient['user_database']
users_collection = mydb['users']


# Routes
@login.route('/login')
def index():
    session['logged_in'] = False  # So the nav-bar doesn't show up for users who are not logged in
    session['user'] = ''  # Remove user
    return render_template('login.html')


@login.route('/check_user', methods=['GET', 'POST'])
def check_user():
    if request.method == 'POST':
        data = request.json
        print(f"Received data: {data}")  # Debug print
        
        email = data.get('email')
        password = data.get('password')
        remember_me = data.get('remember-me')  # Get the remember-me value from the form data
        
        print(f"Email: {email}")  # Debug print
        print(f"Password: {password}")  # Debug print
        print(f"Remember me: {remember_me}")  # Debug print

        # First find user by email only
        user = users_collection.find_one({"email": email})
        print(f"User found: {user is not None}")  # Debug print
        
        # If user exists, check the password hash
        if user and check_password_hash(user['password'], password):
            session['user'] = user
            user.pop('_id', None)
            session['logged_in'] = True
            session.permanent = bool(remember_me)  # Set session permanence based on remember_me

            return jsonify({"success": True, "redirect": "/home"})
        else:
            return jsonify({"success": False, "message": "Invalid email or password."})
