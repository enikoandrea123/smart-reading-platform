from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models.favorite import FavoriteBook
from ..models.reading_list import ReadingList

favorite_routes = Blueprint("favorite_routes", __name__)

@favorite_routes.route("/favorites", methods=["POST"])
@jwt_required()
def add_favorite():
    user_id = get_jwt_identity()
    data = request.json
    book_id = data.get("id")

    if not book_id:
        return jsonify({"error": "Missing book ID"}), 400

    existing_favorite = FavoriteBook.query.filter_by(user_id=user_id, book_id=book_id).first()
    if existing_favorite:
        return jsonify({"message": "Book is already in favorites"}), 409

    favorite = FavoriteBook(user_id=user_id, book_id=book_id)
    db.session.add(favorite)
    db.session.commit()

    return jsonify({"message": "Book added to favorites"}), 201

@favorite_routes.route("/favorites", methods=["GET"])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    favorites = FavoriteBook.query.filter_by(user_id=user_id).all()

    favorite_books = [fav.book_id for fav in favorites]

    return jsonify(favorite_books), 200

@favorite_routes.route("/favorites/<book_id>", methods=["DELETE"])
@jwt_required()
def remove_favorite(book_id):
    user_id = get_jwt_identity()
    favorite = FavoriteBook.query.filter_by(user_id=user_id, book_id=book_id).first()

    if not favorite:
        return jsonify({"message": "Book not found in favorites"}), 404

    db.session.delete(favorite)
    db.session.commit()

    return jsonify({"message": "Book removed from favorites"}), 200