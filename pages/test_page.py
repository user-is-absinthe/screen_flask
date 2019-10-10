from flask import Blueprint
from flask import render_template


test_blueprint = Blueprint(
    'test_page',
    __name__,
    template_folder='templates'
)


@test_blueprint.route('/test_page')
def start_test_page():
    test = 'one two three'
    test_list = ['one', 'two', 'three']
    return render_template('test_page.html', title='Test page', test_phrase_one=test, stock=test_list)
