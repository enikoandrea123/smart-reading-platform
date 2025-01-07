from ..app import db

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)

    user = db.relationship('User', backref=db.backref('reviews', lazy=True))
    book = db.relationship('Book', backref=db.backref('reviews', lazy=True))

    def __repr__(self):
        return f'<Review {self.rating} for Book {self.book.title}>'