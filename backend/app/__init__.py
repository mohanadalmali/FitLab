import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .models import db
from .routes import api_bp  # /api altındaki tüm route'lar burada tanımlı
# from flask_migrate import Migrate

# migrate = Migrate()  # Migration kullanmayacağımız için bu satırı kaldırıyoruz.

def create_app():
    app = Flask(__name__)
    # Config ayarlarını yükle (app/config.py içinde Config sınıfı olmalı)
    app.config.from_object('app.config.Config')

    # CORS
    CORS(app)

    # SQLAlchemy
    db.init_app(app)

    # JWT
    jwt = JWTManager(app)

    # Blueprint (tüm /api rotaları)
    app.register_blueprint(api_bp)

    # migrate.init_app(app, db)  # Bunu çıkardık

    # Tablo oluşturma: Uygulama her ayağa kalktığında eksik tabloları oluştur
    with app.app_context():
        db.create_all()

    return app
