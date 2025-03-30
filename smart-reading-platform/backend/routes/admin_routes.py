from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from ..models.user import User
from ..extensions import db

admin_routes = Blueprint("admin_routes", __name__)

ADMIN_NAME = "admin"
ADMIN_EMAIL = "shelfmate.assistant@gmail.com"
ADMIN_DEFAULT_PASSWORD = "admin123"


def create_admin():
    with db.session.begin():
        admin = User.query.filter_by(name=ADMIN_NAME).first()
        if not admin:
            admin = User(
                name=ADMIN_NAME,
                email=ADMIN_EMAIL,
                password=generate_password_hash(ADMIN_DEFAULT_PASSWORD),
                is_admin=True
            )
            db.session.add(admin)
            db.session.commit()

@admin_routes.route("/manageusers", methods=["GET"])
@jwt_required()
def manage_users():
    current_user = get_jwt_identity()
    user = User.query.filter_by(name=current_user).first()

    if not user or not user.is_admin:
        return jsonify({"message": "Unauthorized access"}), 403

    users = User.query.all()
    users_list = [{"id": u.id, "name": u.name, "email": u.email} for u in users]

    return jsonify({"users": users_list})


@admin_routes.route("/statistic", methods=["GET"])
@jwt_required()
def statistics():
    current_user = get_jwt_identity()
    user = User.query.filter_by(name=current_user).first()

    if not user or not user.is_admin:
        return jsonify({"message": "Unauthorized access"}), 403

    total_users = User.query.count()

    return jsonify({
        "total_users": total_users,
        "message": "Statistics data will be implemented here."
    })