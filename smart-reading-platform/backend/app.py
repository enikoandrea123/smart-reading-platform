import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .extensions import db
from .routes.auth_routes import auth_routes
from .routes.book_routes import book_routes
from .routes.favorite_routes import favorite_routes
from .routes.reading_list_routes import reading_list_routes
from flask_migrate import Migrate

migrate = Migrate()

def create_app():
    app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
    app.config.from_object('backend.config.Config')

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
    JWTManager(app)

    app.register_blueprint(auth_routes)
    app.register_blueprint(book_routes)
    app.register_blueprint(favorite_routes)
    app.register_blueprint(reading_list_routes)

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app