from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from .config import Config

# Veritabanı nesnesini global olarak tanımlıyoruz
db = SQLAlchemy()

def create_app():
    # Flask uygulamasını başlatıyoruz
    app = Flask(__name__)

    # CORS başlatıyoruz (React'tan API çağırabilmek için)
    CORS(app)

    # Konfigürasyonu yüklüyoruz
    app.config.from_object(Config)

    # Veritabanı bağlantısını başlatıyoruz
    db.init_app(app)

    # Modelleri import ediyoruz
    from app.models import User, Admin, DietPlan, ExercisePlan, UserDiet, UserExercise, ProgressTracking, BlogPost, BlogPostImage, BlogComment

    # Blueprintleri kaydediyoruz
    from app.routes.example import example_bp
    from app.routes.test import test_bp  # Test blueprint'ini import ediyoruz
    app.register_blueprint(example_bp, url_prefix="/api")
    app.register_blueprint(test_bp, url_prefix="/api")

    # Veritabanı tablolarını oluşturuyoruz (geliştirme ortamı için)
    with app.app_context():
        db.create_all()

    return app
