from flask import Blueprint
from flask import render_template
from flask import request
from flask import redirect
from flask import url_for
from flask_login import login_required

from app import app

from forms import GenRules

from external_modules import csv_line_writer
from external_modules import del_file

from models import Document


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
    if request.method == 'POST':
        chema_name = request.form.get('name_chema')
        fields_names = request.form.getlist('field_name')
        colors = request.form.getlist('bg')
        # print(chema_name, fields_names, colors, sep='\n')

        path_to_file = app.config['PATH_TO_SHEMA'] + chema_name + '.tsv'
        del_file(path=path_to_file)
        for index in range(len(fields_names)):
            csv_line_writer(
                path=path_to_file,
                data=(fields_names[index], colors[index])
            )
        return redirect(url_for('hello_world'))

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

    # TODO: сделать цвет текста, цвет фона и слово в зависимости от статуса документа
    #  статус - фон - текст
    #  Выполенно - rgb(0,170,0) - color:#ffffff
    #  Выполненно с небльшими различиями - rgb(250, 230, 0)
    #  Выполненно с большими различиями - rgb(255, 0, 0) - color:#ffffff
    #  Не выполенно - rgb(190, 190, 190) - color:#ffffff

    # for o in zip(documents_names, collections, usernames, status):
    #     print(o)
    all_data_rows = zip(documents_names, collections, usernames, status)

    return render_template(
        # 'manager_pages/statistic.html',
        'manager_pages/monitor.html',
        title='Статистика',
        # doc_names=documents_names,
        # coll_names=collections,
        # user_names=usernames,
        # status=status,
        all_data=all_data_rows
    )
    pass


def check_status(status):
    if status > 0.2:
        # doc.status = 'yellow'
        pass
    elif status <= 0.2:
        # doc.status = 'red'
        pass
    elif status > 0.8:
        # doc.status = 'green'
        pass
    else:
        # не готово
        pass
    pass


@manager_pages_blueprint.route('/view_doc')
@login_required
def view_doc():
    docs = Document.query.all()
    docs_name = [d.get_name() for d in docs]
    docs_rubric = [d.get_rubric() for d in docs]
    docs_desc = [d.get_description() for d in docs]
    docs_status = [d.get_status() for d in docs]

    return render_template(
        'manager_pages/check_load_docs.html',
        title='Уточнения по документам',
        rows=zip(docs_name, docs_rubric, docs_desc, docs_status)
    )
