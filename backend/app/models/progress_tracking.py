from app import db

class ProgressTracking(db.Model):
    __tablename__ = 'ProgressTracking'
    
    progress_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), nullable=False)
    weight = db.Column(db.Numeric(5,2), nullable=False)
    BFP = db.Column(db.Numeric(5,2))
    muscle_mass = db.Column(db.Numeric(5,2))
    notes = db.Column(db.Text)
    recorded_at = db.Column(db.DateTime, server_default=db.func.now())
    progress_date = db.Column(db.Date, nullable=False)
