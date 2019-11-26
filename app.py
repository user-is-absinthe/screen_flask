from flask import Flask
from flask import render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager

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

from pages import login
from pages import test_page

# название файла импорта, название переменной, к которой присваиваем Blueprint
app.register_blueprint(test_page.test_blueprint)
app.register_blueprint(login.login_blueprint)


@app.route('/')
@app.route('/index')
def hello_world():
    return render_template('index.html', title='Start page')


if __name__ == '__main__':
    app.run()
