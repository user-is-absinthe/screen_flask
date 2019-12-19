from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, ValidationError, EqualTo
from models import User


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In')


class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    password2 = PasswordField(
        'Repeat Password', validators=[DataRequired(), EqualTo('password')])
    # user_role = StringField('USerRole', validators=[DataRequired()])
    user_role = StringField('USerRole')
    submit = SubmitField('Зарегестрироваться')

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user is not None:
            raise ValidationError('Please use a different username.')


class ScribeForm(FlaskForm):
    texts = StringField('All texts')
    submit = SubmitField('Готово')


class GenRules(FlaskForm):
    field_name = StringField('FieldName', validators=[DataRequired()])
    color_to_name = StringField('Color', validators=[DataRequired()])
    submit = SubmitField('Готово')
    pass
