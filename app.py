from flask import Flask
from flask import render_template
from flask import url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
# from flask_user import LoginManager

from config import Config


app = Flask(__name__)
app.config.from_object(Config)
database = SQLAlchemy(app)
migrate = Migrate(app, database)
login_manager = LoginManager(app)
login_manager.login_view = 'login.login_page'

# для создания миграции в базе не забудь импортировать здесь модель
# или, возможно, не здесь, а где-то еще
# (но импортировать надо после задания переменной database, такая штука
# flask db migrate -m "message"
# flask db upgrade
from models import User
from models import Document
from models import Relation
from models import Attribute
from models import Role
from models import UserRoles


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


links = {
    # 'Недостаточно прав': url_for(all_pages.need_role),
    'Недостаточно прав': 'all_functions_pages.need_role',
    'Создание правил': 'manager_page.gen_rules_page',
    'Просмотр статистики': 'manager_page.monitor_page',
    'Отображение пользователей': 'administrator_pages.check_and_dell_users'

}


@app.route('/')
@app.route('/index')
def hello_world():
    return render_template(
        'index.html',
        title='Start page',
        links=links
    )


if __name__ == '__main__':
    app.run()
