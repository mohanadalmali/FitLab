from app import db
from sqlalchemy import Enum
import enum

class IntensityEnum(enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"

class ExercisePlan(db.Model):
    __tablename__ = 'ExercisePlans'
    
    exercise_id = db.Column(db.Integer, primary_key=True)
    plan_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    intensity = db.Column(Enum(IntensityEnum), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    
    # İlişki
    users = db.relationship('UserExercise', backref='exercise_plan', lazy=True)
