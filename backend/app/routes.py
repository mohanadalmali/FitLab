# backend/app/routes.py

from flask import Blueprint, request, jsonify
from flask_restful import Api, Resource
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity, verify_jwt_in_request # verify_jwt_in_request eklendi
from datetime import datetime

from app.models import (
    db,
    Admin, User,
    DietPlan, ExercisePlan, ProgressTracking,
    Contact, BlogPost, BlogPostImage, BlogComment,
    UserDiet, UserExercise
)

# Blueprint ve RESTful API
api_bp = Blueprint('api', __name__, url_prefix='/api')
api    = Api(api_bp)

# --- Admin Yetkilendirme Kontrolü Yardımcı Fonksiyonu ---
# Kırmızı: Yeni eklendi
def admin_required():
    def wrapper(fn):
        @jwt_required()
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            # Token'daki kimliğin bir admin ID'si olup olmadığını kontrol et
            admin = Admin.query.filter_by(admin_id=current_user_id).first()
            if not admin:
                return jsonify({"msg": "Admin yetkiniz yok!"}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

# ─── Health Check ───────────────────────────────────────────────────────────────
@api_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK'}), 200

# ─── Auth (Register & Login) ───────────────────────────────────────────────────
class RegisterResource(Resource):
    def post(self):
        data = request.get_json() or {}
        username = data.get('username')
        email    = data.get('email')
        password = data.get('password')
        if not (username and email and password):
            return {'message': 'username, email and password required'}, 400
        if User.query.filter((User.username == username) | (User.email == email)).first():
            return {'message': 'username or email already exists'}, 409

        new_user = User(
            username        = username,
            email           = email,
            password        = password,  # düz metin
            first_name      = data.get('first_name',''),
            last_name       = data.get('last_name',''),
            birth_date      = data.get('birth_date'),
            gender          = data.get('gender','Male'),
            weight          = data.get('weight'),
            height          = data.get('height'),
            goal            = data.get('goal','maintain_weight'),
            activity_level  = data.get('activity_level','sedentary'),
            profile_picture = data.get('profile_picture')
        )
        db.session.add(new_user)
        db.session.commit()

        token = create_access_token(identity=str(new_user.user_id))
        return {'access_token': token}, 201


class LoginResource(Resource):
    def post(self):
        data = request.get_json() or {}
        username = data.get('username')
        password = data.get('password')

        if not (username and password):
            return {'message': 'Kullanıcı adı ve şifre gerekli'}, 400

        user = User.query.filter_by(username=username).first()
        admin = Admin.query.filter_by(username=username).first()

        if user and user.password == password: # Düz metin parola karşılaştırması
            access_token = create_access_token(
                identity=str(user.user_id),
                additional_claims={"roles": ["user"]}
            )
            return {
                'access_token': access_token,
                'user_id': user.user_id,
                'user_role': 'user'
            }, 200
        elif admin and admin.password == password: # Düz metin parola karşılaştırması
            access_token = create_access_token(
                identity=str(admin.admin_id),
                additional_claims={"roles": ["admin"]}
            )
            # Kırmızı: Admin bilgilerini yanıta ekle
            return {
                'access_token': access_token,
                'user_id': admin.admin_id,
                'user_role': 'admin',
                'admin_username': admin.username, # Yeni
                'admin_first_name': admin.first_name, # Yeni
                'admin_last_name': admin.last_name, # Yeni
                'admin_profile_picture': admin.profile_picture # Yeni
            }, 200
        else:
            return {'message': 'Geçersiz kullanıcı adı veya şifre'}, 401

# ─── Admin CRUD ────────────────────────────────────────────────────────────────
class AdminListResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self):
        admins = Admin.query.filter(Admin.deleted_at.is_(None)).all()
        return jsonify([{
            'admin_id':        a.admin_id,
            'username':        a.username,
            'first_name':      a.first_name,
            'last_name':       a.last_name,
            'phone_number':    a.phone_number,
            'profile_picture': a.profile_picture,
            'created_at':      a.created_at.isoformat(),
            'updated_at':      a.updated_at.isoformat()
        } for a in admins])

    # Kırmızı: admin_required dekoratörü eklendi (Yeni admin oluşturma da admin yetkisi gerektirmeli)
    @admin_required()
    def post(self):
        data = request.get_json() or {}
        if not data.get('username') or not data.get('password'):
            return {'message': 'username and password required'}, 400
        # Kırmızı: Admin adının veya şifresinin zaten var olup olmadığını kontrol et
        if Admin.query.filter_by(username=data['username']).first():
            return {'message': 'Admin username already exists'}, 409

        admin = Admin(
            username        = data['username'],
            password        = data['password'],
            first_name      = data.get('first_name'),
            last_name       = data.get('last_name'),
            phone_number    = data.get('phone_number'),
            profile_picture = data.get('profile_picture')
        )
        db.session.add(admin)
        db.session.commit()
        return {'admin_id': admin.admin_id}, 201


class AdminResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self, admin_id):
        a = Admin.query.get_or_404(admin_id)
        return jsonify({
            'admin_id':        a.admin_id,
            'username':        a.username,
            'first_name':      a.first_name,
            'last_name':       a.last_name,
            'phone_number':    a.phone_number,
            'profile_picture': a.profile_picture,
            'created_at':      a.created_at.isoformat(),
            'updated_at':      a.updated_at.isoformat()
        })

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def put(self, admin_id):
        a = Admin.query.get_or_404(admin_id)
        data = request.get_json() or {}
        a.username        = data.get('username', a.username)
        a.password        = data.get('password', a.password)
        a.first_name      = data.get('first_name', a.first_name)
        a.last_name       = data.get('last_name', a.last_name)
        a.phone_number    = data.get('phone_number', a.phone_number)
        a.profile_picture = data.get('profile_picture', a.profile_picture)
        a.updated_at      = datetime.utcnow()
        db.session.commit()
        return {'message': 'Admin updated'}, 200

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def delete(self, admin_id):
        a = Admin.query.get_or_404(admin_id)
        a.deleted_at = datetime.utcnow()
        db.session.commit()
        return {'message': 'Admin deleted'}, 200


# ─── User CRUD ─────────────────────────────────────────────────────────────────
class UserListResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self):
        users = User.query.all()
        return jsonify([{
            'user_id':         u.user_id,
            'username':        u.username,
            'first_name':      u.first_name,
            'last_name':       u.last_name,
            'email':           u.email,
            'birth_date':      u.birth_date.isoformat() if u.birth_date else None,
            'gender':          u.gender,
            'weight':          float(u.weight) if u.weight is not None else None,
            'height':          float(u.height) if u.height is not None else None,
            'goal':            u.goal,
            'activity_level':  u.activity_level,
            'profile_picture': u.profile_picture,
            'created_at':      u.created_at.isoformat(),
            'updated_at':      u.updated_at.isoformat() if u.updated_at else None
        } for u in users])

    # Kırmızı: admin_required dekoratörü eklendi (Kullanıcı oluşturma admin yetkisi gerektirmeli)
    @admin_required()
    def post(self):
        data = request.get_json() or {}
        if not data.get('username') or not data.get('password'):
            return {'message': 'username and password required'}, 400
        # Kırmızı: Kullanıcı adının veya e-postanın zaten var olup olmadığını kontrol et
        if User.query.filter((User.username == data['username']) | (User.email == data.get('email'))).first():
            return {'message': 'Username or email already exists'}, 409

        user = User(
            username        = data['username'],
            password        = data['password'],
            first_name      = data.get('first_name'),
            last_name       = data.get('last_name'),
            email           = data.get('email'),
            birth_date      = data.get('birth_date'),
            gender          = data.get('gender'),
            weight          = data.get('weight'),
            height          = data.get('height'),
            goal            = data.get('goal'),
            activity_level  = data.get('activity_level'),
            profile_picture = data.get('profile_picture')
        )
        db.session.add(user)
        db.session.commit()
        return {'user_id': user.user_id}, 201


class UserResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self, user_id):
        u = User.query.get_or_404(user_id)
        return jsonify({
            'user_id':         u.user_id,
            'username':        u.username,
            'first_name':      u.first_name,
            'last_name':       u.last_name,
            'email':           u.email,
            'birth_date':      u.birth_date.isoformat() if u.birth_date else None,
            'gender':          u.gender,
            'weight':          float(u.weight) if u.weight is not None else None,
            'height':          float(u.height) if u.height is not None else None,
            'goal':            u.goal,
            'activity_level':  u.activity_level,
            'profile_picture': u.profile_picture,
            'created_at':      u.created_at.isoformat(),
            'updated_at':      u.updated_at.isoformat() if u.updated_at else None
        })

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def put(self, user_id):
        u = User.query.get_or_404(user_id)
        data = request.get_json() or {}
        u.username        = data.get('username', u.username)
        u.password        = data.get('password', u.password)
        u.first_name      = data.get('first_name', u.first_name)
        u.last_name       = data.get('last_name', u.last_name)
        u.email           = data.get('email', u.email)
        u.birth_date      = data.get('birth_date', u.birth_date)
        u.gender          = data.get('gender', u.gender)
        u.weight          = data.get('weight', u.weight)
        u.height          = data.get('height', u.height)
        u.goal            = data.get('goal', u.goal)
        u.activity_level  = data.get('activity_level', u.activity_level)
        u.profile_picture = data.get('profile_picture', u.profile_picture)
        u.updated_at      = datetime.utcnow()
        db.session.commit()
        return {'message': 'User updated'}, 200

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def delete(self, user_id):
        u = User.query.get_or_404(user_id)
        db.session.delete(u)
        db.session.commit()
        return {'message': 'User deleted'}, 200


# ─── DietPlan CRUD ─────────────────────────────────────────────────────────────
class PublicDietListResource(Resource):
    def get(self):
        diets = DietPlan.query.all()
        return jsonify([{
            'diet_id':      d.diet_id,
            'plan_name':    d.plan_name,
            'description':  d.description,
            'calories':     d.calories,
            'goal':         d.goal,
            'photo':        d.photo,
            'created_at':   d.created_at.isoformat() if d.created_at else None,
            'updated_at':   d.updated_at.isoformat() if d.updated_at else None
        } for d in diets])


class DietListResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self):
        diets = DietPlan.query.all()
        return jsonify([{
            'diet_id':      d.diet_id,
            'plan_name':    d.plan_name,
            'description':  d.description,
            'calories':     d.calories,
            'goal':         d.goal,
            'photo':        d.photo,
            'created_at':   d.created_at.isoformat(),
            'updated_at':   d.updated_at.isoformat() if d.updated_at else None
        } for d in diets])

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def post(self):
        data = request.get_json() or {}
        d = DietPlan(
            plan_name   = data.get('plan_name'),
            description = data.get('description'),
            calories    = data.get('calories'),
            goal        = data.get('goal'),
            photo       = data.get('photo')
        )
        db.session.add(d)
        db.session.commit()
        return {'diet_id': d.diet_id}, 201


class DietResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self, diet_id):
        d = DietPlan.query.get_or_404(diet_id)
        return jsonify({
            'diet_id':      d.diet_id,
            'plan_name':    d.plan_name,
            'description':  d.description,
            'calories':     d.calories,
            'goal':         d.goal,
            'photo':        d.photo,
            'created_at':   d.created_at.isoformat(),
            'updated_at':   d.updated_at.isoformat() if d.updated_at else None
        })

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def put(self, diet_id):
        d = DietPlan.query.get_or_404(diet_id)
        data = request.get_json() or {}
        d.plan_name    = data.get('plan_name', d.plan_name)
        d.description  = data.get('description', d.description)
        d.calories     = data.get('calories', d.calories)
        d.goal         = data.get('goal', d.goal)
        d.photo        = data.get('photo', d.photo)
        db.session.commit()
        return {'message': 'DietPlan updated'}, 200

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def delete(self, diet_id):
        d = DietPlan.query.get_or_404(diet_id)
        db.session.delete(d)
        db.session.commit()
        return {'message': 'DietPlan deleted'}, 200


# ─── ExercisePlan CRUD ─────────────────────────────────────────────────────────
class PublicExerciseListResource(Resource):
    def get(self):
        exs = ExercisePlan.query.all()
        return jsonify([{
            'exercise_id': e.exercise_id,
            'plan_name':   e.plan_name,
            'description': e.description,
            'intensity':   e.intensity,
            'photo':       e.photo,
            'created_at':  e.created_at.isoformat(),
            'updated_at':  e.updated_at.isoformat() if e.updated_at else None
        } for e in exs])


class ExerciseListResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self):
        exs = ExercisePlan.query.all()
        return jsonify([{
            'exercise_id': e.exercise_id,
            'plan_name':   e.plan_name,
            'description': e.description,
            'intensity':   e.intensity,
            'photo':       e.photo,
            'created_at':  e.created_at.isoformat(),
            'updated_at':  e.updated_at.isoformat() if e.updated_at else None
        } for e in exs])

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def post(self):
        data = request.get_json() or {}
        e = ExercisePlan(
            plan_name   = data.get('plan_name'),
            description = data.get('description'),
            intensity   = data.get('intensity'),
            photo       = data.get('photo')
        )
        db.session.add(e)
        db.session.commit()
        return {'exercise_id': e.exercise_id}, 201


class ExerciseResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self, exercise_id):
        e = ExercisePlan.query.get_or_404(exercise_id)
        return jsonify({
            'exercise_id': e.exercise_id,
            'plan_name':   e.plan_name,
            'description': e.description,
            'intensity':   e.intensity,
            'photo':       e.photo,
            'created_at':  e.created_at.isoformat(),
            'updated_at':  e.updated_at.isoformat() if e.updated_at else None
        })

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def put(self, exercise_id):
        e = ExercisePlan.query.get_or_404(exercise_id)
        data = request.get_json() or {}
        e.plan_name    = data.get('plan_name', e.plan_name)
        e.description  = data.get('description', e.description)
        e.intensity    = data.get('intensity', e.intensity)
        e.photo        = data.get('photo', e.photo)
        db.session.commit()
        return {'message': 'ExercisePlan updated'}, 200

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def delete(self, exercise_id):
        e = ExercisePlan.query.get_or_404(exercise_id)
        db.session.delete(e)
        db.session.commit()
        return {'message': 'ExercisePlan deleted'}, 200


# ─── ProgressTracking CRUD ──────────────────────────────────────────────────────
class ProgressListResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self):
        ps = ProgressTracking.query.all()
        return jsonify([{
            'progress_id':   p.progress_id,
            'user_id':       p.user_id,
            'weight':        str(p.weight),
            'BFP':           str(p.BFP),
            'muscle_mass':   str(p.muscle_mass),
            'notes':         p.notes,
            'recorded_at':   p.recorded_at.isoformat(),
            'progress_date': p.progress_date.isoformat() if p.progress_date else None
        } for p in ps])

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def post(self):
        data = request.get_json() or {}
        p = ProgressTracking(
            user_id      = data.get('user_id'),
            weight       = data.get('weight'),
            BFP          = data.get('BFP'),
            muscle_mass  = data.get('muscle_mass'),
            notes        = data.get('notes'),
            progress_date= data.get('progress_date')
        )
        db.session.add(p)
        db.session.commit()
        return {'progress_id': p.progress_id}, 201


class ProgressResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self, progress_id):
        p = ProgressTracking.query.get_or_404(progress_id)
        return jsonify({
            'progress_id':   p.progress_id,
            'user_id':       p.user_id,
            'weight':        str(p.weight),
            'BFP':           str(p.BFP),
            'muscle_mass':   str(p.muscle_mass),
            'notes':         p.notes,
            'recorded_at':   p.recorded_at.isoformat(),
            'progress_date': p.progress_date.isoformat() if p.progress_date else None
        })

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def put(self, progress_id):
        p = ProgressTracking.query.get_or_404(progress_id)
        data = request.get_json() or {}
        p.weight        = data.get('weight', p.weight)
        p.BFP           = data.get('BFP', p.BFP)
        p.muscle_mass   = data.get('muscle_mass', p.muscle_mass)
        p.notes         = data.get('notes', p.notes)
        p.progress_date = data.get('progress_date', p.progress_date)
        db.session.commit()
        return {'message': 'ProgressTracking updated'}, 200

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def delete(self, progress_id):
        p = ProgressTracking.query.get_or_404(progress_id)
        db.session.delete(p)
        db.session.commit()
        return {'message': 'ProgressTracking deleted'}, 200


