from ..extensions import db


class ReadingList(db.Model):
    __tablename__ = 'reading_list'

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True, nullable=False)
    book_id = db.Column(db.String, primary_key=True, nullable=False)
    status = db.Column(db.String(50), nullable=False)

    user = db.relationship('User', backref=db.backref('reading_list', lazy=True))

    def __repr__(self):
        return f"<ReadingList user_id={self.user_id}, book_id={self.book_id}, status={self.status}>"