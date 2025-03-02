import random
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.favorite import FavoriteBook
from ..models.reading_list import ReadingList
import requests

recommendations_routes = Blueprint("recommendations_routes", __name__)


@recommendations_routes.route("/recommendations", methods=["GET"])
@jwt_required()
def get_recommendations():
    user_id = get_jwt_identity()

    favorite_books = FavoriteBook.query.filter_by(user_id=user_id).all()
    reading_list_books = ReadingList.query.filter_by(user_id=user_id).all()

    all_books = favorite_books + reading_list_books

    if not all_books:
        return jsonify({"message": "No favorites or reading list found."}), 400

    user_genres = []
    for book in all_books:
        book_id = book.book_id
        google_books_api_url = f"https://www.googleapis.com/books/v1/volumes/{book_id}"
        response = requests.get(google_books_api_url)
        if response.status_code == 200:
            book_data = response.json()
            volume_info = book_data.get("volumeInfo", {})
            genres = volume_info.get("categories", [])
            user_genres.extend(genres)

    if not user_genres:
        return get_random_recommendations()

    user_genres = list(set(user_genres))

    recommended_books = get_books_by_genre(user_genres)

    recommendations = random.sample(recommended_books, 3)

    return jsonify(recommendations), 200


def get_books_by_genre(genres):
    all_books = []

    for genre in genres:
        google_books_api_url = f"https://www.googleapis.com/books/v1/volumes?q=subject:{genre}"
        response = requests.get(google_books_api_url)

        if response.status_code == 200:
            book_data = response.json()
            items = book_data.get("items", [])
            for item in items:
                book_info = item.get("volumeInfo", {})
                all_books.append({
                    "book_id": item.get("id"),
                    "title": book_info.get("title"),
                    "author": book_info.get("authors", ["Unknown Author"])[0],
                    "cover": book_info.get("imageLinks", {}).get("thumbnail", ""),
                    "rating": book_info.get("averageRating", "N/A"),
                })

    return all_books


def get_random_recommendations():
    google_books_api_url = "https://www.googleapis.com/books/v1/volumes?q=bestsellers"
    response = requests.get(google_books_api_url)

    if response.status_code == 200:
        book_data = response.json()
        items = book_data.get("items", [])
        recommended_books = []
        for item in items:
            book_info = item.get("volumeInfo", {})
            recommended_books.append({
                "book_id": item.get("id"),
                "title": book_info.get("title"),
                "author": book_info.get("authors", ["Unknown Author"])[0],
                "cover": book_info.get("imageLinks", {}).get("thumbnail", ""),
                "rating": book_info.get("averageRating", "N/A"),
            })
        return recommended_books[:3]

    return []