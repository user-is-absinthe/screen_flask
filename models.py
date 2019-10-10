from app import database


class User(database.Model):
    id = database.Column(database.Integer, primary_key=True)
    username = database.Column(database.String(64), index=True, unique=True)
    user_role = database.Column(database.String(64), index=True, unique=True)
    password_hash = database.Column(database.String(128))

    def __repr__(self):
        return '<User {}>'.format(self.username)
