from flask import Blueprint
from flask import render_template
from flask import request
from flask import redirect
from flask import url_for
from flask_login import login_required
from flask_login import current_user

from models import Document

from forms import ScribeForm

from external_modules import opener
from external_modules import save_annotation
from external_modules import one_uiml_gen

from app import app
from app import database

scribe_blueprint = Blueprint(
    'scribe_bp',
    __name__,
    template_folder='templates'
)


NEXT_ID_DICT = {
    # user_id: doc_next_id
}


@scribe_blueprint.route('/scribe', methods=['GET', 'POST'])
@login_required
# @scribe_blueprint.route('/scribe/<next_text_id>', methods=['POST'])
# @roles_required('admin')
def scribe_page(next_text_id=None):
    global NEXT_ID_DICT
    # TODO: проверяй передачу!!!
    print(123, next_text_id)
    form = ScribeForm()

    username, user_role = current_user.username, current_user.user_role
    user_id = current_user.get_id()
    print(user_id)
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
        # print(123)
        # print(request.get_json(force=True))
        data_json = request.get_json(force=True)
        print(data_json)
        current_text_id = data_json['NextIdCurrentText']
        NEXT_ID_DICT[user_id] = current_text_id
        try:
            to_base = data_json['MapIdSelectAnnotateText']
            # print(data_json['IdCurrentText'], current_text_id, type(to_base), to_base)
            path_to_file =\
                app.config['PATH_TO_ANN'] + str(current_user.id_user) + '_' + str(data_json['IdCurrentText']) + '.ann'
            temp_doc = Document.query.get(data_json['IdCurrentText'])
            temp_doc.id_document = data_json['IdCurrentText']
            temp_doc.status = 1
            temp_doc.path_to_xml_file = path_to_file
            # database.session.add(temp_doc)
            database.session.commit()
            save_annotation(
                path=path_to_file, data=to_base
            )



        except KeyError:
            pass
        # current_text, user_xml, user_collections = get_data_by_text_id(text_id=next_text_id)
        # current_text_id = next_text_id
        return redirect(url_for('scribe_bp.empty'))
    # user_docs_status.append(Document.query.get(r.document_id).get_status())
    # user_collections.append(opener(Document.query.get(r.document_id).get_rubric(), encoding='UTF-16'))
    # user_instructions.append(opener(Document.query.get(r.document_id).get_instruction()))
    # user_texts.append(external_modules.opener(Document.query.get(r.document_id).get_instruction()))
    # user_texts.append(opener(Document.query.get(r.document_id).get_text()))
    # user_xml.append(opener(Document.query.get(r.document_id).get_xml()))
    # TODO: удалить после тестов
    try:
        current_text_id = NEXT_ID_DICT[user_id]
    except KeyError:
        current_text_id = user_docs_ids[0]
    # if next_text_id:
    #     current_text_id = next_text_id
    # else:
    #     current_text_id = user_docs_ids[0]

    current_text, user_xml, user_collections = get_data_by_text_id(text_id=current_text_id)
    # print(user_collections)
    # user_xml = '''0-0-6
    # 0-50-53
    # 0-57-63
    # 0-87-93
    # 1-103-114
    # '''.replace('\n', ' ')
    # user_xml.append(a)
    # user_collections = list(set(user_collections))

    return render_template(
        'editor.html',
        # id текущего текста (yes)
        current_text_id=current_text_id,
        # открытый текст (yes)
        list_doc_text=current_text,
        # координаты выделенных сущностей (если есть) (0-50-53) - (сущность - начало - конец) (yes)
        list_ann=user_xml,
        # правила для выделения сущностей (лицо - красный) (yes)
        list_collection=user_collections,

        # названия документов (yes)
        list_doc_name=user_docs_name,
        # id-текстов (yes)
        list_id=user_docs_ids,
        # статусы докумеентов (yes)
        doc_status=user_docs_status,

        form_html=form,
        # сслыка для загрузки большой инструкции от Н (нужна ли?) (yes)
        link_to_doc=path_to_instruction,
        # имя пользователя и роль (yes)
        user_role=(username, user_role),
    )


@scribe_blueprint.route('/test')
def empty():
    return redirect(url_for('scribe_bp.scribe_page'))
    pass


def get_data_by_text_id(text_id):
    text = opener(Document.query.get(text_id).get_text())
    annotation = opener(Document.query.get(text_id).get_xml())
    rules = opener(Document.query.get(text_id).get_rubric(), encoding='UTF-16')
    return text, annotation, rules
