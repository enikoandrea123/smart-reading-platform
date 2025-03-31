from datetime import datetime
from ..extensions import db
from sqlalchemy import CheckConstraint

class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    book_id = db.Column(db.String, nullable=False)
    comment = db.Column(db.String(200), nullable=False)
    liked = db.Column(db.Boolean, default=False, nullable=False)

    user = db.relationship('User', backref=db.backref('comments', lazy=True))

    __table_args__ = (
        CheckConstraint('length(comment) <= 200', name='check_comment_length'),
    )

    def __repr__(self):
        return f"<Comment user_id={self.user_id}, book_id={self.book_id}, date={self.date}, comment={self.comment}, liked={self.liked}>"

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date.strftime("%Y-%m-%d %H:%M:%S"),
            "user_id": self.user_id,
            "book_id": self.book_id,
            "comment": self.comment,
            "liked": self.liked
        }