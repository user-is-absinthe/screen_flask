from datetime import datetime
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from flask_login import UserMixin

from app import database
from app import login_manager


class User(UserMixin, database.Model):
    id = database.Column(database.Integer, primary_key=True)
    username = database.Column(database.String(64), index=True, unique=True)
    user_role = database.Column(database.String(64))
    password_hash = database.Column(database.String(128))
    user_rating = database.Column(database.Integer)

    relation_with_document = database.relationship('Relation', backref='author', lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_pass(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        self.password_hash = check_password_hash(self.password_hash, password)


class Relation(database.Model):
    id = database.Column(database.Integer, primary_key=True)
    id_user = database.Column(database.Integer, database.ForeignKey('user.id'))
    id_document = database.Column(database.Integer, database.ForeignKey('document.id'))
    type_relation = database.Column(database.String(64))


class Document(database.Model):
    id_document = database.Column(database.Integer, primary_key=True)
    rubric = database.Column(database.String(140))
    description = database.Column(database.String(140))
    status = database.Column(database.String(64))
    path_to_file = database.Column(database.String(256))
    path_to_xml_file = database.Column(database.String(256))

    relation_with_document = database.relationship('Relation', backref='author', lazy='dynamic')

    def __repr__(self):
        return '<Document {}>'.format(self.path_to_file)


class Attributes(database.Model):
    id = database.Column(database.Integer, primary_key=True)
    id_document
    id_user
    attributes_text = path_to_file = database.Column(database.String(1000))



@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))
