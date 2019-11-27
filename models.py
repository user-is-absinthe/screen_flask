from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from flask_login import UserMixin

from app import database
from app import login_manager


class User(UserMixin, database.Model):
    __tablename__ = 'user'
    id_user = database.Column(database.Integer, primary_key=True)
    username = database.Column(database.String(64), index=True, unique=True)
    password_hash = database.Column(database.String(128))
    user_role = database.Column(database.String(64))
    user_rating = database.Column(database.Integer)

    # relation_with_document = database.relationship('Relation', backref='author', lazy='dynamic')
    user_to_relation = database.relationship('Relation', backref='users_to_relations', lazy='dynamic')
    user_to_attribute = database.relationship('Attribute', backref='users_to_attributes', lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        self.password_hash = check_password_hash(self.password_hash, password)

    def get_role(self):
        return self.user_role


class Document(database.Model):
    __tablename__ = 'document'
    id_document = database.Column(database.Integer, primary_key=True)
    rubric = database.Column(database.String(140))
    description = database.Column(database.String(1000))
    status = database.Column(database.String(64))
    path_to_file = database.Column(database.String(256))
    path_to_xml_file = database.Column(database.String(256))
    path_to_instruction = database.Column(database.String(256))

    # relation_with_document = database.relationship('Relation', backref='author', lazy='dynamic')
    document_to_relation = database.relationship('Relation', backref='documents_to_relation', lazy='dynamic')
    document_to_attribute = database.relationship('Attribute', backref='document_to_attribute', lazy='dynamic')

    def __repr__(self):
        return '<Document {}>'.format(self.path_to_file)


class Relation(database.Model):
    __tablename__ = 'relation'
    id_relation = database.Column(database.Integer, primary_key=True)

    user_id = database.Column(database.Integer, database.ForeignKey('user.id_user'))
    document_id = database.Column(database.Integer, database.ForeignKey('document.id_document'))

    type_relation = database.Column(database.String(100))

    def __repr__(self):
        return '<Relation {} type>'.format(self.type_relation)


class Attribute(database.Model):
    __tablename__ = 'attribute'
    id_attribute = database.Column(database.Integer, primary_key=True)

    document_id = database.Column(database.Integer, database.ForeignKey('document.id_document'))
    user_id = database.Column(database.Integer, database.ForeignKey('user.id_user'))

    attribute_text = database.Column(database.String(1000))
    attribute_status = database.Column(database.String(20))

    def __repr__(self):
        return '<Attribute from {0} user, from {1} document>'.format(
            self.user_id,
            self.document_id
        )


@login_manager.user_loader
def load_user(id_user):
    return User.query.get(int(id_user))
