import os
from flask import Blueprint
from flask import render_template
from flask import request
from flask import redirect
from flask import url_for
from flask_login import current_user
from werkzeug.utils import secure_filename
from flask_login import login_required

from app import app
from app import database

from models import Document
from models import Relation
from models import User


admin_pages_blueprint = Blueprint(
    'administrator_pages',
    __name__,
    template_folder='templates'
)


@admin_pages_blueprint.route('/all_users')
@login_required
def check_and_dell_users():
    # TODO: получать всех пользователей
    # username - user_rating - user_role
    users = User.query.all()
    all_data = [
        (u.get_username(), u.get_rating(), u.get_role()) for u in users
    ]
    return render_template(
        # 'admin_pages/all_users.html',
        'admin_pages/Annotators.html',
        title='Список всех пользователей',
        all_data=all_data
    )


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']


@admin_pages_blueprint.route('/load_documents', methods=['GET', 'POST'])
@login_required
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

            doc = Document(
                document_name=filename,
                path_to_file=save_path
            )
            database.session.add(doc)
            database.session.commit()

            doc_id = doc.get_id()
            # print(doc_id)
            rel = Relation(
                user_id=current_user.id_user,
                document_id=doc_id,
                type_relation='loader'
            )
            database.session.add(rel)
            database.session.commit()

            file.save(save_path)
            return redirect(url_for('administrator_pages.upload_file',
                                    filename=filename))
    return render_template(
        'admin_pages/load_files.html',
        title='Страница загрузки файлов'
    )

