from flask import Blueprint
from flask import render_template
from flask import request
from flask_login import login_required
# from flask_user import login_required
# from flask_user import roles_required
from flask_login import current_user

from models import Document

from forms import ScribeForm

from external_modules import opener

scribe_blueprint = Blueprint(
    'scribe_bp',
    __name__,
    template_folder='templates'
)


@scribe_blueprint.route('/scribe', methods=['GET', 'POST'])
@login_required
# @roles_required('admin')
def scribe_page():
    username, user_role = current_user.username, current_user.user_role
    user_relations = current_user.user_to_relation
    # print(user_relations)

    path_to_instruction = r'static/instruction_mini.txt'

    user_docs_ids = list()
    user_docs_name = list()
    user_docs_status = list()
    # user_collections = list()
    # user_instructions = list()
    # user_texts = list()
    # user_xml = list()

    for r in user_relations:
        user_docs_ids.append(r.document_id)
        user_docs_name.append(Document.query.get(r.document_id).get_name())
        user_docs_status.append(Document.query.get(r.document_id).get_status())

    if request.method == 'POST':
        print(request.get_json())

    # user_docs_status.append(Document.query.get(r.document_id).get_status())
    # user_collections.append(opener(Document.query.get(r.document_id).get_rubric(), encoding='UTF-16'))
    # user_instructions.append(opener(Document.query.get(r.document_id).get_instruction()))
    # user_texts.append(external_modules.opener(Document.query.get(r.document_id).get_instruction()))
    # user_texts.append(opener(Document.query.get(r.document_id).get_text()))
    # user_xml.append(opener(Document.query.get(r.document_id).get_xml()))
    # TODO: удалить после тестов

    current_text, user_xml, user_collections = get_data_by_text_id(text_id=user_docs_ids[0])
    user_xml = '''0-0-6
0-50-53
0-57-63
0-87-93
1-103-114
'''.replace('\n', ' ')
    # user_xml.append(a)
    # user_collections = list(set(user_collections))

    form = ScribeForm()

    return render_template(
        'editor.html',
        # id текущего текста
        current_text_id=user_docs_ids[0],
        # открытый текст
        list_doc_text=current_text,
        # координаты выделенных сущностей (если есть) (0-50-53) - (сущность - начало - конец)
        list_ann=user_xml,
        # правила для выделения сущностей (лицо - красный)
        list_collection=user_collections,

        # названия документов
        list_doc_name=user_docs_name,
        # id-текстов
        list_id=user_docs_ids,
        # статусы докумеентов
        doc_status=user_docs_status,

        form_html=form,
        # сслыка для загрузки большой инструкции от Н (нужна ли?)
        link_to_doc=path_to_instruction,
        # имя пользователя и роль
        user_role=(username, user_role),
    )


def get_data_by_text_id(text_id):
    text = opener(Document.query.get(text_id).get_text())
    annotation = opener(Document.query.get(text_id).get_xml())
    rules = opener(Document.query.get(text_id).get_rubric(), encoding='UTF-16')
    return text, annotation, rules
