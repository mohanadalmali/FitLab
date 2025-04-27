from flask import Blueprint
from app import db
from sqlalchemy import text

# Test Blueprint'i
test_bp = Blueprint('test', __name__)

@test_bp.route('/test-db', methods=['GET'])
def test_db():
    try:
        # Veritabanı bağlantısını test etmek için doğru SQL ifadesini kullan
        db.session.execute(text('SELECT 1'))
        return 'Veritabanı bağlantısı başarılı!', 200
    except Exception as e:
        return f'Veritabanı bağlantısı başarısız: {str(e)}', 500
