// src/pages/admin/BlogListPage.jsx

import React, { useEffect, useState } from 'react';
import {
  Table, Spinner, Alert,
  Button, Container, Modal, Form
} from 'react-bootstrap';
import {
  getBlogPostsAdmin,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostImagesAdmin,
  createBlogImage,
  updateBlogImage,
  deleteBlogImage,
  getCommentsAdmin,
  createCommentAdmin,
  updateCommentAdmin,
  deleteCommentAdmin
} from '../../services/api';

export default function BlogListPage() {
  // loading & error
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // data lists
  const [posts, setPosts]       = useState([]);
  const [images, setImages]     = useState([]);
  const [comments, setComments] = useState([]);

  // ── load all ─────────────────────────────────────────
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [pRes, iRes, cRes] = await Promise.all([
        getBlogPostsAdmin(),
        getBlogPostImagesAdmin(),
        getCommentsAdmin()
      ]);
      setPosts(pRes.data);
      setImages(iRes.data);
      setComments(cRes.data);
    } catch {
      setError('Yükleme sırasında hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // ── POSTS CRUD ───────────────────────────────────────
  const [showPostModal, setShowPostModal] = useState(false);
  const [postMode, setPostMode]           = useState('create');
  const [currentPost, setCurrentPost]     = useState({
    title: '', content: '', status: 'draft', admin_id: ''
  });

  const openCreatePost = () => {
    setPostMode('create');
    setCurrentPost({ title:'', content:'', status:'draft', admin_id:'' });
    setShowPostModal(true);
  };
  const openEditPost = post => {
    setPostMode('edit');
    setCurrentPost(post);
    setShowPostModal(true);
  };
  const handleDeletePost = async id => {
    if (!window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return;
    await deleteBlogPost(id);
    setPosts(ps => ps.filter(p=>p.post_id!==id));
  };
  const handleSubmitPost = async () => {
    if (postMode==='create') await createBlogPost(currentPost);
    else                     await updateBlogPost(currentPost.post_id, currentPost);
    setShowPostModal(false);
    loadAll();
  };

  // ── IMAGES CRUD ─────────────────────────────────────
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageMode, setImageMode]           = useState('create');
  const [currentImage, setCurrentImage]     = useState({
    post_id:'', image_url:'', alt_text:''
  });

  const openCreateImage = () => {
    setImageMode('create');
    setCurrentImage({ post_id:'', image_url:'', alt_text:'' });
    setShowImageModal(true);
  };
  const openEditImage = img => {
    setImageMode('edit');
    setCurrentImage(img);
    setShowImageModal(true);
  };
  const handleDeleteImage = async id => {
    if (!window.confirm('Bu görseli silmek istediğinize emin misiniz?')) return;
    await deleteBlogImage(id);
    setImages(imgs => imgs.filter(i=>i.image_id!==id));
  };
  const handleSubmitImage = async () => {
    if (imageMode==='create') {
      await createBlogImage(currentImage);
    } else {
      await updateBlogImage(currentImage.image_id, currentImage);
    }
    setShowImageModal(false);
    setImages((await getBlogPostImagesAdmin()).data);
  };

  // ── COMMENTS CRUD ────────────────────────────────────
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentMode, setCommentMode]           = useState('create');
  const [currentComment, setCurrentComment]     = useState({
    post_id:'', user_id:'', comment:''
  });

  const openCreateComment = () => {
    setCommentMode('create');
    setCurrentComment({ post_id:'', user_id:'', comment:'' });
    setShowCommentModal(true);
  };
  const openEditComment = c => {
    setCommentMode('edit');
    setCurrentComment(c);
    setShowCommentModal(true);
  };
  const handleDeleteComment = async id => {
    if (!window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;
    await deleteCommentAdmin(id);
    setComments(cs => cs.filter(cm=>cm.comment_id!==id));
  };
  const handleSubmitComment = async () => {
    if (commentMode==='create') {
      await createCommentAdmin(currentComment);
    } else {
      await updateCommentAdmin(currentComment.comment_id, currentComment);
    }
    setShowCommentModal(false);
    setComments((await getCommentsAdmin()).data);
  };

  // ── render ───────────────────────────────────────────
  if (loading) return <div className="text-center my-5"><Spinner animation="border"/></div>;
  if (error)   return <Alert variant="danger" className="my-5 text-center">{error}</Alert>;

  return (
    <Container className="py-4">
      {/* --- POSTS --- */}
      <h3>Blog Yazıları</h3>
      <Button className="mb-3" onClick={openCreatePost}>Yeni Yazı Ekle</Button>
      <Table striped bordered hover className="mb-5">
        <thead>
          <tr>
            <th>ID</th><th>Başlık</th><th>Durum</th><th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(p=>(
            <tr key={p.post_id}>
              <td>{p.post_id}</td>
              <td>{p.title}</td>
              <td>{p.status}</td>
              <td>
                <Button size="sm" variant="warning" className="me-2" onClick={()=>openEditPost(p)}>
                  Düzenle
                </Button>
                <Button size="sm" variant="danger" onClick={()=>handleDeletePost(p.post_id)}>
                  Sil
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* --- IMAGES --- */}
      <h4>Görseller</h4>
      <Button className="mb-3" onClick={openCreateImage}>Yeni Görsel Ekle</Button>
      <Table striped bordered hover className="mb-5">
        <thead>
          <tr>
            <th>ID</th><th>Post ID</th><th>URL</th><th>Alt</th><th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {images.map(i=>(
            <tr key={i.image_id}>
              <td>{i.image_id}</td>
              <td>{i.post_id}</td>
              <td><a href={i.image_url} target="_blank" rel="noopener noreferrer">{i.image_url}</a></td>
              <td>{i.alt_text}</td>
              <td>
                <Button size="sm" variant="warning" className="me-2" onClick={()=>openEditImage(i)}>
                  Düzenle
                </Button>
                <Button size="sm" variant="danger" onClick={()=>handleDeleteImage(i.image_id)}>
                  Sil
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* --- COMMENTS --- */}
      <h4>Yorumlar</h4>
      <Button className="mb-3" onClick={openCreateComment}>Yeni Yorum Ekle</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th><th>Post ID</th><th>Kullanıcı ID</th><th>Yorum</th><th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {comments.map(c=>(
            <tr key={c.comment_id}>
              <td>{c.comment_id}</td>
              <td>{c.post_id}</td>
              <td>{c.user_id}</td>
              <td>{c.comment}</td>
              <td>
                <Button size="sm" variant="warning" className="me-2" onClick={()=>openEditComment(c)}>
                  Düzenle
                </Button>
                <Button size="sm" variant="danger" onClick={()=>handleDeleteComment(c.comment_id)}>
                  Sil
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* ===== POSTS MODAL ===== */}
      <Modal show={showPostModal} onHide={()=>setShowPostModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{postMode==='create'?'Yeni Yazı':'Yazıyı Düzenle'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Başlık</Form.Label>
              <Form.Control
                type="text"
                value={currentPost.title}
                onChange={e=>setCurrentPost({...currentPost,title:e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>İçerik</Form.Label>
              <Form.Control
                as="textarea" rows={4}
                value={currentPost.content}
                onChange={e=>setCurrentPost({...currentPost,content:e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Durum</Form.Label>
              <Form.Select
                value={currentPost.status}
                onChange={e=>setCurrentPost({...currentPost,status:e.target.value})}
              >
                <option value="draft">Taslak</option>
                <option value="published">Yayınlandı</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Admin ID</Form.Label>
              <Form.Control
                type="number"
                value={currentPost.admin_id}
                onChange={e=>setCurrentPost({...currentPost,admin_id:e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowPostModal(false)}>İptal</Button>
          <Button variant="primary" onClick={handleSubmitPost}>
            {postMode==='create'?'Ekle':'Güncelle'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ===== IMAGES MODAL ===== */}
      <Modal show={showImageModal} onHide={()=>setShowImageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{imageMode==='create'?'Yeni Görsel':'Görseli Düzenle'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Post ID</Form.Label>
              <Form.Control
                type="number"
                value={currentImage.post_id}
                onChange={e=>setCurrentImage({...currentImage,post_id:e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Görsel URL</Form.Label>
              <Form.Control
                type="text"
                value={currentImage.image_url}
                onChange={e=>setCurrentImage({...currentImage,image_url:e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Alt Text</Form.Label>
              <Form.Control
                type="text"
                value={currentImage.alt_text}
                onChange={e=>setCurrentImage({...currentImage,alt_text:e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowImageModal(false)}>İptal</Button>
          <Button variant="primary" onClick={handleSubmitImage}>
            {imageMode==='create'?'Ekle':'Güncelle'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ===== COMMENTS MODAL ===== */}
      <Modal show={showCommentModal} onHide={()=>setShowCommentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{commentMode==='create'?'Yeni Yorum':'Yorumu Düzenle'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Post ID</Form.Label>
              <Form.Control
                type="number"
                value={currentComment.post_id}
                onChange={e=>setCurrentComment({...currentComment,post_id:e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Kullanıcı ID</Form.Label>
              <Form.Control
                type="number"
                value={currentComment.user_id}
                onChange={e=>setCurrentComment({...currentComment,user_id:e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Yorum</Form.Label>
              <Form.Control
                as="textarea" rows={3}
                value={currentComment.comment}
                onChange={e=>setCurrentComment({...currentComment,comment:e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowCommentModal(false)}>İptal</Button>
          <Button variant="primary" onClick={handleSubmitComment}>
            {commentMode==='create'?'Ekle':'Güncelle'}
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}
