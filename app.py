from flask import Flask
from flask import render_template
from flask import redirect
from flask import url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_login import current_user
# from flask_user import LoginManager
from flask_login import login_required

from config import Config

from external_modules import get_user_info

app = Flask(__name__)
app.config.from_object(Config)
database = SQLAlchemy(app)
migrate = Migrate(app, database)
login_manager = LoginManager(app)
login_manager.login_view = 'login.login_page'

app.config['UPLOAD_FOLDER'] = 'data/load_files/'
app.config['ALLOWED_EXTENSIONS'] = {
    'txt', 'doc', 'docx'
}
app.config['USER_ROLES'] = {
    'admin': 'Администратор',
    'manager': 'Менеджер',
    'executor': 'Исполнитель',
    'multi': 'ФС-режим',
    'debug': 'Отладчик',
}
app.config['PATH_TO_CHEMA'] = 'data/chemas/'
app.config['PATH_TO_ANN'] = 'data/annotation/'
app.config['PATH_TO_INFINITY_LOAD'] = 'static/instruction_mini.txt'
app.config['PATH_TO_UMLS'] = 'data/uml/'

# для создания миграции в базе не забудь импортировать здесь модель
# или, возможно, не здесь, а где-то еще
# (но импортировать надо после задания переменной database, такая штука
# flask db migrate -m "message"
# flask db upgrade
from models import User
from models import Document
from models import Relation
from models import Attribute
# from models import Role
# from models import UserRoles


# user_manager = UserManager(app, database, User)
# user_manager.login_view = 'login.login_page'


from pages import login
from pages import test_page
from pages import register
from pages import scriber

from pages import all_pages
from pages import manager_pages
from pages import administrator_pages

# название файла импорта, название переменной, к которой присваиваем Blueprint
app.register_blueprint(test_page.test_blueprint)
app.register_blueprint(login.login_blueprint)
app.register_blueprint(register.register_blueprint)
app.register_blueprint(scriber.scribe_blueprint)

app.register_blueprint(all_pages.all_pages)
app.register_blueprint(manager_pages.manager_pages_blueprint)
app.register_blueprint(administrator_pages.admin_pages_blueprint)


all_links = {
    # 'Недостаточно прав': url_for(all_pages.need_role),
    'Недостаточно прав': 'all_functions_pages.need_role',
    'Создание правил': 'manager_page.gen_rules_page',
    'Просмотр статистики': 'manager_page.monitor_page',
    'Отображение пользователей': 'administrator_pages.check_and_dell_users',
    'Загрузка файлов': 'administrator_pages.upload_file',
    'Просмотреть все документы': 'manager_page.view_doc'

}


@app.route('/')
@app.route('/index')
@login_required
def hello_world():
    # print(get_user_info(current_user))
    # print()
    # if current_user.is_authenticated:
    #     print(current_user.username, current_user.user_role)
    # if not check_user_access(current_user, 'admin'):
    #     return redirect(url_for('all_functions_pages.need_role'))
    return render_template(
        'index.html',
        title='Start page',
        links=all_links
    )


if __name__ == '__main__':
    app.run()
