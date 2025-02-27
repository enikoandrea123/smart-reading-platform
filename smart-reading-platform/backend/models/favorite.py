from ..extensions import db

class FavoriteBook(db.Model):
    __tablename__ = 'favorite_books'

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True, nullable=False)
    book_id = db.Column(db.String, primary_key=True, nullable=False)

    user = db.relationship('User', backref=db.backref('favorite_books', lazy=True))

    def __repr__(self):
        return f"<FavoriteBook user_id={self.user_id}, book_id={self.book_id}>"