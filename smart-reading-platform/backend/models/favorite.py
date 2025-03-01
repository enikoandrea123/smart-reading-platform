from ..extensions import db
from sqlalchemy import CheckConstraint


class FavoriteBook(db.Model):
    __tablename__ = 'favorite_books'

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True, nullable=False)
    book_id = db.Column(db.String, primary_key=True, nullable=False)
    rating = db.Column(db.Integer, default=0, nullable=False)

    user = db.relationship('User', backref=db.backref('favorite_books', lazy=True))
    __table_args__ = (
        CheckConstraint('rating IN (0, 1, 2, 3)', name='check_rating'),
    )

    def __repr__(self):
        return f"<FavoriteBook user_id={self.user_id}, book_id={self.book_id}, rating={self.rating}>"