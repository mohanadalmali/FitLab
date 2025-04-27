from app import db

class UserExercise(db.Model):
    __tablename__ = 'UserExercise'
    
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), primary_key=True)
    exercise_id = db.Column(db.Integer, db.ForeignKey('ExercisePlans.exercise_id'), primary_key=True)
    assigned_at = db.Column(db.DateTime, server_default=db.func.now())
