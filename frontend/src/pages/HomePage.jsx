import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Button,
    Card,
    Image
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
    FaHeart,
    FaStar,
    FaClock,
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaArrowUp
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Chatbot from '../components/Chatbot'; // Chatbot bileşenini import et

// AOS kütüphanesi için import (npm install aos yapmalısınız)
import AOS from 'aos';
import 'aos/dist/aos.css'; // AOS stilleri

// Bileşen yüklendiğinde AOS'u başlat
AOS.init({
    duration: 1000, // Animasyon süresi (ms)
    once: true,     // Animasyonların sadece bir kez tetiklenmesini sağlar
});

const galleryItems = [
    {
        src: 'https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'Galeri 1',
    },
    {
        src: 'https://images.unsplash.com/photo-1478144849792-57dda02c07f7?q=80&w=619&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'Galeri 2',
    },
    {
        src: 'https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'Galeri 3',
    },
    {
        src: 'https://images.unsplash.com/photo-1497888329096-51c27beff665?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'Galeri 4',
    },
    {
        src: 'https://images.unsplash.com/photo-1560233075-4c1e2007908e?q=80&w=1430&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'Galeri 4',
    },
    {
        src: 'https://images.unsplash.com/photo-1641130382532-2514a6c93859?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'Galeri 6',
    }
];

// Örnek müşteri yorumları
const testimonials = [
    {
        id: 1,
        name: 'Ayşe Yılmaz',
        role: 'Pazarlama Müdürü',
        text:
            'FitLab sayesinde 3 ayda 8 kilo verdim. Diyetisyenin her adımda yanımdaydı, kendimi çok iyi hissediyorum!',
        avatar: 'https://randomuser.me/api/portraits/women/21.jpg'
    },
    {
        id: 2,
        name: 'Mert Demir',
        role: 'Yazılım Mühendisi',
        text:
            'Özellikle egzersiz programları çok etkiliydi. Evde ekipmansız yapabileceğim hareketler harikaydı.',
        avatar: 'https://randomuser.me/api/portraits/men/34.jpg'
    },
    {
        id: 3,
        name: 'Elif Kaya',
        role: 'Öğretmen',
        text:
            'Blog yazılarındaki tarifler günlük rutine çok kolay uydu. Sağlıklı beslenmek hiç bu kadar keyifli olmamıştı.',
        avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
    }
];

