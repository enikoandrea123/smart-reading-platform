from flask import request, jsonify, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token
from datetime import timedelta, datetime
from ..models.user import User
from ..extensions import db
from sib_api_v3_sdk import Configuration, ApiClient, TransactionalEmailsApi, SendSmtpEmail
import os


auth_routes = Blueprint('auth', __name__, url_prefix='/')

@auth_routes.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": "Email already in use"}), 409

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    new_user = User(name=name, email=email, password=hashed_password)
    try:
        db.session.add(new_user)
        db.session.commit()

        access_token = create_access_token(identity=new_user.id, expires_delta=timedelta(hours=6))
        refresh_token = create_refresh_token(identity=new_user.id)

        # Send Welcome Email
        send_welcome_email(new_user)

        return jsonify({
            "message": "User registered successfully",
            "token": access_token,
            "refresh_token": refresh_token,
            "user": new_user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error registering user", "error": str(e)}), 500


def send_welcome_email(user):
    config = Configuration()
    config.api_key["api-key"] = os.getenv('BREVO_API_KEY')

    api_instance = TransactionalEmailsApi(ApiClient(config))
    email_data = SendSmtpEmail(
        sender={"name": "ShelfMate Support", "email": os.getenv('BREVO_SENDER_EMAIL')},
        to=[{"email": user.email}],
        subject="Welcome to ShelfMate! 📚✨",
        html_content=f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f5f5dc; color: #333; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; padding: 20px; border-radius: 12px; 
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center; border: 1px solid #ddd;">
                <h2 style="color: #37474f;">🎉 Welcome to ShelfMate, {user.name}!</h2>

                <p style="font-size: 16px;">We're thrilled to have you join our book-loving community! 📖✨</p>

                <p style="font-size: 16px;">With ShelfMate, you can track your reading, set goals, and get personalized book recommendations.</p>

                <p style="font-size: 16px;">Start exploring now and discover your next favorite book! 🚀</p>

                <br>

                <p style="font-size: 16px;">Happy reading,</p>
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
        print(f"Failed to send welcome email: {str(e)}")

@auth_routes.route('/signin', methods=['POST'])
def signin():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401

    user.last_login = datetime.utcnow()
    db.session.commit()

    access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=6))
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict()
    }), 200


@auth_routes.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"user": {"name": user.name, "email": user.email}}), 200

@auth_routes.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    data = request.json
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not current_password or not new_password:
        return jsonify({"message": "Current password and new password are required"}), 400

    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if not user or not check_password_hash(user.password, current_password):
        return jsonify({"message": "Incorrect current password"}), 401

    hashed_new_password = generate_password_hash(new_password, method='pbkdf2:sha256')
    user.password = hashed_new_password

    try:
        db.session.commit()
        send_password_change_email(user)
        return jsonify({"message": "Password changed successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating password", "error": str(e)}), 500


def send_password_change_email(user):
    config = Configuration()
    config.api_key["api-key"] = os.getenv('BREVO_API_KEY')

    api_instance = TransactionalEmailsApi(ApiClient(config))
    email_data = SendSmtpEmail(
        sender={"name": "ShelfMate Support", "email": os.getenv('BREVO_SENDER_EMAIL')},
        to=[{"email": user.email}],
        subject="ShelfMate: Password Changed Successfully 🔒",
        html_content=f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f5f5dc; color: #333; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; padding: 20px; border-radius: 12px; 
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center; border: 1px solid #ddd;">
                <h2 style="color: #37474f;">🔒 Password Change Confirmation</h2>

                <p style="font-size: 16px;">Dear <strong>{user.name}</strong>,</p>

                <p style="font-size: 16px;">Your password has been successfully changed. If you did not make this change, please contact us immediately.</p>

                <p style="font-size: 16px;">For security reasons, please do not share your password with anyone.</p>

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
        print(f"Failed to send password change email: {str(e)}")

@auth_routes.route('/delete-account', methods=['POST'])
@jwt_required()
def delete_account():
    data = request.json
    current_password = data.get('current_password')

    if not current_password:
        return jsonify({"message": "Current password is required"}), 400

    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if not user or not check_password_hash(user.password, current_password):
        return jsonify({"message": "Incorrect current password"}), 401

    try:
        db.session.delete(user)
        db.session.commit()

        send_account_deletion_email(user)

        return jsonify({"message": "Account deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting account", "error": str(e)}), 500


def send_account_deletion_email(user):
    config = Configuration()
    config.api_key["api-key"] = os.getenv('BREVO_API_KEY')

    api_instance = TransactionalEmailsApi(ApiClient(config))
    email_data = SendSmtpEmail(
        sender={"name": "ShelfMate Support", "email": os.getenv('BREVO_SENDER_EMAIL')},
        to=[{"email": user.email}],
        subject="ShelfMate: Account Deletion Confirmation ❌",
        html_content=f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f5f5dc; color: #333; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; padding: 20px; border-radius: 12px; 
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center; border: 1px solid #ddd;">
                <h2 style="color: #D32F2F;">🚨 Account Deletion Confirmation</h2>

                <p style="font-size: 16px;">Dear <strong>{user.name}</strong>,</p>

                <p style="font-size: 16px;">Your ShelfMate account has been successfully deleted. We’re sorry to see you go!</p>

                <p style="font-size: 16px;">If this was a mistake or you want to restore your account, please contact us immediately.</p>

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
@auth_routes.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=user_id, expires_delta=timedelta(hours=6))
    return jsonify({"token": new_access_token}), 200