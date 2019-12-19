from flask import Blueprint
from flask import render_template
from flask_login import login_required


admin_pages_blueprint = Blueprint(
    'administrator_pages',
    __name__,
    template_folder='templates'
)


@admin_pages_blueprint.route('/all_users')
@login_required
def check_and_dell_users():
    # TODO: получать всех пользователей
    # username - user_rating - user_role
    usernames = [
        'a1', 'a2', 'a3',
    ]
    user_ratings = [
        0.3, 0.5, 0.8
    ]
    user_roles = [
        'manager',
        'executor',
        'multi',
    ]
    all_data = zip(usernames, user_ratings, user_roles)
    return render_template(
        'admin_pages/all_users.html',
        title='Список всех пользователей',
        all_data=all_data
    )


def load_collections():
    pass
