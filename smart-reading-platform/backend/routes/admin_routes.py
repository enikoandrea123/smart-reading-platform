from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from ..models.user import User
from ..extensions import db
from sib_api_v3_sdk import Configuration, ApiClient, TransactionalEmailsApi, SendSmtpEmail
import os
from ..models.favorite import FavoriteBook
from ..models.reading_list import ReadingList

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
def get_all_users():
    current_user_id = get_jwt_identity()
    print(f"Current user ID: {current_user_id}")

    admin = User.query.filter_by(id=current_user_id, is_admin=True).first()
    if not admin:
        return jsonify({"message": "Unauthorized access, admin privileges required"}), 403

    users = User.query.all()
    users_list = [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "last_login": u.last_login.strftime("%Y-%m-%d %H:%M:%S") if u.last_login else "Never"
        }
        for u in users if not u.is_admin
    ]

    return jsonify(users_list)

@admin_routes.route("/deleteuser/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()

    admin = User.query.filter_by(id=current_user_id, is_admin=True).first()
    if not admin:
        return jsonify({"message": "Unauthorized access"}), 403

    if current_user_id == user_id:
        return jsonify({"message": "Admins cannot delete themselves"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    try:
        db.session.delete(user)
        db.session.commit()

        send_account_deletion_email(user)

        return jsonify({"message": f"User {user.name} deleted successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error deleting user: {str(e)}"}), 500


def send_account_deletion_email(user):
    config = Configuration()
    config.api_key["api-key"] = os.getenv('BREVO_API_KEY')

    api_instance = TransactionalEmailsApi(ApiClient(config))
    email_data = SendSmtpEmail(
        sender={"name": "ShelfMate Support", "email": os.getenv('BREVO_SENDER_EMAIL')},
        to=[{"email": user.email}],
        subject="ShelfMate Account Deletion Notice ❌",
        html_content=f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f5f5dc; color: #333; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; padding: 20px; border-radius: 12px; 
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center; border: 1px solid #ddd;">
                <h2 style="color: #D32F2F;">🚨 Account Deletion Notification</h2>

                <p style="font-size: 16px;">Dear <strong>{user.name}</strong>,</p>

                <p style="font-size: 16px;">Your ShelfMate account has been deleted by an administrator. If you believe this was a mistake, please contact us immediately.</p>

                <p style="font-size: 16px;">We’re sorry to see you go and hope to welcome you back in the future!</p>

                <br>

                <p style="font-size: 16px;">Best regards,</p>
                <p style="font-size: 16px; font-weight: bold; color: #37474f;">ShelfMate Team 📚</p>

                <div style="text-align: center; margin-top: 20px;">
                    <p style="font-size: 14px; color: #666;">
                        Need help? <a href="mailto:shelfmate.assistant@gmail.com" 
                        style="color: #0073e6; text-decoration: none;">Contact our support team 📧</a>.
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
    )

    try:
        api_instance.send_transac_email(email_data)
    except Exception as e:
        print(f"Failed to send account deletion email: {str(e)}")

@admin_routes.route("/statistics", methods=["GET"])
@jwt_required()
def statistics():
    current_user_id = get_jwt_identity()

    admin = User.query.filter_by(id=current_user_id, is_admin=True).first()
    if not admin:
        return jsonify({"message": "Unauthorized access, admin privileges required"}), 403

    total_users = User.query.count()
    total_favorites = FavoriteBook.query.count()
    total_reading_list = ReadingList.query.count()
    active_users = User.query.filter(User.last_login >= datetime.utcnow() - timedelta(days=30)).count()

    active_users_by_day = (
        db.session.query(
            db.func.date(User.last_login).label("date"),
            db.func.count(User.id).label("count"),
        )
        .filter(User.last_login >= datetime.utcnow() - timedelta(days=30))
        .group_by(db.func.date(User.last_login))
        .all()
    )

    if not active_users_by_day:
        active_users_by_day = [{"date": "No data", "count": 0}]

    else:
        active_users_by_day = [{"date": day[0] if isinstance(day[0], str) else day[0].strftime("%Y-%m-%d"), "count": day[1]} for day in active_users_by_day]

    return jsonify({
        "total_users": total_users,
        "total_favorites": total_favorites,
        "total_reading_list": total_reading_list,
        "active_users": active_users,
        "active_users_by_day": active_users_by_day,
        "message": "Statistics data fetched successfully"
    })