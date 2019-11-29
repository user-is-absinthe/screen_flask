from app import database
from forms import RegistrationForm

from flask import Blueprint
from flask import render_template
from flask import flash
from flask import redirect
from flask import url_for
from flask_login import current_user

from models import User


register_blueprint = Blueprint(
    'register',
    __name__,
    template_folder='templates'
)


@register_blueprint.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('login.login_page'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(
            username=form.username.data,
            user_role=form.user_role.data,
            user_rating=0
        )
        user.set_password(form.password.data)

        database.session.add(user)
        database.session.commit()
        flash('Congratulations, user add')
        return redirect(url_for('login.login_page'))
    return render_template('register.html', title='Register', form=form)
