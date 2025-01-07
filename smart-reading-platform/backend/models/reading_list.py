from ..app import db

class ReadingList(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True, nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), primary_key=True, nullable=False)
    status = db.Column(db.String(50), nullable=False)

    user = db.relationship('User', backref=db.backref('reading_list', lazy=True))
    book = db.relationship('Book', backref=db.backref('reading_list', lazy=True))

    def __repr__(self):
        return f'<ReadingList {self.status} for User {self.user.name}>'