# ─── Contact CRUD ───────────────────────────────────────────────────────────────
class ContactListResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self):
        cs = Contact.query.all()
        return jsonify([{
            'contact_id': c.contact_id,
            'name':       c.name,
            'email':      c.email,
            'message':    c.message
        } for c in cs])

    # Kırmızı: Adminlerin de contact oluşturabileceği senaryo için (eğer gerekliyse)
    # Eğer sadece kullanıcıların contact oluşturmasını istiyorsanız bu dekoratörü eklemeyin.
    # @admin_required()
    def post(self):
        data = request.get_json() or {}
        c = Contact(
            name    = data.get('name'),
            email   = data.get('email'),
            message = data.get('message')
        )
        db.session.add(c)
        db.session.commit()
        return {'contact_id': c.contact_id}, 201


class ContactResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self, contact_id):
        c = Contact.query.get_or_404(contact_id)
        return jsonify({
            'contact_id': c.contact_id,
            'name':       c.name,
            'email':      c.email,
            'message':    c.message
        })

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def put(self, contact_id):
        c = Contact.query.get_or_404(contact_id)
        data = request.get_json() or {}
        c.name    = data.get('name', c.name)
        c.email   = data.get('email', c.email)
        c.message = data.get('message', c.message)
        db.session.commit()
        return {'message': 'Contact updated'}, 200

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def delete(self, contact_id):
        c = Contact.query.get_or_404(contact_id)
        db.session.delete(c)
        db.session.commit()
        return {'message': 'Contact deleted'}, 200


# ─── BlogPost CRUD ──────────────────────────────────────────────────────────────
class BlogPostListResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self):
        posts = BlogPost.query.all()
        return jsonify([{
            'post_id':    p.post_id,
            'title':      p.title,
            'status':     p.status,
            'created_at': p.created_at.isoformat()
        } for p in posts])

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def post(self):
        data = request.get_json() or {}
        # Kırmızı: admin_id'yi token'dan al
        admin_id = get_jwt_identity()
        if not Admin.query.filter_by(admin_id=admin_id).first():
             return {'message': 'Invalid Admin ID from token'}, 403 # Ek güvenlik kontrolü

        p = BlogPost(
            title    = data.get('title'),
            content  = data.get('content'),
            admin_id = admin_id, # Kırmızı: token'dan gelen admin_id kullanıldı
            status   = data.get('status')
        )
        db.session.add(p)
        db.session.commit()
        return {'post_id': p.post_id}, 201


class BlogPostResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self, post_id):
        p = BlogPost.query.get_or_404(post_id)
        return jsonify({
            'post_id': p.post_id,
            'title':   p.title,
            'content': p.content,
            'status':  p.status,
            # Kırmızı: Admin paneli için admin_id'yi de döndür
            'admin_id': p.admin_id
        })

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def put(self, post_id):
        p = BlogPost.query.get_or_404(post_id)
        data = request.get_json() or {}
        p.title   = data.get('title', p.title)
        p.content = data.get('content', p.content)
        p.status  = data.get('status', p.status)
        db.session.commit()
        return {'message': 'BlogPost updated'}, 200

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def delete(self, post_id):
        p = BlogPost.query.get_or_404(post_id)
        db.session.delete(p)
        db.session.commit()
        return {'message': 'BlogPost deleted'}, 200


# ─── BlogPostImage CRUD ─────────────────────────────────────────────────────────
class BlogPostImageListResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self):
        imgs = BlogPostImage.query.all()
        return jsonify([{
            'image_id':    i.image_id,
            'post_id':     i.post_id,
            'image_url':   i.image_url,
            'alt_text':    i.alt_text,
            'uploaded_at': i.uploaded_at.isoformat() if i.uploaded_at else None
        } for i in imgs])

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def post(self):
        data = request.get_json() or {}
        i = BlogPostImage(
            post_id     = data.get('post_id'),
            image_url   = data.get('image_url'),
            alt_text    = data.get('alt_text'),
            uploaded_at = datetime.utcnow()
        )
        db.session.add(i)
        db.session.commit()
        return {'image_id': i.image_id}, 201


class BlogPostImageResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self, image_id):
        i = BlogPostImage.query.get_or_404(image_id)
        return jsonify({
            'image_id':    i.image_id,
            'post_id':     i.post_id,
            'image_url':   i.image_url,
            'alt_text':    i.alt_text,
            'uploaded_at': i.uploaded_at.isoformat() if i.uploaded_at else None
        })

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def put(self, image_id):
        i = BlogPostImage.query.get_or_404(image_id)
        data = request.get_json() or {}
        i.post_id     = data.get('post_id', i.post_id)
        i.image_url   = data.get('image_url', i.image_url)
        i.alt_text    = data.get('alt_text', i.alt_text)
        i.uploaded_at = datetime.utcnow()
        db.session.commit()
        return {'message': 'BlogPostImage updated'}, 200

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def delete(self, image_id):
        i = BlogPostImage.query.get_or_404(image_id)
        db.session.delete(i)
        db.session.commit()
        return {'message': 'BlogPostImage deleted'}, 200


