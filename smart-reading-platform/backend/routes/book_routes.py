import requests
from flask import Blueprint, request, jsonify

book_routes = Blueprint("book_routes", __name__)

GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes"


@book_routes.route("/book_detail", methods=["GET"])
def get_book_detail():
    book_id = request.args.get("id")

    if not book_id:
        return jsonify({"error": "No book ID provided"}), 400

    print(f"Fetching details for book ID: {book_id}")

    response = requests.get(f"{GOOGLE_BOOKS_API_URL}/{book_id}")

    if response.status_code != 200:
        print(f"Error from Google API: {response.text}")
        return jsonify({"error": f"Failed to fetch book details: {response.text}"}), 500

    book = response.json().get("volumeInfo", {})

    book_data = {
        "id": book_id,
        "title": book.get("title", "No Title"),
        "author": ", ".join(book.get("authors", ["Unknown"])),
        "genre": ", ".join(book.get("categories", ["Unknown"])),
        "coverImage": book.get("imageLinks", {}).get("thumbnail", ""),
        "description": book.get("description", "No description available."),
        "ratings": book.get("averageRating", "No ratings available"),
        "publisher": book.get("publisher", "Unknown Publisher"),
        "publishedDate": book.get("publishedDate", "Unknown Date"),
        "pageCount": book.get("pageCount", "Unknown"),
        "buyLink": book.get("infoLink", "#")
    }

    print(f"Fetched book data: {book_data}")

    return jsonify(book_data), 200

@book_routes.route("/explore_books", methods=["GET"])
def get_explore_books():
    book_id = request.args.get("id")
    search_query = request.args.get("query", "").strip()
    page = int(request.args.get("page", 1))
    max_results = 40
    start_index = (page - 1) * max_results

    if book_id:
        return get_book_detail()

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