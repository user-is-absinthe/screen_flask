from flask import Blueprint
from flask import render_template
from flask_login import login_required
# from flask_user import login_required
# from flask_user import roles_required
from flask_login import current_user

from models import Document

from forms import ScribeForm

import external_modules

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

    path_to_instruction = r'static/instruction_mini.txt'

    user_docs_ids = list()
    user_docs_name = list()
    user_docs_status = list()
    user_collections = list()
    user_instructions = list()
    user_texts = list()
    user_xml = list()

    for r in user_relations:
        user_docs_ids.append(r.document_id)
        user_docs_name.append(Document.query.get(r.document_id).get_name())
        user_docs_status.append(Document.query.get(r.document_id).get_status())
        user_collections.append(Document.query.get(r.document_id).get_rubric())
        user_instructions.append(external_modules.opener(Document.query.get(r.document_id).get_instruction()))
        # user_texts.append(external_modules.opener(Document.query.get(r.document_id).get_instruction()))
        user_texts.append(external_modules.opener(Document.query.get(r.document_id).get_text()))
        user_xml.append(external_modules.opener(Document.query.get(r.document_id).get_xml()))
    user_collections = list(set(user_collections))

    form = ScribeForm()

    docs = Document.query.all()
    # print(path_to_docs)
    for d in docs:
        user_docs_name.append(d.get_name())
        user_texts.append(external_modules.opener(d.get_text()))

    if form.validate_on_submit():
        print(form.texts.data)
        # list_ids, list_xmls = form.texts.data
        # for index, id_doc in enumerate(list_ids):
        #     # session
        #     Document.query.get(int(id_doc))
        # pass

    # return render_template(
    #     'scriber.html',
    #     title='страница редакции',
    #
    #     collections=user_collections,
    #     len_docs_name=len(user_docs_name),
    #     docs_name=user_docs_name,
    #     docs_status=user_docs_status,
    #     instrictions=user_instructions,
    #     texts=user_texts,
    #     xml=user_xml,
    #
    #     form_html=form,
    #
    #     # otladka=Document.query.get(r.document_id)
    #     # otladka=User.query.get(1).get_username()
    #     otladka=0
    # )

    # print(
    #     'docs\n',
    #     user_docs_ids,
    #     '\nnames\n',
    #     user_docs_name,
    #     '\ndocs_status\n',
    #     user_docs_status,
    #     '\ncollections\n',
    #     user_collections,
    #     '\ninstructions\n',
    #     user_instructions,
    #     '\ntexts\n',
    #     user_texts,
    #     '\nxml\n',
    #     user_xml,
    # )

    return render_template(
        'editor.html',
        list_doc_text=user_texts,
        list_ann=user_xml,
        list_collection=user_collections,
        list_doc_name=user_docs_name,
        user_role=(username, user_role),
        list_tags=user_instructions,
        list_id=user_docs_ids,
        # collections=user_collections,
        form_html=form,
        link_to_doc=path_to_instruction,
    )