# ─── BlogComment CRUD ──────────────────────────────────────────────────────────
class BlogCommentListResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self):
        cms = BlogComment.query.all()
        return jsonify([{
            'comment_id': c.comment_id,
            'post_id':    c.post_id,
            'user_id':    c.user_id,
            'comment':    c.comment,
            'created_at': c.created_at.isoformat() if c.created_at else None,
            'updated_at': c.updated_at.isoformat() if c.updated_at else None
        } for c in cms])

    # Kırmızı: Adminlerin de yorum yapabileceği senaryo için (eğer gerekliyse)
    # Eğer sadece kullanıcıların yorum yapmasını istiyorsanız bu dekoratörü eklemeyin.
    # @admin_required()
    def post(self):
        data = request.get_json() or {}
        c = BlogComment(
            post_id     = data.get('post_id'),
            user_id     = data.get('user_id'),
            comment     = data.get('comment'),
            created_at  = datetime.utcnow()
        )
        db.session.add(c)
        db.session.commit()
        return {'comment_id': c.comment_id}, 201


class BlogCommentResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self, comment_id):
        c = BlogComment.query.get_or_404(comment_id)
        return jsonify({
            'comment_id': c.comment_id,
            'post_id':    c.post_id,
            'user_id':    c.user_id,
            'comment':    c.comment,
            'created_at': c.created_at.isoformat() if c.created_at else None,
            'updated_at': c.updated_at.isoformat() if c.updated_at else None
        })

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def put(self, comment_id):
        c = BlogComment.query.get_or_404(comment_id)
        data = request.get_json() or {}
        c.post_id    = data.get('post_id', c.post_id)
        c.user_id    = data.get('user_id', c.user_id)
        c.comment    = data.get('comment', c.comment)
        c.updated_at = datetime.utcnow()
        db.session.commit()
        return {'message': 'BlogComment updated'}, 200

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def delete(self, comment_id):
        c = BlogComment.query.get_or_404(comment_id)
        db.session.delete(c)
        db.session.commit()
        return {'message': 'BlogComment deleted'}, 200


# ─── Public BlogPost & Image & Comment Endpoints ───────────────────────────────
# Bu endpoint'ler zaten public olduğu için değişiklik yapılmadı.
class PublicBlogPostListResource(Resource):
    def get(self):
        posts = BlogPost.query.filter_by(status='published').all()
        return jsonify([{
            'post_id':    p.post_id,
            'title':      p.title,
            'content':    p.content,
            'admin_id':   p.admin_id,
            'status':     p.status,
            'created_at': p.created_at.isoformat(),
            'updated_at': p.updated_at.isoformat() if p.updated_at else None
        } for p in posts])


class PublicBlogPostResource(Resource):
    def get(self, post_id):
        p = BlogPost.query.filter_by(post_id=post_id, status='published').first_or_404()
        return jsonify({
            'post_id':    p.post_id,
            'title':      p.title,
            'content':    p.content,
            'admin_id':   p.admin_id,
            'status':     p.status,
            'created_at': p.created_at.isoformat(),
            'updated_at': p.updated_at.isoformat() if p.updated_at else None
        })


class PublicBlogPostImageListResource(Resource):
    def get(self):
        imgs = BlogPostImage.query.all()
        return jsonify([{
            'image_id':    i.image_id,
            'post_id':     i.post_id,
            'image_url':   i.image_url,
            'alt_text':    i.alt_text,
            'uploaded_at': i.uploaded_at.isoformat() if i.uploaded_at else None
        } for i in imgs])


class PublicBlogPostImageResource(Resource):
    def get(self, image_id):
        i = BlogPostImage.query.get_or_404(image_id)
        return jsonify({
            'image_id':    i.image_id,
            'post_id':     i.post_id,
            'image_url':   i.image_url,
            'alt_text':    i.alt_text,
            'uploaded_at': i.uploaded_at.isoformat() if i.uploaded_at else None
        })


class PublicBlogCommentListResource(Resource):
    def get(self):
        cms = BlogComment.query.all()
        return jsonify([{
            'comment_id': c.comment_id,
            'post_id':    c.post_id,
            'user_id':    c.user_id,
            'comment':    c.comment,
            'created_at': c.created_at.isoformat() if c.created_at else None,
            'updated_at': c.updated_at.isoformat() if c.updated_at else None
        } for c in cms])


class PublicBlogCommentResource(Resource):
    def get(self, comment_id):
        c = BlogComment.query.get_or_404(comment_id)
        return jsonify({
            'comment_id': c.comment_id,
            'post_id':    c.post_id,
            'user_id':    c.user_id,
            'comment':    c.comment,
            'created_at': c.created_at.isoformat() if c.created_at else None,
            'updated_at': c.updated_at.isoformat() if c.updated_at else None
        })


# ─── Admin → Kullanıcı Diyet, Egzersiz & Progress Atamaları ───────────────────
class AdminUserDietListResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self, user_id):
        assigns = UserDiet.query.filter_by(user_id=user_id).all()
        return jsonify([{
            'diet_id':       a.diet_id,
            'plan_name':     a.diet.plan_name,
            'assigned_at':   a.assigned_at.isoformat()
        } for a in assigns])

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def post(self, user_id):
        diet_id = request.json.get('diet_id')
        # Kırmızı: Kullanıcı ve diyetin varlığını kontrol et
        user_exists = User.query.get(user_id)
        diet_exists = DietPlan.query.get(diet_id)
        if not user_exists or not diet_exists:
            return {'message': 'User or DietPlan not found'}, 404
        if UserDiet.query.filter_by(user_id=user_id, diet_id=diet_id).first():
            return {'message': 'Diet already assigned to this user'}, 409

        a = UserDiet(user_id=user_id, diet_id=diet_id)
        db.session.add(a)
        db.session.commit()
        return {'diet_id': diet_id, 'user_id': user_id}, 201


class AdminUserDietResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def delete(self, user_id, diet_id):
        a = UserDiet.query.get_or_404((user_id, diet_id))
        db.session.delete(a)
        db.session.commit()
        return {'message': 'Diyet ataması silindi'}, 200


class AdminUserExerciseListResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self, user_id):
        assigns = UserExercise.query.filter_by(user_id=user_id).all()
        return jsonify([{
            'exercise_id': e.exercise_id,
            'plan_name':   e.exercise.plan_name,
            'assigned_at': e.assigned_at.isoformat()
        } for e in assigns])

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def post(self, user_id):
        ex_id = request.json.get('exercise_id')
        # Kırmızı: Kullanıcı ve egzersizin varlığını kontrol et
        user_exists = User.query.get(user_id)
        exercise_exists = ExercisePlan.query.get(ex_id)
        if not user_exists or not exercise_exists:
            return {'message': 'User or ExercisePlan not found'}, 404
        if UserExercise.query.filter_by(user_id=user_id, exercise_id=ex_id).first():
            return {'message': 'Exercise already assigned to this user'}, 409

        e = UserExercise(user_id=user_id, exercise_id=ex_id)
        db.session.add(e)
        db.session.commit()
        return {'exercise_id': ex_id, 'user_id': user_id}, 201


class AdminUserExerciseResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def delete(self, user_id, exercise_id):
        e = UserExercise.query.get_or_404((user_id, exercise_id))
        db.session.delete(e)
        db.session.commit()
        return {'message': 'Egzersiz ataması silindi'}, 200


class AdminUserProgressListResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def get(self, user_id):
        logs = ProgressTracking.query.filter_by(user_id=user_id).all()
        return jsonify([{
            'progress_id':   p.progress_id,
            'weight':        float(p.weight),
            'BFP':           float(p.BFP),
            'muscle_mass':   float(p.muscle_mass),
            'notes':         p.notes,
            'progress_date': p.progress_date.isoformat()
        } for p in logs])

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def post(self, user_id):
        data = request.get_json() or {}
        # Kırmızı: Kullanıcının varlığını kontrol et
        user_exists = User.query.get(user_id)
        if not user_exists:
            return {'message': 'User not found'}, 404

        p = ProgressTracking(
            user_id      = user_id,
            weight       = data.get('weight'),
            BFP          = data.get('BFP'),
            muscle_mass  = data.get('muscle_mass'),
            notes        = data.get('notes'),
            progress_date= data.get('progress_date')
        )
        db.session.add(p)
        db.session.commit()
        return {'progress_id': p.progress_id}, 201


class AdminUserProgressResource(Resource):
    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def put(self, user_id, progress_id):
        p = ProgressTracking.query.filter_by(user_id=user_id, progress_id=progress_id).first_or_404()
        data = request.get_json() or {}
        p.weight        = data.get('weight', p.weight)
        p.BFP           = data.get('BFP', p.BFP)
        p.muscle_mass   = data.get('muscle_mass', p.muscle_mass)
        p.notes         = data.get('notes', p.notes)
        p.progress_date = data.get('progress_date', p.progress_date)
        db.session.commit()
        return {'message': 'Progres güncellendi'}, 200

    # Kırmızı: admin_required dekoratörü eklendi
    @admin_required()
    def delete(self, user_id, progress_id):
        p = ProgressTracking.query.filter_by(user_id=user_id, progress_id=progress_id).first_or_404()
        db.session.delete(p)
        db.session.commit()
        return {'message': 'Progres kaydı silindi'}, 200

