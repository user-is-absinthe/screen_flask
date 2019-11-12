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

    collections = database.relationship('Collection', backref='author', lazy='dynamic')
    document = database.relationship('Document', backref='author', lazy='dynamic')

    # collections_create = database.relationship('Collection', backref='author', lazy='dynamic')
    # collections_use = database.relationship('Collection', backref='user', lazy='dynamic')
    # document_load = database.relationship('Document', backref='loader', lazy='dynamic')
    # document_use = database.relationship('Document', backref='user', lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_pass(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        self.password_hash = check_password_hash(self.password_hash, password)


class Collection(database.Model):
    id = database.Column(database.Integer, primary_key=True)
    id_author = database.Column(database.Integer, database.ForeignKey('user.id'))
    id_handler = database.Column(database.Integer, database.ForeignKey('user.id'))
    collection_name = database.Column(database.String(64), index=True)
    date_create = database.Column(database.DateTime, index=True, default=datetime.utcnow)
    deadline = database.Column(database.DateTime, index=True, default=datetime.utcnow)
    task_description = database.Column(database.String(1000))
    template_address = database.Column(database.String(256))
    annotation_address = database.Column(database.String(256))

    def __repr__(self):
        return '<Collection {}>'.format(self.collection_name)


class Document(database.Model):
    id_document = database.Column(database.Integer, primary_key=True)
    id_collection = database.Column(database.Integer, database.ForeignKey('collection.id'))
    id_loader = database.Column(database.Integer, database.ForeignKey('user.id'))
    id_handler = database.Column(database.Integer, database.ForeignKey('user.id'))
    description = database.Column(database.String(140))
    status = database.Column(database.String(64))
    path_to_file = database.Column(database.String(256))
    path_to_xml_file = database.Column(database.String(256))

    def __repr__(self):
        return '<Document {}>'.format(self.path_to_file)


@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))
