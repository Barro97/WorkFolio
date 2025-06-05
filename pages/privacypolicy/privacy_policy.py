from flask import Blueprint, render_template, session

# about blueprint definition
privacy_policy = Blueprint(
    'privacy_policy',
    __name__,
    static_folder='static',
    static_url_path='/privacy_policy',
    template_folder='templates'
)


# Routes
@privacy_policy.route('/privacy_policy')
def index():
    is_logged_in = session.get('logged_in', False)
    return render_template('privacy policy.html', is_logged_in=is_logged_in)
