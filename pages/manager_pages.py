from flask import Blueprint
from flask import render_template
from flask_login import login_required

from forms import GenRules


manager_pages_blueprint = Blueprint(
    'manager_page',
    __name__,
    template_folder='templates'
)


@manager_pages_blueprint.route('/gen_rules')
@login_required
def gen_rules_func():
    form = GenRules()

    if form.validate_on_submit():
        pass

    return render_template(
        'test_page.html',
        title='Test page',
    )
