import os
import random
import string
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from sib_api_v3_sdk import ApiClient, Configuration, TransactionalEmailsApi
from sib_api_v3_sdk.models import SendSmtpEmail
from ..extensions import db
from ..models.user import User

password_routes = Blueprint('password_routes', __name__)

def generate_random_password(length=10):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choices(characters, k=length))

@password_routes.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    new_password = generate_random_password()
    hashed_password = generate_password_hash(new_password)

    user.password = hashed_password
    db.session.commit()

    config = Configuration()
    config.api_key["api-key"] = os.getenv('BREVO_API_KEY')

    api_instance = TransactionalEmailsApi(ApiClient(config))
    email_data = SendSmtpEmail(
        sender={"name": "ShelfMate Support", "email": os.getenv('BREVO_SENDER_EMAIL')},
        to=[{"email": email}],
        subject="ShelfMate: Password Reset Request 🔑✨",
        html_content=f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f5f5dc; color: #333; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; padding: 20px; border-radius: 12px; 
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center; border: 1px solid #ddd;">

                <h2 style="color: #37474f;">🔒 Password Reset Request</h2>

                <p style="font-size: 16px;">Dear <strong>{user.name}</strong>,</p>

                <p style="font-size: 16px;">We have generated a new password for you. Please use the password below to log in:</p>

                <h3 style="font-size: 24px; background-color: #ffcc80; padding: 12px; border-radius: 6px; 
                           color: #37474f; font-weight: bold; display: inline-block;">
                    {new_password}
                </h3>

                <p style="font-size: 16px;">For security reasons, we highly recommend that you update your password once logged in.</p>

                <p style="font-size: 16px;">If you did not request this change, please let us know immediately.</p>

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
        return jsonify({
            "message": "A new password has been sent to your email.",
            "redirect_message": " Redirecting to sign in page in "
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to send email: {str(e)}"}), 500