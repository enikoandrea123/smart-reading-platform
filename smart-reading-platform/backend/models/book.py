from ..app import db

class Book(db.Model):
    __tablename__ = ('book')

    id = db.Column(db.String, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)

    def __init__(self, id, title, author):
        self.id = id
        self.title = title
        self.author = author

    def __repr__(self):
        return f"<Book {self.title} by {self.author}>"