import sys
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models.favorite import FavoriteBook

favorite_routes = Blueprint("favorite_routes", __name__)

@favorite_routes.route("/favorites", methods=["POST"])
@jwt_required()
def add_favorite():
    user_id = get_jwt_identity()
    data = request.json
    book_id = data.get("book_id")

    print(f"User ID: {user_id}, Book ID: {book_id}", file=sys.stderr)

    if not book_id:
        return jsonify({"error": "Missing book ID"}), 400

    existing_favorite = FavoriteBook.query.filter_by(user_id=user_id, book_id=book_id).first()
    if existing_favorite:
        return jsonify({"message": "Book is already in favorites"}), 409

    try:
        favorite = FavoriteBook(user_id=user_id, book_id=book_id)
        db.session.add(favorite)
        db.session.commit()
        return jsonify({"message": "Book added to favorites"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}", file=sys.stderr)
        return jsonify({"error": "Failed to add to favorites"}), 500

@favorite_routes.route("/favorites", methods=["GET"])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    favorites = FavoriteBook.query.filter_by(user_id=user_id).all()

    favorite_books = [{"book_id": fav.book_id, "rating": fav.rating} for fav in favorites]

    return jsonify(favorite_books), 200

@favorite_routes.route("/favorites/<book_id>", methods=["DELETE"])
@jwt_required()
def remove_favorite(book_id):
    user_id = get_jwt_identity()
    favorite = FavoriteBook.query.filter_by(user_id=user_id, book_id=book_id).first()

    if not favorite:
        return jsonify({"message": "Book not found in favorites"}), 404

    try:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({"message": "Book removed from favorites"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}", file=sys.stderr)
        return jsonify({"error": "Failed to remove from favorites"}), 500

@favorite_routes.route("/favorites/rating/<book_id>", methods=["PUT"])
@jwt_required()
def update_rating(book_id):
    user_id = get_jwt_identity()
    data = request.json
    new_rating = data.get("rating")

    if new_rating is None or not (0 <= new_rating <= 3):
        return jsonify({"error": "Invalid rating value"}), 400

    favorite = FavoriteBook.query.filter_by(user_id=user_id, book_id=book_id).first()

    if not favorite:
        return jsonify({"error": "Book not found in favorites"}), 404

    try:
        favorite.rating = new_rating
        db.session.commit()
        return jsonify({"message": "Rating updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}", file=sys.stderr)
        return jsonify({"error": "Failed to update rating"}), 500