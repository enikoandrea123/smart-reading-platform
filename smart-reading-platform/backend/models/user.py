from datetime import datetime
from ..extensions import db

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    reading_goal = db.Column(db.Integer, default=0)
    is_admin = db.Column(db.Boolean, default=False)
    last_login = db.Column(db.DateTime, nullable=True)

    def update_last_login(self):
        self.last_login = datetime.utcnow()
        db.session.commit()

    def __repr__(self):
        return f"<User {self.name}>"

    def to_dict(self):
        return {"id": self.id, "name": self.name, "email": self.email, "reading_goal": self.reading_goal, "is_admin": self.is_admin, "last_login": self.last_login.strftime("%Y-%m-%d %H:%M:%S") if self.last_login else "Never"}