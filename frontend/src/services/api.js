// src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Her isteğe Authorization header olarak Bearer token ekleyen interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// ─── Public (Herkese Açık) ──────────────────────────────────────────────────────
export const getDiets = () => api.get('/diets');
export const getDiet = id => api.get(`/diets/${id}`);
export const getExercises = () => api.get('/exercises');
export const getExercise = id => api.get(`/exercises/${id}`);
export const getBlogPosts = () => api.get('/blogposts');
export const getBlogPost = id => api.get(`/blogposts/${id}`);
export const getBlogPostImages = () => api.get('/blogpostimages');
export const getBlogPostImage = id => api.get(`/blogpostimages/${id}`);
export const getBlogComments = () => api.get('/blogcomments');
export const getBlogComment = id => api.get(`/blogcomments/${id}`);
export const getContacts = () => api.get('/contacts');
export const createContact = contact => api.post('/contacts', contact);
export const updateContact = (id, contact) => api.put(`/contacts/${id}`, contact);
export const deleteContact = id => api.delete(`/contacts/${id}`);

// YENİ EKLENEN CHATBOT FONKSİYONU
export const sendChatMessage = (messageContent) => api.post('/chatbot', { message: messageContent });

// ─── User Profile & Assignments ────────────────────────────────────────────────
// Profile bilgilerini çekme ve güncelleme
export const getProfile = () => api.get('/profile');
export const updateProfile = data => api.put('/profile', data);

// NOT: Aşağıdaki “/profile/...” endpoint’leri backend’de tanımlı değilse, admin endpoint’leri kullanılır.
// Eğer backend’de /profile/diets, /profile/exercises, /profile/progress rotalarınız yoksa,
// bunların yerine getUserDietsAdmin, getUserExercisesAdmin ve getUserProgressAdmin iş görecektir.

export const getUserDiets = () => api.get('/profile/diets');
export const getUserExercises = () => api.get('/profile/exercises');
export const getProgressTracking = () => api.get('/profile/progress');

// ─── Auth (Kayıt / Giriş) ───────────────────────────────────────────────────────
export const register = data => api.post('/auth/register', data);
export const login = data => api.post('/auth/login', data);

// ─── Admin CRUD ──────────────────────────────────────────────────────────────────
export const getAdmins = () => api.get('/admin/data/admins');
export const createAdmin = admin => api.post('/admin/data/admins', admin);
export const updateAdmin = (id, admin) => api.put(`/admin/data/admins/${id}`, admin);
export const deleteAdmin = id => api.delete(`/admin/data/admins/${id}`);

export const getUsers = () => api.get('/admin/data/users');
export const createUser = user => api.post('/admin/data/users', user);
export const updateUser = (id, user) => api.put(`/admin/data/users/${id}`, user);
export const deleteUser = id => api.delete(`/admin/data/users/${id}`);

export const getAdminDiets = () => api.get('/admin/data/diets');
export const createAdminDiet = diet => api.post('/admin/data/diets', diet);
export const updateAdminDiet = (id, diet) => api.put(`/admin/data/diets/${id}`, diet);
export const deleteAdminDiet = id => api.delete(`/admin/data/diets/${id}`);

export const getAdminExercises = () => api.get('/admin/data/exercises');
export const createAdminExercise = ex => api.post('/admin/data/exercises', ex);
export const updateAdminExercise = (id, ex) => api.put(`/admin/data/exercises/${id}`, ex);
export const deleteAdminExercise = id => api.delete(`/admin/data/exercises/${id}`);

export const getProgress = () => api.get('/admin/data/progresstracking');
export const createProgress = p => api.post('/admin/data/progresstracking', p);
export const updateProgress = (id, p) => api.put(`/admin/data/progresstracking/${id}`, p);
export const deleteProgress = id => api.delete(`/admin/data/progresstracking/${id}`);

export const getBlogPostImagesAdmin = () => api.get('/admin/data/blogpostimages');
export const createBlogImage = img => api.post('/admin/data/blogpostimages', img);
export const updateBlogImage = (id, img) => api.put(`/admin/data/blogpostimages/${id}`, img);
export const deleteBlogImage = id => api.delete(`/admin/data/blogpostimages/${id}`);

export const getBlogPostsAdmin = () => api.get('/admin/data/blogposts');
export const createBlogPost = post => api.post('/admin/data/blogposts', post);
export const updateBlogPost = (id, post) => api.put(`/admin/data/blogposts/${id}`, post);
export const deleteBlogPost = id => api.delete(`/admin/data/blogposts/${id}`);

export const getCommentsAdmin = () => api.get('/admin/data/blogcomments');
export const createCommentAdmin = c => api.post('/admin/data/blogcomments', c);
export const updateCommentAdmin = (id, c) => api.put(`/admin/data/blogcomments/${id}`, c);
export const deleteCommentAdmin = id => api.delete(`/admin/data/blogcomments/${id}`);

// ─── Kullanıcı Diyet / Egzersiz / Progress Atamaları (Admin Endpoint’leri) ───────
export const getUserDietsAdmin = userId => api.get(`/admin/data/users/${userId}/diets`);
export const createUserDietAdmin = (userId, dietId) => api.post(`/admin/data/users/${userId}/diets`, { diet_id: dietId });
export const deleteUserDietAdmin = (userId, dietId) => api.delete(`/admin/data/users/${userId}/diets/${dietId}`);

export const getUserExercisesAdmin = userId => api.get(`/admin/data/users/${userId}/exercises`);
export const createUserExerciseAdmin = (userId, exerciseId) => api.post(`/admin/data/users/${userId}/exercises`, { exercise_id: exerciseId });
export const deleteUserExerciseAdmin = (userId, exerciseId) => api.delete(`/admin/data/users/${userId}/exercises/${exerciseId}`);

export const getUserProgressAdmin = userId => api.get(`/admin/data/users/${userId}/progress`);
export const createUserProgressAdmin = (userId, data) => api.post(`/admin/data/users/${userId}/progress`, data);
export const updateUserProgressAdmin = (userId, progressId, data) => api.put(`/admin/data/users/${userId}/progress/${progressId}`, data);
export const deleteUserProgressAdmin = (userId, progressId) => api.delete(`/admin/data/users/${userId}/progress/${progressId}`);

// ─── Varsayılan export ────────────────────────────────────────────────────────────
export default api;