from flask import Blueprint, render_template, request
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId
import os


# about blueprint definition
organization = Blueprint(
    'organization',
    __name__,
    static_folder='static',
    static_url_path='/organization',
    template_folder='templates'
)

# MongoDB setup
uri = os.getenv('MONGO_URI')
myclient = MongoClient(uri, server_api=ServerApi('1'))
mydb = myclient['user_database']
org_collection = mydb['organizations']



# Routes
@organization.route('/organization/<org_name>')
def index(org_name):
    organization = org_collection.find_one({'org_name': org_name})
    if organization:
        return render_template('organization.html', organization=organization)
    else:
        return "User not found", 404
