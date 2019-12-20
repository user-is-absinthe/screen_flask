from flask import Blueprint
from flask import render_template
from flask import flash
from flask import redirect
from flask import url_for
from flask import request
from flask_login import current_user
from flask_login import login_user
from flask_login import logout_user
from werkzeug.urls import url_parse

from forms import LoginForm
from models import User


login_blueprint = Blueprint(
    'login',
    __name__,
    template_folder='templates'
)


@login_blueprint.route('/login', methods=['GET', 'POST'])
def login_page():
    if current_user.is_authenticated:
        return redirect(url_for('hello_world'))
    form = LoginForm()
    print('vot_form=', form.username)
    print('1',form.username.data, form.password.data)
    if form.validate_on_submit():
        print('2',form.username.data,form.password.data)
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login.login_page'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            # next_page = url_for('hello_world')
            next_page = url_for('scribe_bp.scribe_page')
        return redirect(next_page)
    return render_template('login.html', title='Sign In', form=form)


@login_blueprint.route('/logout')
def logout_page():
    logout_user()
    return redirect(url_for('login.login_page'))
