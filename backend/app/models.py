from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date # 'date' de import edildiğinden emin olun

# ---------------------------------------------
# SQLAlchemy örneği
# ---------------------------------------------
db = SQLAlchemy()

# ---------------------------------------------
# 1. Admin Modeli
# ---------------------------------------------
class Admin(db.Model):
    __tablename__ = 'admin'
    admin_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    phone_number = db.Column(db.String(20))
    profile_picture = db.Column(db.String(255)) # Bu alan URL tutmalı
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = db.Column(db.DateTime)

    def to_dict(self):
        return {
            'admin_id': self.admin_id,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone_number': self.phone_number,
            'profile_picture_url': self.profile_picture, # Frontend için tutarlı isim
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'deleted_at': self.deleted_at.isoformat() if self.deleted_at else None,
        }

# ---------------------------------------------
# 2. User Modeli
# ---------------------------------------------
class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    birth_date = db.Column(db.Date)
    gender = db.Column(db.Enum('Male','Female','Other'))
    weight = db.Column(db.Numeric(5,2))
    height = db.Column(db.Numeric(5,2))
    goal = db.Column(db.Enum('lose_weight','gain_weight','maintain_weight'))
    activity_level = db.Column(db.Enum(
        'sedentary','lightly_active','moderately_active','very_active','super_active'
    ))
    profile_picture = db.Column(db.String(255)) # Bu alan URL tutmalı
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # İlişkiler: “exercise_assignments” ve “diet_assignments” association object üzerinden gelecek
    progress_entries = db.relationship('ProgressTracking', backref='user', lazy=True)
    comments = db.relationship('BlogComment', backref='user', lazy=True)
    # UserDiet ve UserExercise için backref'ler zaten association objelerinde tanımlı.
    # user_diet_assignments ve user_exercise_assignments gibi erişebilirsiniz.

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            # 'password': self.password, # Şifreyi güvenlik nedeniyle JSON yanıtında GÖNDERMEYİN!
            'birth_date': self.birth_date.isoformat() if self.birth_date else None,
            'gender': self.gender,
            'weight': float(self.weight) if self.weight is not None else None, # Numeric tipi float'a çevir
            'height': float(self.height) if self.height is not None else None, # Numeric tipi float'a çevir
            'goal': self.goal,
            'activity_level': self.activity_level,
            'profile_picture_url': self.profile_picture, # Frontend için tutarlı isim
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

# ---------------------------------------------
# 3. ExercisePlan Modeli
# ---------------------------------------------
class ExercisePlan(db.Model):
    __tablename__ = 'exerciseplans'
    exercise_id = db.Column(db.Integer, primary_key=True)
    plan_name = db.Column(db.String(100))
    description = db.Column(db.Text)
    intensity = db.Column(db.Enum('beginner','intermediate','advanced'))
    photo = db.Column(db.String(255)) # Bu alan URL tutmalı
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'exercise_id': self.exercise_id,
            'plan_name': self.plan_name,
            'description': self.description,
            'intensity': self.intensity,
            'photo_url': self.photo, # Frontend için tutarlı isim
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

# ---------------------------------------------
# 4. DietPlan Modeli
# ---------------------------------------------
class DietPlan(db.Model):
    __tablename__ = 'dietplans'
    diet_id = db.Column(db.Integer, primary_key=True)
    plan_name = db.Column(db.String(100))
    description = db.Column(db.Text)
    calories = db.Column(db.Integer)
    goal = db.Column(db.Enum('lose_weight','gain_weight','maintain_weight'))
    photo = db.Column(db.String(255)) # Bu alan URL tutmalı
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'diet_id': self.diet_id,
            'plan_name': self.plan_name,
            'description': self.description,
            'calories': self.calories,
            'goal': self.goal,
            'photo_url': self.photo, # Frontend için tutarlı isim
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

# ---------------------------------------------
# 5. ProgressTracking Modeli
# ---------------------------------------------
class ProgressTracking(db.Model):
    __tablename__ = 'progresstracking'
    progress_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    weight = db.Column(db.Numeric(5,2))
    BFP = db.Column(db.Numeric(5,2))
    muscle_mass = db.Column(db.Numeric(5,2))
    notes = db.Column(db.Text)
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)
    progress_date = db.Column(db.Date) # Bu bir date objesi

    def to_dict(self):
        return {
            'progress_id': self.progress_id,
            'user_id': self.user_id,
            'weight': float(self.weight) if self.weight is not None else None,
            'BFP': float(self.BFP) if self.BFP is not None else None,
            'muscle_mass': float(self.muscle_mass) if self.muscle_mass is not None else None,
            'notes': self.notes,
            'recorded_at': self.recorded_at.isoformat() if self.recorded_at else None, # datetime objesini stringe çevir
            'progress_date': self.progress_date.isoformat() if self.progress_date else None, # date objesini stringe çevir
        }

