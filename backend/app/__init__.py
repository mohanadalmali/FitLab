from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from .config import Config
from app.routes import example  # örnek route varsa

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
        # Modelleri import ediyoruz
    from app.models.user import User
    from app.models.diet_plan import DietPlan
    from app.models.exercise_plan import ExercisePlan
    from app.models.user_diet import UserDiet
    from app.models.user_exercise import UserExercise
    from app.models.progress_tracking import ProgressTracking
    from app.models.blog_post import BlogPost
    from app.models.blog_post_image import BlogPostImage
    from app.models.blog_comment import BlogComment
    from app.routes.user_routes import user_bp


    app.register_blueprint(example_bp, url_prefix="/api")
    app.register_blueprint(test_bp, url_prefix="/api")
    app.register_blueprint(user_bp, url_prefix="/api")
    
    
    
    # Veritabanı tablolarını oluşturuyoruz (geliştirme ortamı için)
    with app.app_context():
        db.create_all()

    return app
