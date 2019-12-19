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
def gen_rules_page():
    form = GenRules()
    # TODO: обработка данных после js
    # TODO: сохранение данных
    print(check_answered(form.field_name.data))
    print(form.field_name)
    if check_answered(form.field_name.data) and check_answered(form.color_to_name.data):
        objects = form.field_name.data
        colors = form.color_to_name.data
        print(objects)
        print(colors)
        pass

    return render_template(
        'manager_pages/gen_rules.html',
        title='Test page',
        form=form
    )


@manager_pages_blueprint.route('/statistic')
def monitor_page():
    # TODO: забирать данные из базы
    documents_names = [
        'a', 'b', 'c', 'd',
    ]
    collections = [
        'coll a', 'coll b', 'coll c', 'coll d'
    ]
    usernames = [
        ['user 1', 'user 2'],
        ['user 2', 'user 3'],
        ['user 3', 'user 4'],
        ['user 4', 'user 5'],
    ]
    status = [
        0, 0.3, 0.7, 1
    ]

    for o in zip(documents_names, collections, usernames, status):
        print(o)
    all_data_rows = zip(documents_names, collections, usernames, status)

    return render_template(
        'manager_pages/statistic.html',
        title='Статистика',
        # doc_names=documents_names,
        # coll_names=collections,
        # user_names=usernames,
        # status=status,
        all_data=all_data_rows
    )
    pass
