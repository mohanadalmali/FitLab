from app import db
from sqlalchemy import Enum
import enum

class GoalEnum(enum.Enum):
    lose_weight = "lose_weight"
    gain_weight = "gain_weight"
    maintain_weight = "maintain_weight"

class DietPlan(db.Model):
    __tablename__ = 'DietPlans'
    
    diet_id = db.Column(db.Integer, primary_key=True)
    plan_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    calories = db.Column(db.Integer, nullable=False)
    goal = db.Column(Enum(GoalEnum), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    
    # İlişki
    users = db.relationship('UserDiet', backref='diet_plan', lazy=True)
