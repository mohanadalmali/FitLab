from app import db
from sqlalchemy import Enum
import enum

class GenderEnum(enum.Enum):
    Male = "Male"
    Female = "Female"
    Other = "Other"

class GoalEnum(enum.Enum):
    lose_weight = "lose_weight"
    gain_weight = "gain_weight"
    maintain_weight = "maintain_weight"

class ActivityLevelEnum(enum.Enum):
    sedentary = "sedentary"
    lightly_active = "lightly_active"
    moderately_active = "moderately_active"
    very_active = "very_active"
    super_active = "super_active"

class User(db.Model):
    __tablename__ = 'Users'
    
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    birth_date = db.Column(db.Date)
    gender = db.Column(Enum(GenderEnum))
    weight = db.Column(db.Numeric(5,2))
    height = db.Column(db.Numeric(5,2))
    goal = db.Column(Enum(GoalEnum), nullable=False)
    activity_level = db.Column(Enum(ActivityLevelEnum), default=ActivityLevelEnum.sedentary)
    profile_picture = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    
    # İlişkiler
    diets = db.relationship('UserDiet', backref='user', lazy=True)
    exercises = db.relationship('UserExercise', backref='user', lazy=True)
    progress = db.relationship('ProgressTracking', backref='user', lazy=True)
    comments = db.relationship('BlogComment', backref='user', lazy=True)