// Örnek ekip üyeleri
const teamMembers = [
    {
        id: 1,
        name: 'Dr. Selin Arslan',
        position: 'Diyetisyen',
        photo:
            'https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: 2,
        name: 'Burak Özdemir',
        position: 'Spor Eğitmeni',
        photo:
            'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
];

export default function HomePage() {
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null); // Servis kartı hover durumu için
    const [hoveredGalleryItem, setHoveredGalleryItem] = useState(null); // Galeri hover durumu için
    const [hoveredSocialIcon, setHoveredSocialIcon] = useState(null); // Sosyal medya iconu hover durumu için
    const [hoveredFooterLink, setHoveredFooterLink] = useState(null); // Footer link hover durumu için


    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) { // 300px aşağı kaydırıldığında göster
                setShowScrollToTop(true);
            } else {
                setShowScrollToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Yumuşak kaydırma
        });
    };

    // Stilleri burada tanımlıyoruz (sadece statik olanlar)
    // Dinamik stiller veya hover gibi durumlar için inline veya event handler kullanılıyor
    const staticStyles = {
        galleryItemContainer: { // Yeni stil: Image'ı sarmalayan div için
            position: 'relative',
            width: '100%',
            paddingTop: '75%', // 4:3 en boy oranı için (height / width * 100)
            overflow: 'hidden',
        },
        galleryItemImage: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease-in-out',
        },
        galleryItemImageHover: {
            transform: 'scale(1.05)',
        },
        scrollToTopBtn: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            backgroundColor: '#2a9d8f',
            borderColor: '#2a9d8f',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0, // Başlangıçta gizli
            visibility: 'hidden', // Başlangıçta gizli
            transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
        },
        scrollToTopBtnShow: {
            opacity: 1,
            visibility: 'visible',
        },
        serviceCard: {
            transition: 'transform 0.3s ease-in-out, boxShadow 0.3s ease-in-out',
        },
        footerLinkBase: {
            color: '#fff',
            textDecoration: 'none',
            transition: 'color 0.3s ease-in-out, transform 0.3s ease-in-out',
        },
        footerLinkHover: {
            color: '#e9c46a',
            transform: 'translateX(5px)',
        },
        socialIconBase: {
            color: '#fff',
            transition: 'transform 0.3s ease-in-out, color 0.3s ease-in-out',
        },
        socialIconHover: {
            transform: 'scale(1.2)',
            color: '#e9c46a',
        },
    };


    return (
        <>
            {/* Hero Section */}
            <section
                style={{
                    background: 'linear-gradient(135deg, #2a9d8f 0%, #e9c46a 100%)',
                    textAlign: 'center',
                    color: '#fff',
                    padding: '6rem 0'
                }}
                data-aos="fade-up" // AOS animasyonu
            >
                <Container>
                    <h1
                        style={{
                            fontSize: '3.5rem',
                            fontWeight: '700',
                            textShadow: '2px 2px 6px rgba(0,0,0,0.5)'
                        }}
                    >
                        FitLab ile Sağlıklı Yaşa
                    </h1>
                    <p
                        style={{
                            fontSize: '1.25rem',
                            marginTop: '1rem',
                            maxWidth: '600px',
                            margin: 'auto',
                            textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
                        }}
                    >
                        Kişiye özel diyet ve egzersiz planlarıyla kendini yeniden keşfet. Enerjini
                        yükselt, formunu koru.
                    </p>
                    <Button
                        as={Link}
                        to="/signup"
                        size="lg"
                        style={{ backgroundColor: '#264653', border: 'none', marginTop: '2rem' }}
                    >
                        Hemen Başla
                    </Button>
                </Container>
            </section>

            {/* Services Section */}
            <section style={{ padding: '3rem 0' }}>
                <Container>
                    <Row className="g-4"> {/* g-4: col'lar arasında boşluk bırakır */}
                        {[
                            {
                                imgSrc:
                                    'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                                alt: 'Diyet Planları',
                                title: 'Diyet Planları',
                                text: 'Kişiye özel beslenme programları ile sağlıklı kilo kontrolü.',
                                link: '/diet',
                                btnColor: '#2a9d8f'
                            },
                            {
                                imgSrc:
                                    'https://images.unsplash.com/photo-1712220403561-bcf3f59d5927?q=80&w=1422&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                                alt: 'Egzersiz Programları',
                                title: 'Egzersiz Programları',
                                text: 'Seviye bazlı antrenman planları ile hedeflerine ulaş.',
                                link: '/exercise',
                                btnColor: '#e76f51'
                            },
                            {
                                imgSrc:
                                    'https://images.unsplash.com/photo-1673735073347-b32a59916837?q=80&w=1422&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                                alt: 'Blog Yazıları',
                                title: 'Blog Yazıları',
                                text: 'Sağlık, beslenme ve antrenman ipuçlarıyla bilgilendirici makaleler.',
                                link: '/blog',
                                btnColor: '#f4a261'
                            }
                        ].map((s, i) => (
                            <Col xs={12} md={4} key={i} className="mb-4" data-aos="fade-up" data-aos-delay={i * 100}> {/* AOS animasyonu ve delay */}
                                <Card
                                    className="h-100 shadow-sm"
                                    style={hoveredCard === i ? { ...staticStyles.serviceCard, transform: 'translateY(-8px)', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)' } : staticStyles.serviceCard}
                                    onMouseEnter={() => setHoveredCard(i)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <div style={{ width: '100%', height: '250px', overflow: 'hidden' }}>
                                        <Card.Img
                                            variant="top"
                                            src={s.imgSrc}
                                            alt={s.alt}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <Card.Body className="text-center">
                                        <Card.Title className="fw-bold fs-4">{s.title}</Card.Title> {/* Başlık güçlendirildi */}
                                        <Card.Text className="text-muted">{s.text}</Card.Text> {/* Metin rengi */}
                                        <Button
                                            as={Link}
                                            to={s.link}
                                            style={{
                                                backgroundColor: s.btnColor,
                                                border: 'none',
                                                color: '#fff'
                                            }}
                                            className="mt-3" // Üstten boşluk
                                        >
                                            İncele
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Why Choose Us Section */}
            <section
                style={{
                    padding: '3rem 0', // Padding güncellendi
                    textAlign: 'center',
                    backgroundColor: '#f9f9f9'
                }}
            >
                <Container>
                    <h2 className="mb-5 display-5 fw-bold" data-aos="fade-up">Neden FitLab?</h2> {/* Başlık güçlendirildi ve AOS */}
                    <Row className="g-4"> {/* g-4: col'lar arasında boşluk bırakır */}
                        {[
                            {
                                icon: <FaHeart size={45} style={{ color: '#e76f51' }} />, // İkon boyutu
                                title: 'Kişiye Özel',
                                desc: 'Bireysel ihtiyaçlarınıza özel planlar.'
                            },
                            {
                                icon: <FaStar size={45} style={{ color: '#f4a261' }} />, // İkon boyutu
                                title: 'Uzman Ekibi',
                                desc: 'Deneyimli diyetisyen ve antrenörler.'
                            },
                            {
                                icon: <FaClock size={45} style={{ color: '#2a9d8f' }} />, // İkon boyutu
                                title: '7/24 Destek',
                                desc: 'Her an yanınızdayız.'
                            }
                        ].map((it, i) => (
                            <Col xs={12} md={4} key={i} data-aos="fade-up" data-aos-delay={i * 150}> {/* AOS animasyonu ve delay */}
                                <div className="p-4 rounded shadow-sm h-100" style={{ backgroundColor: '#fff' }}> {/* Hafif kart efekti */}
                                    {it.icon}
                                    <h4 className="mt-3 mb-2">{it.title}</h4> {/* Başlık güçlendirildi */}
                                    <p className="text-muted">{it.desc}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* How It Works Section */}
            <section style={{ padding: '3rem 0' }}>
                <Container>
                    <h2 className="text-center mb-5 display-5 fw-bold" data-aos="fade-up">Nasıl Çalışır?</h2> {/* Başlık güçlendirildi ve AOS */}
                    <Row className="justify-content-center g-4"> {/* g-4: col'lar arasında boşluk bırakır */}
                        {[
                            {
                                step: 1,
                                title: 'Üyelik Oluştur',
                                desc: 'Kısa bir form doldurarak FitLab hesabını aç.'
                            },
                            {
                                step: 2,
                                title: 'Profil Bilgileri',
                                desc: 'Yaş, kilo, hedef gibi bilgilerinle profilini oluştur.'
                            },
                            {
                                step: 3,
                                title: 'Plan Hazırlama',
                                desc: 'Diyet ve egzersiz uzmanlarımız sana özel program hazırlar.'
                            },
                            {
                                step: 4,
                                title: 'Takip ve Geri Bildirim',
                                desc: 'Gelişimini takip et, geri bildirim al, motive kal.'
                            }
                        ].map((item, i) => (
                            <Col
                                key={item.step}
                                xs={12}
                                md={3}
                                className="text-center"
                                data-aos="zoom-in" // AOS animasyonu
                                data-aos-delay={i * 100}
                            >
                                <div
                                    style={{
                                        width: '4.5rem', // Boyut büyütüldü
                                        height: '4.5rem', // Boyut büyütüldü
                                        borderRadius: '50%',
                                        backgroundColor: '#e9c46a',
                                        color: '#264653',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem', // Font boyutu büyütüldü
                                        fontWeight: 'bold', // Kalın yapıldı
                                        margin: 'auto',
                                        marginBottom: '1.5rem', // Alt boşluk
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)' // Gölge eklendi
                                    }}
                                >
                                    {item.step}
                                </div>
                                <h4 className="fw-bold">{item.title}</h4> {/* Başlık güçlendirildi */}
                                <p className="text-muted">{item.desc}</p>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Testimonials Section */}
            <section style={{ backgroundColor: '#f9f9f9', padding: '3rem 0' }}>
                <Container>
                    <h2 className="text-center mb-5 display-5 fw-bold" data-aos="fade-up">Müşteri Yorumları</h2> {/* Başlık güçlendirildi ve AOS */}
                    <Row xs={1} md={3} className="g-4 justify-content-center"> {/* justify-content-center eklendi */}
                        {testimonials.map(tm => (
                            <Col key={tm.id} data-aos="fade-up" data-aos-delay={tm.id * 100}> {/* AOS animasyonu ve delay */}
                                <Card className="h-100 shadow-sm">
                                    <Card.Body className="text-center d-flex flex-column justify-content-between">
                                        <Image
                                            src={tm.avatar}
                                            roundedCircle
                                            width={90} // Avatar boyutu büyütüldü
                                            height={90} // Avatar boyutu büyütüldü
                                            className="mb-3 mx-auto" // mx-auto ile ortalandı
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <Card.Text style={{ fontStyle: 'italic', color: '#555' }}>
                                            “{tm.text}”
                                        </Card.Text>
                                        <div> {/* Bu div başlık ve alt başlığı gruplar */}
                                            <Card.Title className="fw-bold mt-3 mb-1">{tm.name}</Card.Title> {/* Başlık güçlendirildi */}
                                            <Card.Subtitle className="text-muted">{tm.role}</Card.Subtitle>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Team Section */}
            <section style={{ padding: '3rem 0' }}>
                <Container>
                    <h2 className="text-center mb-5 display-5 fw-bold" data-aos="fade-up">Ekibimiz</h2> {/* Başlık güçlendirildi ve AOS */}
                    <Row xs={1} md={2} className="g-4 justify-content-center">
                        {teamMembers.map(tm => (
                            <Col key={tm.id} md={4} className="text-center" data-aos="fade-up" data-aos-delay={tm.id * 100}> {/* AOS animasyonu ve delay */}
                                <Image
                                    src={tm.photo}
                                    roundedCircle
                                    width={160} // Fotoğraf boyutu büyütüldü
                                    height={160} // Fotoğraf boyutu büyütüldü
                                    className="mb-3 shadow-lg" // Gölge tipi değiştirildi
                                    style={{ objectFit: 'cover' }}
                                />
                                <h4 className="fw-bold">{tm.name}</h4> {/* Başlık güçlendirildi */}
                                <p className="text-primary fw-medium">{tm.position}</p> {/* Renk ve kalınlık eklendi */}
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Gallery Section (Footer’un hemen üstünde) - Updated */}
            <section className="py-0">
                <Row className="g-0"> {/* g-0: Sütunlar arası boşluğu kaldırır */}
                    {galleryItems.map((item, idx) => (
                        <Col xs={6} sm={4} md={3} lg={2} key={idx}> {/* Responsive sütun boyutları */}
                            <div
                                style={staticStyles.galleryItemContainer}
                                onMouseEnter={() => setHoveredGalleryItem(idx)}
                                onMouseLeave={() => setHoveredGalleryItem(null)}
                            >
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    style={{
                                        ...staticStyles.galleryItemImage,
                                        ...(hoveredGalleryItem === idx ? staticStyles.galleryItemImageHover : {})
                                    }}
                                />
                            </div>
                        </Col>
                    ))}
                </Row>
            </section>

            {/* Footer */}
            <footer style={{ backgroundColor: '#264653', color: '#fff', padding: '2rem 0' }}> {/* Renk koyu maviye çevrildi */}
                <Container>
                    <Row>
                        <Col md={4} className="mb-3">
                            <h5 className="fw-bold mb-3">FitLab</h5> {/* Başlık güçlendirildi */}
                            <p style={{ fontSize: '0.9rem' }}>Kişiye özel sağlık ve form çözümleri.</p>
                        </Col>
                        <Col md={4} className="mb-3">
                            <h5 className="fw-bold mb-3">Hızlı Linkler</h5> {/* Başlık güçlendirildi */}
                            <nav className="d-flex flex-column gap-2">
                                <Link
                                    to="/"
                                    style={{ ...staticStyles.footerLinkBase, ...(hoveredFooterLink === 'home' ? staticStyles.footerLinkHover : {}) }}
                                    onMouseEnter={() => setHoveredFooterLink('home')}
                                    onMouseLeave={() => setHoveredFooterLink(null)}
                                >Ana Sayfa</Link>
                                <Link
                                    to="/diet"
                                    style={{ ...staticStyles.footerLinkBase, ...(hoveredFooterLink === 'diet' ? staticStyles.footerLinkHover : {}) }}
                                    onMouseEnter={() => setHoveredFooterLink('diet')}
                                    onMouseLeave={() => setHoveredFooterLink(null)}
                                >Diyet</Link>
                                <Link
                                    to="/exercise"
                                    style={{ ...staticStyles.footerLinkBase, ...(hoveredFooterLink === 'exercise' ? staticStyles.footerLinkHover : {}) }}
                                    onMouseEnter={() => setHoveredFooterLink('exercise')}
                                    onMouseLeave={() => setHoveredFooterLink(null)}
                                >Egzersiz</Link>
                                <Link
                                    to="/blog"
                                    style={{ ...staticStyles.footerLinkBase, ...(hoveredFooterLink === 'blog' ? staticStyles.footerLinkHover : {}) }}
                                    onMouseEnter={() => setHoveredFooterLink('blog')}
                                    onMouseLeave={() => setHoveredFooterLink(null)}
                                >Blog</Link>
                                <Link
                                    to="/contact"
                                    style={{ ...staticStyles.footerLinkBase, ...(hoveredFooterLink === 'contact' ? staticStyles.footerLinkHover : {}) }}
                                    onMouseEnter={() => setHoveredFooterLink('contact')}
                                    onMouseLeave={() => setHoveredFooterLink(null)}
                                >İletişim</Link>
                            </nav>
                        </Col>
                        <Col md={4} className="mb-3">
                            <h5 className="fw-bold mb-3">Bizi Takip Edin</h5> {/* Başlık güçlendirildi */}
                            <div className="d-flex gap-3 fs-4">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ ...staticStyles.socialIconBase, ...(hoveredSocialIcon === 'facebook' ? staticStyles.socialIconHover : {}) }}
                                    onMouseEnter={() => setHoveredSocialIcon('facebook')}
                                    onMouseLeave={() => setHoveredSocialIcon(null)}
                                >
                                    <FaFacebookF />
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ ...staticStyles.socialIconBase, ...(hoveredSocialIcon === 'instagram' ? staticStyles.socialIconHover : {}) }}
                                    onMouseEnter={() => setHoveredSocialIcon('instagram')}
                                    onMouseLeave={() => setHoveredSocialIcon(null)}
                                >
                                    <FaInstagram />
                                </a>
                                <a
                                    href="https://x.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ ...staticStyles.socialIconBase, ...(hoveredSocialIcon === 'twitter' ? staticStyles.socialIconHover : {}) }}
                                    onMouseEnter={() => setHoveredSocialIcon('twitter')}
                                    onMouseLeave={() => setHoveredSocialIcon(null)}
                                >
                                    <FaXTwitter />
                                </a>
                                <a
                                    href="https://youtube.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ ...staticStyles.socialIconBase, ...(hoveredSocialIcon === 'youtube' ? staticStyles.socialIconHover : {}) }}
                                    onMouseEnter={() => setHoveredSocialIcon('youtube')}
                                    onMouseLeave={() => setHoveredSocialIcon(null)}
                                >
                                    <FaYoutube />
                                </a>
                            </div>
                        </Col>
                    </Row>
                    <div className="text-center mt-4 pt-3 border-top border-secondary" style={{ fontSize: '.875rem' }}> {/* Üst çizgi eklendi */}
                        © 2025 FitLab | Sağlıklı yaşa, güçlü ol!
                    </div>
                </Container>
            </footer>

        {/* Sohbet Botu Bileşeni */}
            <Chatbot /> 

            {/* Scroll-to-Top Butonu (Chatbot ile çakışmaması için stilini ayarlamanız gerekebilir) */}
            <Button
                variant="primary"
                onClick={scrollToTop}
                style={{
                    ...staticStyles.scrollToTopBtn,
                    ...(showScrollToTop ? staticStyles.scrollToTopBtnShow : {}),
                    borderRadius: '50%',
                    boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)',
                    // Sohbet botu sağ altta olduğu için, scroll-to-top butonunu biraz yukarı taşıyabiliriz.
                    // Veya tasarımınıza göre sadece birini kullanmayı düşünebilirsiniz.
                    bottom: showScrollToTop ? '90px' : '20px', // Bot varken biraz yukarı
                    transition: 'bottom 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
                }}
                aria-label="Sayfa Başına Dön"
            >
                <FaArrowUp size={20} />
            </Button>
        </>
    );
}