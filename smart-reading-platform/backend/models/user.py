from ..extensions import db

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    reading_goal = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f"<User {self.name}>"

    def to_dict(self):
        return {"id": self.id, "name": self.name, "email": self.email, "reading_goal": self.reading_goal}