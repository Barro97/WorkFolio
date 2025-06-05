from flask import Blueprint, render_template, session

# about blueprint definition
about_us = Blueprint(
    'aboutus',
    __name__,
    static_folder='static',
    static_url_path='/aboutus',
    template_folder='templates'
)


# Routes
@about_us.route('/aboutus')
def index():
    is_logged_in = session.get('logged_in', False)
    return render_template('about us.html', is_logged_in=is_logged_in)
