from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models.reading_list import ReadingList

reading_list_routes = Blueprint("reading_list_routes", __name__)

@reading_list_routes.route("/reading-list", methods=["POST"])
@jwt_required()
def add_to_reading_list():
    user_id = get_jwt_identity()
    data = request.json
    book_id = data.get("id")
    status = data.get("status")

    if not book_id or not status:
        return jsonify({"error": "Missing book ID or status"}), 400

    existing_entry = ReadingList.query.filter_by(user_id=user_id, book_id=book_id).first()
    if existing_entry:
        return jsonify({"message": "Book is already in reading list"}), 409

    reading_entry = ReadingList(user_id=user_id, book_id=book_id, status=status)
    db.session.add(reading_entry)
    db.session.commit()

    return jsonify({"message": "Book added to reading list"}), 201

@reading_list_routes.route("/reading-list", methods=["GET"])
@jwt_required()
def get_reading_list():
    user_id = get_jwt_identity()
    reading_list = ReadingList.query.filter_by(user_id=user_id).all()

    books = [{"book_id": entry.book_id, "status": entry.status} for entry in reading_list]

    return jsonify(books), 200

@reading_list_routes.route("/reading-list/<book_id>", methods=["PUT"])
@jwt_required()
def update_reading_status(book_id):
    user_id = get_jwt_identity()
    data = request.json
    new_status = data.get("status")

    if not new_status:
        return jsonify({"error": "Missing new status"}), 400

    entry = ReadingList.query.filter_by(user_id=user_id, book_id=book_id).first()
    if not entry:
        return jsonify({"message": "Book not found in reading list"}), 404

    entry.status = new_status
    db.session.commit()

    return jsonify({"message": "Reading status updated"}), 200

@reading_list_routes.route("/reading-list/<book_id>", methods=["DELETE"])
@jwt_required()
def remove_from_reading_list(book_id):
    user_id = get_jwt_identity()
    entry = ReadingList.query.filter_by(user_id=user_id, book_id=book_id).first()

    if not entry:
        return jsonify({"message": "Book not found in reading list"}), 404

    db.session.delete(entry)
    db.session.commit()

    return jsonify({"message": "Book removed from reading list"}), 200