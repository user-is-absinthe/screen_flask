from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from flask_login import UserMixin

from app import database
from app import login_manager
# from app import UserManager


class User(UserMixin, database.Model):
    __tablename__ = 'user'
    id_user = database.Column(database.Integer, primary_key=True)
    username = database.Column(database.String(64), index=True, unique=True)
    password_hash = database.Column(database.String(128))
    user_role = database.Column(database.String(64))
    user_rating = database.Column(database.Integer)

    # relation_with_document = database.relationship('Relation', backref='author', lazy='dynamic')
    user_to_relation = database.relationship('Relation', backref='users_to_relations')
    user_to_attribute = database.relationship('Attribute', backref='users_to_attributes')

    # Define the relationship to Role via UserRoles
    # roles = database.relationship('Role', secondary='user_roles')

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_role(self):
        return self.user_role

    def get_id(self):
        return self.id_user

    def get_username(self):
        return self.username


# # Define the Role data-model
# class Role(database.Model):
#     __tablename__ = 'roles'
#     id = database.Column(database.Integer(), primary_key=True)
#     name = database.Column(database.String(50), unique=True)
#
#
# # Define the UserRoles association table
# class UserRoles(database.Model):
#     __tablename__ = 'user_roles'
#     id = database.Column(database.Integer(), primary_key=True)
#     user_id = database.Column(database.Integer(), database.ForeignKey('user.id_user', ondelete='CASCADE'))
#     role_id = database.Column(database.Integer(), database.ForeignKey('roles.id', ondelete='CASCADE'))


class Document(database.Model):
    __tablename__ = 'document'
    id_document = database.Column(database.Integer, primary_key=True)
    document_name = database.Column(database.String(40))
    rubric = database.Column(database.String(140))
    description = database.Column(database.String(1000))
    status = database.Column(database.Float())
    path_to_file = database.Column(database.String(256))
    path_to_xml_file = database.Column(database.String(256))
    path_to_instruction = database.Column(database.String(256))

    # relation_with_document = database.relationship('Relation', backref='author', lazy='dynamic')
    document_to_relation = database.relationship('Relation', backref='documents_to_relation')
    document_to_attribute = database.relationship('Attribute', backref='document_to_attribute')

    def __repr__(self):
        return '<Document {}>'.format(self.path_to_file)

    def get_id(self):
        return self.id_document

    def get_name(self):
        return self.document_name

    def get_status(self):
        return self.status

    def get_rubric(self):
        return self.rubric

    def get_instruction(self):
        return self.path_to_instruction

    def get_text(self):
        return self.path_to_file

    def get_xml(self):
        return self.path_to_xml_file

    def get_description(self):
        return self.description


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
