from flask import Blueprint
from flask import render_template
from flask import flash
from flask import redirect
from flask import url_for

from forms import LoginForm


login_blueprint = Blueprint(
    'login',
    __name__,
    template_folder='templates'
)


@login_blueprint.route('/login', methods=['GET', 'POST'])
def login_page():
    form = LoginForm()
    if form.validate_on_submit():
        flash('Login requested for user {}, remember_me={}'.format(
            form.username.data, form.remember_me.data))
        return redirect(url_for('hello_world'))
    return render_template('login.html', title='Sign In', form=form)
