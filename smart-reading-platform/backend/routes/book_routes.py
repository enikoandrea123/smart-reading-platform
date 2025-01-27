import requests
from flask import Blueprint, request, jsonify

book_routes = Blueprint("book_routes", __name__)

GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes"

@book_routes.route("/explore_books", methods=["GET"])
def get_explore_books():
    search_query = request.args.get("query", "").strip()
    page = int(request.args.get("page", 1))
    max_results = 40
    start_index = (page - 1) * max_results

    params = {
        "q": search_query or "popular books",
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
            "coverImage": volume_info.get("imageLinks", {}).get("thumbnail", "")
        })

    if not books:
        return jsonify({"message": "No books found matching the criteria"}), 404

    return jsonify(books), 200