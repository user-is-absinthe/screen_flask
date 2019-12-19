from flask import Blueprint
from flask import render_template
from flask import redirect
from flask import url_for
from flask_login import current_user
from flask_login import login_required

from external_modules import check_user_access


test_blueprint = Blueprint(
    'test_page',
    __name__,
    template_folder='templates'
)


@test_blueprint.route('/test_page')
@login_required
def start_test_page():
    asses = [
        'admin',
        'debug',
    ]
    if not check_user_access(current_user=current_user, good_roles=asses):
        return redirect(url_for('all_functions_pages.need_role'))
    test = 'one two three'
    test_list = ['one', 'two', 'three']
    test_any = 123
    return render_template(
        'test_page.html',
        title='Test page',
        test_phrase_one=test,
        stock=test_list,

    )