# ---------------------------------------------
# 6. Contact Modeli
# ---------------------------------------------
class Contact(db.Model):
    __tablename__ = 'contacts'
    contact_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'contact_id': self.contact_id,
            'name': self.name,
            'email': self.email,
            'message': self.message,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

# ---------------------------------------------
# 7. BlogPost Modeli
# ---------------------------------------------
class BlogPost(db.Model):
    __tablename__ = 'blogposts'
    post_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    content = db.Column(db.Text)
    admin_id = db.Column(db.Integer, db.ForeignKey('admin.admin_id'))
    status = db.Column(db.Enum('draft','published'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    images = db.relationship('BlogPostImage', backref='post', lazy=True)
    comments = db.relationship('BlogComment', backref='post', lazy=True)

    def to_dict(self):
        return {
            'post_id': self.post_id,
            'title': self.title,
            'content': self.content,
            'admin_id': self.admin_id,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            # İlişkili verileri burada doğrudan döndürmek döngüsel referanslara veya aşırı yüke neden olabilir.
            # Genellikle ayrı API endpoint'leri üzerinden çekilirler.
            # Eğer istiyorsanız ve döngüsel referans yoksa, buraya ekleyebilirsiniz:
            # 'images': [img.to_dict() for img in self.images]
            # 'comments': [comment.to_dict() for comment in self.comments]
        }

# ---------------------------------------------
# 8. BlogPostImage Modeli
# ---------------------------------------------
class BlogPostImage(db.Model):
    __tablename__ = 'blogpostimages'
    image_id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('blogposts.post_id'))
    image_url = db.Column(db.String(255))
    alt_text = db.Column(db.String(255))
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'image_id': self.image_id,
            'post_id': self.post_id,
            'image_url': self.image_url,
            'alt_text': self.alt_text,
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None,
        }

# ---------------------------------------------
# 9. BlogComment Modeli
# ---------------------------------------------
class BlogComment(db.Model):
    __tablename__ = 'blogcomments'
    comment_id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('blogposts.post_id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'comment_id': self.comment_id,
            'post_id': self.post_id,
            'user_id': self.user_id,
            'comment': self.comment,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

# ---------------------------------------------
# 10. UserDiet Association Object (Many-to-Many)
# ---------------------------------------------
class UserDiet(db.Model):
    __tablename__ = 'userdiet'
    __table_args__ = {'extend_existing': True}
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), primary_key=True)
    diet_id = db.Column(db.Integer, db.ForeignKey('dietplans.diet_id'), primary_key=True)
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('diet_assignments', lazy='dynamic'))
    diet = db.relationship('DietPlan', backref=db.backref('user_assignments', lazy='dynamic'))

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'diet_id': self.diet_id,
            'assigned_at': self.assigned_at.isoformat() if self.assigned_at else None,
            # İlişkili user ve diet plan bilgilerini burada doğrudan döndürmek
            # performansı etkileyebilir veya döngüsel referansa yol açabilir.
            # Eğer istiyorsanız ve döngüsel referans yoksa, buraya ekleyebilirsiniz:
            # 'diet_plan_details': self.diet.to_dict() if self.diet else None
        }

# ---------------------------------------------
# 11. UserExercise Association Object (Many-to-Many)
# ---------------------------------------------
class UserExercise(db.Model):
    __tablename__ = 'userexercise'
    __table_args__ = {'extend_existing': True}
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), primary_key=True)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exerciseplans.exercise_id'), primary_key=True)
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('exercise_assignments', lazy='dynamic'))
    exercise = db.relationship('ExercisePlan', backref=db.backref('user_assignments', lazy='dynamic'))

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'exercise_id': self.exercise_id,
            'assigned_at': self.assigned_at.isoformat() if self.assigned_at else None,
            # İlişkili user ve exercise plan bilgilerini burada doğrudan döndürmek
            # performansı etkileyebilir veya döngüsel referansa yol açabilir.
            # Eğer istiyorsanız ve döngüsel referans yoksa, buraya ekleyebilirsiniz:
            # 'exercise_plan_details': self.exercise.to_dict() if self.exercise else None
        }