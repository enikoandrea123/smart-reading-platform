import logging
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models.reading_list import ReadingList

logging.basicConfig(level=logging.DEBUG)
reading_list_routes = Blueprint("reading_list_routes", __name__)

@reading_list_routes.route("/reading-list", methods=["POST"])
@jwt_required()
def add_to_reading_list():
    user_id = get_jwt_identity()
    data = request.json
    book_id = data.get("book_id")
    status = data.get("status", "not started")

    logging.debug(f"User {user_id} is adding book {book_id} with status {status}")

    if not book_id:
        logging.debug("Book ID is missing in the request.")
        return jsonify({"error": "Missing book ID"}), 400

    existing_entry = ReadingList.query.filter_by(user_id=user_id, book_id=book_id).first()
    if existing_entry:
        logging.debug(f"Book {book_id} is already in the reading list of user {user_id}")
        return jsonify({"message": "Book is already in the reading list"}), 409

    try:
        reading_entry = ReadingList(user_id=user_id, book_id=book_id, status=status)
        db.session.add(reading_entry)
        db.session.commit()
        logging.debug(f"Book {book_id} successfully added to the reading list.")
        return jsonify({"message": "Book added to reading list"}), 201
    except Exception as e:
        logging.error(f"Error adding book to reading list: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Failed to add book to reading list"}), 500

@reading_list_routes.route("/reading-list", methods=["GET"])
@jwt_required()
def get_reading_list():
    user_id = get_jwt_identity()
    logging.debug(f"Fetching reading list for user {user_id}")

    reading_list = ReadingList.query.filter_by(user_id=user_id).all()
    books = [{"book_id": entry.book_id, "status": entry.status} for entry in reading_list]

    logging.debug(f"Reading list fetched: {books}")
    return jsonify(books), 200

@reading_list_routes.route("/reading-list/<book_id>", methods=["PUT"])
@jwt_required()
def update_reading_status(book_id):
    user_id = get_jwt_identity()
    data = request.json
    new_status = data.get("status")

    if not new_status:
        logging.debug("New status missing in request.")
        return jsonify({"error": "Missing new status"}), 400

    entry = ReadingList.query.filter_by(user_id=user_id, book_id=book_id).first()
    if not entry:
        logging.debug(f"Book {book_id} not found in reading list of user {user_id}")
        return jsonify({"message": "Book not found in reading list"}), 404

    entry.status = new_status
    db.session.commit()
    logging.debug(f"Book {book_id} status updated to {new_status}")

    return jsonify({"message": "Reading status updated"}), 200

@reading_list_routes.route("/reading-list/<book_id>", methods=["DELETE"])
@jwt_required()
def remove_from_reading_list(book_id):
    user_id = get_jwt_identity()
    entry = ReadingList.query.filter_by(user_id=user_id, book_id=book_id).first()

    if not entry:
        logging.debug(f"Book {book_id} not found in reading list of user {user_id}")
        return jsonify({"message": "Book not found in reading list"}), 404

    db.session.delete(entry)
    db.session.commit()
    logging.debug(f"Book {book_id} removed from reading list.")

    return jsonify({"message": "Book removed from reading list"}), 200