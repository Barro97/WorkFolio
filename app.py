from flask import Flask, redirect, url_for, request, jsonify
from config import Config
import mongoDB_connect as db
import os

app = Flask(__name__)
app.config.from_object(Config)
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'uploads')

try:
    db.init_db(app)
except Exception as e:
    print(f"FATAL: Could not connect to database: {e}")
    raise e

from pages.aboutus.aboutus import about_us
app.register_blueprint(about_us)
from pages.login.login import login
app.register_blueprint(login)
from pages.chat.chat import chat
app.register_blueprint(chat)
from pages.home.home import home
app.register_blueprint(home)
from pages.myprofile.my_profile import my_profile
app.register_blueprint(my_profile)
from pages.organization.organization import organization
app.register_blueprint(organization)
from pages.privacypolicy.privacy_policy import privacy_policy
app.register_blueprint(privacy_policy)
from pages.profile.profile import profile
app.register_blueprint(profile)
from pages.project.project import project
app.register_blueprint(project)
from pages.searchresults.search_results import search_results
app.register_blueprint(search_results)
from pages.signup.signup import signup
app.register_blueprint(signup)

@app.route('/')
def index():
    return redirect(url_for('login.index'))

@app.route('/follow', methods=['POST'])
def follow():
    users_collection = db.get_users_collection()
    follower_id = request.json['follower_id']
    followee_id = request.json['followee_id']

    result = users_collection.update_one({'_id': followee_id}, {'$inc': {'followers': 1}})

    if result.modified_count == 1:
        return jsonify({'status': 'success'})
    else:
        return jsonify({'status': 'error', 'message': 'User not found or update failed'}), 404

@app.route('/unfollow', methods=['POST'])
def unfollow():
    users_collection = db.get_users_collection()
    follower_id = request.json['follower_id']
    followee_id = request.json['followee_id']

    result = users_collection.update_one({'_id': followee_id, 'followers': {'$gt': 0}}, {'$inc': {'followers': -1}})

    if result.modified_count == 1:
        return jsonify({'status': 'success'})
    else:
        return jsonify({'status': 'error', 'message': 'User not found, already unfollowed, or update failed'}), 404

if __name__ == '__main__':
    app.run(debug=True)

