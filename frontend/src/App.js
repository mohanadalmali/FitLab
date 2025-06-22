import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import CustomNavbar from './components/CustomNavbar';
import HomePage from './pages/HomePage';
import DietPage from './pages/DietPage';
import DietDetailPage from './pages/DietDetailPage';
import ExercisePage from './pages/ExercisePage';
import ExerciseDetailPage from './pages/ExerciseDetailPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';

// Admin
import AdminDashboard from './pages/AdminDashboard';
import AdminListPage from './pages/admin/AdminListPage';
import UserListPage from './pages/admin/UserListPage';
import DietListPage from './pages/admin/DietListPage';
import ExerciseListPage from './pages/admin/ExerciseListPage';
import BlogListPage from './pages/admin/BlogListPage';
import ContactListPage from './pages/admin/ContactListPage';

function Layout() {
  const { pathname } = useLocation();
  const hideNav = ['/login', '/signup'];
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <>
      {!hideNav.includes(pathname) && !isAdminRoute && <CustomNavbar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/diet" element={<DietPage />} />
        <Route path="/diet/:id" element={<DietDetailPage />} />
        <Route path="/exercise" element={<ExercisePage />} />
        <Route path="/exercise/:id" element={<ExerciseDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin Panel */}
        <Route path="/admin/*" element={<AdminDashboard />}>
          <Route index element={<AdminListPage />} />
          <Route path="admins" element={<AdminListPage />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="diets" element={<DietListPage />} />
          <Route path="exercises" element={<ExerciseListPage />} />
          <Route path="blogposts" element={<BlogListPage />} />
          <Route path="contacts" element={<ContactListPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
