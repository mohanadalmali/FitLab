// src/components/Chatbot.js

import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, InputGroup, Card, Spinner, Alert } from 'react-bootstrap'; // Spinner ve Alert'i de ekledim, loading ve error için
import { SendFill, ChatLeftDotsFill, XLg } from 'react-bootstrap-icons';
import { sendChatMessage } from '../services/api'; // sendChatMessage fonksiyonunu import edin!

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Merhaba! Ben FitLab Botunuz. Size nasıl yardımcı olabilirim? Diyet, egzersiz, ilerleme veya BMI konularında sorularınızı bekliyorum.' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false); // Yeni: Yükleme durumu
    const [error, setError] = useState(null);     // Yeni: Hata durumu
    const messagesEndRef = useRef(null); // Mesajları en alta kaydırmak için

    // Mesajlar güncellendiğinde en alta kaydır
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = async () => {
        if (inputMessage.trim() === '') return;

        const userMessage = { sender: 'user', text: inputMessage.trim() };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInputMessage('');
        setLoading(true); // Mesaj gönderilirken yükleme durumunu başlat
        setError(null);    // Önceki hatayı temizle

        try {
            console.log(`DEBUG(Chatbot): Mesaj gönderiliyor: '${userMessage.text}'`);
            // Burası önemli değişiklik: sendChatMessage fonksiyonunu kullanıyoruz
            const response = await sendChatMessage(userMessage.text);
            
            console.log("DEBUG(Chatbot): Chatbot yanıtı alındı:", response.data);

            // Backend'den gelen yanıtın yapısına göre 'response.data.response' veya sadece 'response.data' kullanın
            // Önceki backend örneğimizde { response: "..." } döndürüyorduk
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: response.data.response || "Yanıt alınamadı." }]);

        } catch (err) {
            console.error('DEBUG(Chatbot): Sohbet botu ile iletişim hatası:', err);
            // Hata mesajını daha anlaşılır hale getirelim
            let errorMessage = 'Üzgünüm, şu an size yardımcı olamıyorum.';
            if (err.response && err.response.status === 401) {
                errorMessage = 'Yetkilendirme hatası. Lütfen giriş yaptığınızdan emin olun.';
            } else if (err.response && err.response.data && err.response.data.message) {
                errorMessage = `Bir hata oluştu: ${err.response.data.message}`;
            }
            
            setError(errorMessage);
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: 'Bir hata oluştu. Lütfen konsolu kontrol edin.' }]);
        } finally {
            setLoading(false); // Yükleme durumunu bitir
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Varsayılan formu göndermeyi engelle
            sendMessage();
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            transition: 'all 0.3s ease-in-out',
        }}>
            {/* Sohbet Botu Butonu */}
            {!isOpen && (
                <Button
                    onClick={toggleChatbot}
                    variant="success"
                    className="rounded-circle shadow-lg"
                    style={{
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        backgroundColor: '#2a9d8f', // Ana tema rengi
                        borderColor: '#2a9d8f',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }}
                    aria-label="Sohbet Botunu Aç"
                >
                    <ChatLeftDotsFill />
                </Button>
            )}

            {/* Sohbet Botu Penceresi */}
            {isOpen && (
                <Card className="shadow-lg" style={{ width: '350px', height: '450px' }}>
                    <Card.Header 
                        className="d-flex justify-content-between align-items-center text-white" 
                        style={{ backgroundColor: '#2a9d8f', borderBottom: 'none' }}
                    >
                        <h5 className="mb-0 fw-bold">FitLab Bot</h5>
                        <Button variant="link" onClick={toggleChatbot} className="text-white p-0" aria-label="Sohbet Botunu Kapat">
                            <XLg size={20} />
                        </Button>
                    </Card.Header>
                    <Card.Body 
                        className="d-flex flex-column" 
                        style={{ flex: 1, overflowY: 'auto', padding: '10px', backgroundColor: '#f5f5f5' }}
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    backgroundColor: msg.sender === 'user' ? '#e3f2fd' : '#e8f5e9',
                                    color: '#333',
                                    padding: '8px 12px',
                                    borderRadius: '15px',
                                    marginBottom: '8px',
                                    maxWidth: '80%',
                                    wordBreak: 'break-word',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                                }}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {loading && ( // Yeni: Yükleme spinner'ı
                            <div className="text-center mt-2">
                                <Spinner animation="border" size="sm" />
                            </div>
                        )}
                        {error && ( // Yeni: Hata mesajı
                            <Alert variant="danger" className="mt-2 text-center py-2 px-3">
                                {error}
                            </Alert>
                        )}
                        <div ref={messagesEndRef} /> {/* Otomatik kaydırma hedefi */}
                    </Card.Body>
                    <Card.Footer style={{ padding: '10px', borderTop: 'none', backgroundColor: '#f5f5f5' }}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Mesajınızı yazın..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading} // Yüklenirken input'u devre dışı bırak
                                style={{ borderRadius: '20px', paddingLeft: '15px' }}
                            />
                            <Button 
                                variant="success" 
                                onClick={sendMessage}
                                disabled={loading} // Yüklenirken butonu devre dışı bırak
                                style={{ 
                                    backgroundColor: '#2a9d8f', 
                                    borderColor: '#2a9d8f', 
                                    borderTopRightRadius: '20px', 
                                    borderBottomRightRadius: '20px',
                                    marginLeft: '-1px' // Input ile birleşmesini sağlar
                                }}
                            >
                                <SendFill />
                            </Button>
                        </InputGroup>
                    </Card.Footer>
                </Card>
            )}
        </div>
    );
}