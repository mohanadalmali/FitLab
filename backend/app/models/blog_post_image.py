from app import db

class BlogPostImage(db.Model):
    __tablename__ = 'BlogPostImages'
    
    image_id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('BlogPosts.post_id'), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    alt_text = db.Column(db.String(255))
    uploaded_at = db.Column(db.DateTime, server_default=db.func.now())
