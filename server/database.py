from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import DateTime, extract, ForeignKey, MetaData, cast, Table,create_engine
from flask import Flask
from flask_migrate import Migrate
from flask_login import UserMixin, LoginManager

convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}
metadata = MetaData(naming_convention=convention)
db = SQLAlchemy(metadata=metadata)
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./test.db'

login_manager = LoginManager(app)

@login_manager.user_loader
def load_user(user_id):
    getAdmin = EmbedAI_Admin.query.filter_by(id=user_id).first()
    return getAdmin

db.init_app(app)
db.app = app
app.secret_key = "gptAuth"
migrate = Migrate(app, db, compare_type=True,
                  render_as_batch=True)



class User(UserMixin,db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    token = db.Column(db.String(100))
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True, index=True)
    google_id = db.Column(db.String(100))
    profile_image = db.Column(db.String(100000))
    admin_id = db.Column(db.String(100), ForeignKey("admin.id"), index=True)

    def get_id(self):
        return (self.id)

class Admin(db.Model):
    __tablename__ = "admin"
    id = db.Column(db.String(100), primary_key=True)
    client_id = db.Column(db.String(100))
    client_secret = db.Column(db.String(100))
    google_client_id = db.Column(db.String(200))
    google_client_secret = db.Column(db.String(200))
    google_login_url = db.Column(db.String)
    users = db.relationship('User', backref='admin',
                                      cascade="all,delete", lazy='dynamic')
