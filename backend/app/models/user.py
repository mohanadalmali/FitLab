from app import db
from sqlalchemy import Enum
from app.models.enums import GenderEnum, GoalEnum, ActivityLevelEnum  # Enum'ları buradan import et

class User(db.Model):
    __tablename__ = 'Users'
    
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    birth_date = db.Column(db.Date)
    gender = db.Column(Enum(GenderEnum))  # Enum'lar buradan geliyor
    weight = db.Column(db.Numeric(5, 2))
    height = db.Column(db.Numeric(5, 2))
    goal = db.Column(Enum(GoalEnum), nullable=False)  # Enum'lar buradan geliyor
    activity_level = db.Column(Enum(ActivityLevelEnum), default=ActivityLevelEnum.Sedentary)
    profile_picture = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    
    # İlişkiler
    diets = db.relationship('UserDiet', backref='user', lazy=True)
    exercises = db.relationship('UserExercise', backref='user', lazy=True)
    progress = db.relationship('ProgressTracking', backref='user', lazy=True)
    comments = db.relationship('BlogComment', backref='user', lazy=True)
