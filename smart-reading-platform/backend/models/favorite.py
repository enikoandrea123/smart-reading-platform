from ..extensions import db

class FavoriteBook(db.Model):
    __tablename__ = 'favorite_books'

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True, nullable=False)
    book_id = db.Column(db.String, primary_key=True, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    cover_image = db.Column(db.String(500), nullable=True)

    user = db.relationship('User', backref=db.backref('favorite_books', lazy=True))

    def __repr__(self):
        return f"<FavoriteBook {self.title} by {self.author}>"