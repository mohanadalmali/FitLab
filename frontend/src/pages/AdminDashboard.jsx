import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Nav,
    Navbar,
    Button,
    Image // Profil resmi için Image bileşeni
} from 'react-bootstrap';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    FaUserShield,
    FaUsers,
    FaAppleAlt,
    FaDumbbell,
    FaNewspaper,
    FaEnvelope,
    FaSignOutAlt
} from 'react-icons/fa';

export default function AdminDashboard() {
    const [adminInfo, setAdminInfo] = useState({
        username: '',
        firstName: '',
        lastName: '',
        profilePicture: ''
    });
    const navigate = useNavigate();
    const location = useLocation(); // useLocation hook'u burada tanımlandı ve kullanıldı

    useEffect(() => {
        const userRole = localStorage.getItem('user_role');
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken || userRole !== 'admin') {
            navigate('/login', { replace: true });
        } else {
            // localStorage'dan admin bilgilerini çek
            setAdminInfo({
                username: localStorage.getItem('admin_username') || '',
                firstName: localStorage.getItem('admin_first_name') || '',
                lastName: localStorage.getItem('admin_last_name') || '',
                profilePicture: localStorage.getItem('admin_profile_picture') || ''
            });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_role');
        // Admin'e özel bilgileri de temizle
        localStorage.removeItem('admin_username');
        localStorage.removeItem('admin_first_name');
        localStorage.removeItem('admin_last_name');
        localStorage.removeItem('admin_profile_picture');
        navigate('/login', { replace: true });
    };

    const items = [
        { to: 'admins', label: 'Yöneticiler', icon: <FaUserShield className="me-1" /> },
        { to: 'users', label: 'Kullanıcılar', icon: <FaUsers className="me-1" /> },
        { to: 'diets', label: 'Diyetler', icon: <FaAppleAlt className="me-1" /> },
        { to: 'exercises', label: 'Egzersizler', icon: <FaDumbbell className="me-1" /> },
        { to: 'blogposts', label: 'Blog Yazıları', icon: <FaNewspaper className="me-1" /> },
        { to: 'contacts', label: 'İletişimler', icon: <FaEnvelope className="me-1" /> }
    ];

    // Admin adı ve soyadını birleştir
    const adminFullName = `${adminInfo.firstName} ${adminInfo.lastName}`.trim();

    return (
        <>
            {/* Tek ve Ana Navbar */}
            <Navbar bg="light" expand="md" className="border-bottom shadow-sm fixed-top">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/admin" className="d-flex align-items-center">
                        <FaUserShield className="me-2" /> Admin Panel
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        {/* Menü Öğeleri */}
                        <Nav className="me-auto">
                            {items.map(item => (
                                <Nav.Link
                                    as={Link}
                                    to={`/admin/${item.to}`}
                                    key={item.to}
                                    className="d-flex align-items-center me-2"
                                    // Aktif linki belirleme
                                    active={location.pathname.startsWith(`/admin/${item.to}`)}
                                >
                                    {item.icon} {item.label}
                                </Nav.Link>
                            ))}
                        </Nav>
                        {/* Admin Bilgileri ve Çıkış */}
                        <Nav>
                            {adminInfo.username && (
                                <Nav.Item className="d-flex align-items-center me-3">
                                    {adminInfo.profilePicture && (
                                        <Image
                                            src={adminInfo.profilePicture}
                                            roundedCircle
                                            width={30}
                                            height={30}
                                            className="me-2"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    )}
                                    <span className="text-dark">
                                        Hoş Geldiniz, <strong>{adminFullName || adminInfo.username}</strong>
                                    </span>
                                </Nav.Item>
                            )}
                            <Button variant="outline-danger" onClick={handleLogout} className="d-flex align-items-center">
                                <FaSignOutAlt className="me-2" /> Çıkış Yap
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* İçerik Alanı - Navbar'ın altına hizalamak için üst boşluk ekledik */}
            <Container fluid style={{ paddingTop: '70px', minHeight: '100vh' }}> {/* Navbar yüksekliğine göre ayarlayın */}
                <Row>
                    <Col xs={12} className="p-4">
                        {/* Outlet, ilgili alt bileşenlerin (AdminListPage, UserListPage vb.) içeriğini buraya yükler */}
                        {/* Her alt bileşen kendi içeriğini bir Card içinde barındırmalıdır */}
                        <Outlet />
                    </Col>
                </Row>
            </Container>
        </>
    );
}