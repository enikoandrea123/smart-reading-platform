import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .extensions import db
from .routes.auth_routes import auth_routes

def create_app():
    app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
    app.config.from_object('backend.config.Config')

    db.init_app(app)
    CORS(app)
    JWTManager(app)

    app.register_blueprint(auth_routes)

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app