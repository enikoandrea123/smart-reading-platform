import requests
from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models.book import Book
book_routes = Blueprint("book_routes", __name__)

GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes"

@book_routes.route("/explore_books", methods=["GET"])
def get_explore_books():
    page = int(request.args.get("page", 1))
    max_results = 40
    start_index = (page - 1) * max_results

    params = {
        "q": "subject:literature",
        "langRestrict": "en",
        "printType": "books",
        "maxResults": max_results,
        "startIndex": start_index,
    }

    response = requests.get(GOOGLE_BOOKS_API_URL, params=params)

    if response.status_code != 200:
        return jsonify({"error": f"Failed to fetch books: {response.text}"}), 500

    books_data = response.json().get("items", [])

    books = []
    for book in books_data:
        volume_info = book.get("volumeInfo", {})
        books.append({
            "id": book.get("id"),
            "title": volume_info.get("title", "No Title"),
            "author": ", ".join(volume_info.get("authors", ["Unknown"])),
            "genre": ", ".join(volume_info.get("categories", ["Unknown"])),
            "coverImage": volume_info.get("imageLinks", {}).get("thumbnail", ""),
            "publishedDate": volume_info.get("publishedDate", "Unknown"),
        })

    return jsonify(books), 200

@book_routes.route("/add_review", methods=["POST"])
def add_review():
    data = request.json
    book_id = data.get("id")
    title = data.get("title")
    author = data.get("author")

    if not book_id or not title or not author:
        return jsonify({"error": "Missing book data"}), 400

    existing_book = Book.query.filter_by(id=book_id).first()
    if not existing_book:
        new_book = Book(id=book_id, title=title, author=author)
        db.session.add(new_book)
        db.session.commit()

    return jsonify({"message": "Review added successfully"}), 200