# --- Sohbet Botu Kaynağı ---
class ChatbotResource(Resource):
    def post(self):
        data = request.get_json()
        user_message = data.get('message', '').lower().strip() # Gelen mesajı küçük harfe çevir ve boşlukları temizle

        bot_response = "Üzgünüm, bu soruyu anlayamadım. Diyet, egzersiz, ilerleme veya BMI hakkında bilgi almak ister misiniz? Ya da genel bir sorunuz varsa, daha spesifik olmaya çalışın lütfen."

        # Soru-Cevap Mantığı (Burayı ihtiyacınıza göre genişletebilirsiniz)
        if "merhaba" in user_message or "selam" in user_message:
            bot_response = "Merhaba! Ben Fitness Botunuz. Size nasıl yardımcı olabilirim? Diyet, egzersiz, ilerleme takibi veya BMI hesaplama gibi konularda sorularınız varsa bana sorabilirsiniz."
        
        # Diyet ile ilgili sorular
        elif "diyet planı nedir" in user_message or "diyet planları ne işe yarar" in user_message:
            bot_response = "Diyet planları, kişisel hedeflerinize (kilo verme, kas kazanma vb.) ulaşmanız için özel olarak hazırlanmış beslenme programlarıdır. Uygulamamızda farklı ihtiyaçlara uygun çeşitli diyet planları bulabilirsiniz."
        elif "nasıl diyet seçerim" in user_message or "diyet planı seçme" in user_message:
            bot_response = "Diyet planı seçerken hedeflerinizi (kilo verme, kas kütlesi artırma), beslenme tercihlerinizi (vegan, glutensiz vb.) ve aktivite seviyenizi göz önünde bulundurmalısınız. Profilinizdeki hedefler kısmını güncelleyerek size en uygun planları görebilirsiniz."
        elif "kalori hesaplama" in user_message or "kaç kalori almalıyım" in user_message:
            bot_response = "Günlük kalori ihtiyacınız yaşınıza, cinsiyetinize, kilonuza, boyunuza ve aktivite seviyenize göre değişir. Uygulamamızda temel bir kalori hesaplayıcı bulunmaktadır, profil bilgilerinizi güncelleyerek daha kişiselleştirilmiş bir tahmine ulaşabilirsiniz."
            
        # Egzersiz ile ilgili sorular
        elif "egzersiz planı nedir" in user_message or "egzersiz planları ne işe yarar" in user_message:
            bot_response = "Egzersiz planları, belirli fitness hedeflerine ulaşmak için tasarlanmış yapılandırılmış antrenman rutinleridir. Uygulamamızda kuvvet antrenmanı, kardiyo veya esneklik gibi farklı türlerde egzersiz planları bulabilirsiniz."
        elif "nasıl egzersiz yapmalıyım" in user_message or "hangi egzersizi yapmalıyım" in user_message:
            bot_response = "Hangi egzersizi yapacağınız fitness seviyenize, mevcut ekipmanlarınıza ve hedeflerinize (kilo verme, kas yapma, dayanıklılık) bağlıdır. Egzersiz Planları bölümümüzdeki filtreleri kullanarak size en uygun antrenmanları keşfedebilirsiniz."
        elif "evde egzersiz" in user_message or "evde spor" in user_message:
            bot_response = "Evde yapabileceğiniz birçok etkili egzersiz bulunmaktadır. Vücut ağırlığı egzersizleri (şınav, squat, plank) veya direnç bantları gibi minimal ekipmanlarla antrenman yapabilirsiniz. Uygulamamızda evde yapılabilecek egzersiz planları da mevcuttur."
            
        # İlerleme takibi ile ilgili sorular
        elif "ilerlememi nasıl takip ederim" in user_message or "progress takibi" in user_message:
            bot_response = "İlerlemenizi takip etmek için 'İlerleme Takibi' bölümüne gidebilirsiniz. Buraya kilonuzu, vücut yağ oranınızı ve kas kütlenizi düzenli olarak kaydederek zaman içindeki değişiminizi grafiklerle görebilirsiniz."
        elif "ne sıklıkta ilerleme kaydetmeliyim" in user_message or "ilerleme ne zaman kaydedilir" in user_message:
            bot_response = "Genellikle haftalık veya iki haftada bir ilerleme kaydetmek iyi bir fikir olabilir. Bu size düzenli bir bakış açısı sunar ve motivasyonunuzu korumanıza yardımcı olur."
            
        # BMI ile ilgili sorular
        elif "bmi nedir" in user_message or "bmi ne anlama gelir" in user_message or "vücut kitle indeksi nedir" in user_message:
            bot_response = "BMI (Vücut Kitle İndeksi), boy ve kilonuzu kullanarak vücut yağ oranınızı gösteren bir ölçüttür. Genel bir sağlık göstergesi olarak kullanılır. Uygulamamızda BMI'ınızı hesaplayabilirsiniz."
        elif "nasıl bmi hesaplarım" in user_message or "bmi hesapla" in user_message:
            bot_response = "BMI'ınızı hesaplamak için kilonuzu (kg) boyunuzun (metre) karesine bölmelisiniz. Örneğin: BMI = Kilo (kg) / (Boy (m) * Boy (m)). Profilinizdeki bilgilerle otomatik olarak hesaplanmaktadır."

        # Genel yanıtlar
        elif "teşekkürler" in user_message or "sağol" in user_message:
            bot_response = "Rica ederim, başka bir konuda yardımcı olabilir miyim?"
        elif "yardım" in user_message or "yardımcı olabilir misin" in user_message:
            bot_response = "Elbette, size nasıl yardımcı olabilirim? Diyet, egzersiz, ilerleme veya BMI konularında sorularınızı bekliyorum."
            
        return {'response': bot_response}, 200

class ProfileResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        # Kırmızı: Admin veya User olup olmadığını kontrol et
        u = User.query.get(user_id)
        if u:
            return jsonify({
                'user_id':         u.user_id,
                'username':        u.username,
                'first_name':      u.first_name,
                'last_name':       u.last_name,
                'email':           u.email,
                'birth_date':      u.birth_date.isoformat() if u.birth_date else None,
                'gender':          u.gender,
                'weight':          float(u.weight) if u.weight is not None else None,
                'height':          float(u.height) if u.height is not None else None,
                'goal':            u.goal,
                'activity_level':  u.activity_level,
                'profile_picture': u.profile_picture,
                'created_at':      u.created_at.isoformat(),
                'updated_at':      u.updated_at.isoformat() if u.updated_at else None,
                'role': 'user' # Kırmızı: Rol bilgisi eklendi
            })
        admin = Admin.query.get(user_id)
        if admin:
             return jsonify({
                'admin_id':        admin.admin_id,
                'username':        admin.username,
                'first_name':      admin.first_name,
                'last_name':       admin.last_name,
                'phone_number':    admin.phone_number,
                'profile_picture': admin.profile_picture,
                'created_at':      admin.created_at.isoformat(),
                'updated_at':      admin.updated_at.isoformat(),
                'role': 'admin' # Kırmızı: Rol bilgisi eklendi
            })
        return {'message': 'User or Admin not found'}, 404 # Token geçerli ama kullanıcı/admin bulunamadı

    @jwt_required()
    def put(self):
        user_id = get_jwt_identity()
        # Kırmızı: Admin veya User olup olmadığını kontrol et
        u = User.query.get(user_id)
        data = request.get_json()
        if u:
            u.first_name      = data.get('first_name', u.first_name)
            u.last_name       = data.get('last_name', u.last_name)
            u.email           = data.get('email', u.email)
            u.birth_date      = data.get('birth_date', u.birth_date)
            u.gender          = data.get('gender', u.gender)
            u.weight          = data.get('weight', u.weight)
            u.height          = data.get('height', u.height)
            u.goal            = data.get('goal', u.goal)
            u.activity_level  = data.get('activity_level', u.activity_level)
            u.profile_picture = data.get('profile_picture', u.profile_picture)
            u.updated_at      = datetime.utcnow()
            db.session.commit()
            return {'message': 'Profil güncellendi', 'role': 'user'}, 200
        admin = Admin.query.get(user_id)
        if admin:
            admin.first_name      = data.get('first_name', admin.first_name)
            admin.last_name       = data.get('last_name', admin.last_name)
            admin.phone_number    = data.get('phone_number', admin.phone_number)
            admin.profile_picture = data.get('profile_picture', admin.profile_picture)
            admin.updated_at      = datetime.utcnow()
            db.session.commit()
            return {'message': 'Admin profili güncellendi', 'role': 'admin'}, 200
        return {'message': 'User or Admin not found'}, 404


# ─── Route Kayıtları ────────────────────────────────────────────────────────────
api.add_resource(ProfileResource,                   '/profile')
api.add_resource(RegisterResource,                   '/auth/register')
api.add_resource(LoginResource,                      '/auth/login')
api.add_resource(ChatbotResource, '/chatbot')
# Kırmızı: Admin endpoint'leri prefix'i `/admin/data` olanlar zaten var.
# Bu endpoint'lerin korunması için yukarıdaki `@admin_required()` dekoratörleri yeterli.
# Ancak, eğer admin girişini tamamen ayrı bir endpoint'e almak isterseniz,
# mesela '/auth/admin-login' gibi, o zaman yeni bir resource oluşturmanız gerekirdi.
# Mevcut LoginResource'ı hem user hem admin için kullanıyoruz,
# dönen yanıtta 'role' bilgisi ile frontend'in ayrım yapmasını sağlıyoruz.

api.add_resource(AdminListResource,                  '/admin/data/admins')
api.add_resource(AdminResource,                      '/admin/data/admins/<int:admin_id>')

api.add_resource(UserListResource,                   '/admin/data/users')
api.add_resource(UserResource,                       '/admin/data/users/<int:user_id>')

api.add_resource(DietListResource,                   '/admin/data/diets')
api.add_resource(DietResource,                       '/admin/data/diets/<int:diet_id>')
api.add_resource(PublicDietListResource,             '/diets')

api.add_resource(ExerciseListResource,               '/admin/data/exercises')
api.add_resource(ExerciseResource,                   '/admin/data/exercises/<int:exercise_id>')
api.add_resource(PublicExerciseListResource,         '/exercises')

api.add_resource(ProgressListResource,               '/admin/data/progresstracking')
api.add_resource(ProgressResource,                   '/admin/data/progresstracking/<int:progress_id>')

api.add_resource(ContactListResource,                '/contacts') # Bu endpoint admin_required olmayabilir, public kalabilir
api.add_resource(ContactResource,                    '/contacts/<int:contact_id>') # Bu endpoint admin_required olmayabilir, public kalabilir

api.add_resource(BlogPostListResource,               '/admin/data/blogposts')
api.add_resource(BlogPostResource,                   '/admin/data/blogposts/<int:post_id>')
api.add_resource(PublicBlogPostListResource,         '/blogposts')
api.add_resource(PublicBlogPostResource,             '/blogposts/<int:post_id>')

api.add_resource(BlogPostImageListResource,          '/admin/data/blogpostimages')
api.add_resource(BlogPostImageResource,              '/admin/data/blogpostimages/<int:image_id>')
api.add_resource(PublicBlogPostImageListResource,    '/blogpostimages')
api.add_resource(PublicBlogPostImageResource,        '/blogpostimages/<int:image_id>')

api.add_resource(BlogCommentListResource,            '/admin/data/blogcomments')
api.add_resource(BlogCommentResource,                '/admin/data/blogcomments/<int:comment_id>')
api.add_resource(PublicBlogCommentListResource,      '/blogcomments')
api.add_resource(PublicBlogCommentResource,          '/blogcomments/<int:comment_id>')


api.add_resource(AdminUserDietListResource,          '/admin/data/users/<int:user_id>/diets')
api.add_resource(AdminUserDietResource,              '/admin/data/users/<int:user_id>/diets/<int:diet_id>')
api.add_resource(AdminUserExerciseListResource,      '/admin/data/users/<int:user_id>/exercises')
api.add_resource(AdminUserExerciseResource,          '/admin/data/users/<int:user_id>/exercises/<int:exercise_id>')
api.add_resource(AdminUserProgressListResource,      '/admin/data/users/<int:user_id>/progress')
api.add_resource(AdminUserProgressResource,          '/admin/data/users/<int:user_id>/progress/<int:progress_id>')