from flask import Blueprint
from flask import render_template
from flask_login import login_manager


all_pages = Blueprint(
    'permission_denied_page',
    __name__,
    template_folder='templates'
)


@all_pages.route('/access_denied')
def need_role():
    message = 'У вас нет прав доступа для просмотра этой страницы.'
    return render_template(
        'all_pages/access_denied.html',
        title='Доступ запрещен.',
        message=message
    )
