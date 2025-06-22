// src/components/CustomNavbar.jsx

import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, NavbarText } from 'react-bootstrap'; // Image bileşenini ekledik
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getProfile } from '../services/api';

export default function CustomNavbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const token = localStorage.getItem('access_token');

  const hideNav = ['/login', '/signup'];

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    getProfile()
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('access_token');
        setUser(null);
      });
  }, [token, pathname]);

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    navigate('/login');
  };

  if (hideNav.includes(pathname)) return null;

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">FitLab</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-between">
          {/* Sol Menü */}
          <Nav>
            <Nav.Link as={Link} to="/diet">Diyet</Nav.Link>
            <Nav.Link as={Link} to="/exercise">Egzersiz</Nav.Link>
            <Nav.Link as={Link} to="/blog">Blog</Nav.Link>
            <Nav.Link as={Link} to="/contact">İletişim</Nav.Link>
          </Nav>

          {/* Sağ Menü: Auth */}
          <Nav className="align-items-center">
            {!user ? (
              <>
                <Nav.Link as={Link} to="/login">Giriş Yap</Nav.Link>
                <Button as={Link} to="/signup" variant="primary" className="ms-2">
                  Kayıt Ol
                </Button>
              </>
            ) : (
              <>
                
                {/* Kullanıcı Adı / Adı */}
                <NavbarText className="me-3">
                  {user.first_name || user.username}
                </NavbarText>
                
                <Nav.Link as={Link} to="/profile">Profil</Nav.Link>
                <Button variant="outline-danger" className="ms-2" onClick={logout}>
                  Çıkış Yap
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}