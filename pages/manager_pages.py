from flask import Blueprint
from flask import render_template
from flask_login import login_required

from forms import GenRules
from external_modules import check_answered


manager_pages_blueprint = Blueprint(
    'manager_page',
    __name__,
    template_folder='templates'
)


@manager_pages_blueprint.route('/gen_rules', methods=['GET', 'POST'])
@login_required
def gen_rules_func():
    form = GenRules()
    print(check_answered(form.field_name.data))
    if form.validate_on_submit():
        print(123)
        objects = form.field_name.data
        colors = form.colors.data
        print(objects)
        print(colors)
        pass

    return render_template(
        'manager_pages/gen_rules.html',
        title='Test page',
        form=form
    )
