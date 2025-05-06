# app/routes/user_routes.py

from flask import Blueprint, request, jsonify
from app import db
from app.models import User, GenderEnum, GoalEnum, ActivityLevelEnum
from werkzeug.security import generate_password_hash

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    try:
        # Şifreyi hash'liyoruz
        hashed_password = generate_password_hash(data['password'], method='sha256')

        # Yeni kullanıcı oluşturuyoruz
        new_user = User(
            username=data['username'],
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            email=data['email'],
            password=hashed_password,
            birth_date=data.get('birth_date'),
            gender=GenderEnum(data.get('gender')) if data.get('gender') else None,
            weight=data.get('weight'),
            height=data.get('height'),
            goal=GoalEnum(data['goal']),
            activity_level=ActivityLevelEnum(data.get('activity_level', 'sedentary')),
            profile_picture=data.get('profile_picture')
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'Kullanıcı başarıyla oluşturuldu.'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
