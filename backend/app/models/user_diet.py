from app import db

class UserDiet(db.Model):
    __tablename__ = 'UserDiet'
    
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), primary_key=True)
    diet_id = db.Column(db.Integer, db.ForeignKey('DietPlans.diet_id'), primary_key=True)
    assigned_at = db.Column(db.DateTime, server_default=db.func.now())
