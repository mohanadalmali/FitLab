from app import db

class BlogPost(db.Model):
    __tablename__ = 'BlogPosts'
    
    post_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    admin_id = db.Column(db.Integer, db.ForeignKey('Admin.admin_id'), nullable=False)
    status = db.Column(db.Enum('draft', 'published', name='status_enum'), default='draft')
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    
    # İlişkiler
    images = db.relationship('BlogPostImage', backref='post', lazy=True)
    comments = db.relationship('BlogComment', backref='post', lazy=True)
