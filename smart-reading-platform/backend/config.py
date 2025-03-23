import os
from datetime import timedelta


class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(BASE_DIR, "final_database.db")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'titkos_kulcs')

    JWT_SECRET_KEY = "titkos_kulcs"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=6)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    BREVO_API_KEY = os.getenv('BREVO_API_KEY', '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')
    BREVO_SENDER_EMAIL = os.getenv('BREVO_SENDER_EMAIL', 'shelfmate.assistant@gmail.com')