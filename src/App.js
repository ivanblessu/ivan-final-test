import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, ListGroup, Form, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [cases, setCases] = useState([]);
  const [newCase, setNewCase] = useState({ title: '', content: '' });
  const [editCase, setEditCase] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (token) {
      fetchCases();
    }
  }, [token]);

  const fetchCases = async () => {
    try {
      const response = await axios.get('https://fastlegal-backend-heroku.herokuapp.com/api/cases', {
        headers: { 'x-auth-token': token },
      });
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCase({ ...newCase, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://fastlegal-backend-heroku.herokuapp.com/api/cases', newCase, {
        headers: { 'x-auth-token': token },
      });
      setCases([...cases, response.data]);
      setNewCase({ title: '', content: '' });
    } catch (error) {
      console.error('Error adding case:', error);
    }
  };

  const handleEdit = (caseItem) => {
    setEditCase(caseItem);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://fastlegal-backend-heroku.herokuapp.com/api/cases/${id}`, {
        headers: { 'x-auth-token': token },
      });
      setCases(cases.filter(caseItem => caseItem._id !== id));
    } catch (error) {
      console.error('Error deleting case:', error);
    }
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditCase({ ...editCase, [name]: value });
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`https://fastlegal-backend-heroku.herokuapp.com/api/cases/${editCase._id}`, editCase, {
        headers: { 'x-auth-token': token },
      });
      setCases(cases.map(caseItem => caseItem._id === response.data._id ? response.data : caseItem));
      setShowModal(false);
      setEditCase(null);
    } catch (error) {
      console.error('Error editing case:', error);
    }
  };

  const handleAuth = async (event) => {
    event.preventDefault();
    const url = isLogin ? 'https://fastlegal-backend-heroku.herokuapp.com/login' : 'https://fastlegal-backend-heroku.herokuapp.com/register';
    try {
      const response = await axios.post(url, { username, password });
      if (isLogin) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        fetchCases();
        alert('Login successful!');
      } else {
        alert('Registration successful! Please log in.');
      }
    } catch (error) {
      console.error(`Error ${isLogin ? 'logging in' : 'registering'}:`, error);
      alert(`Error ${isLogin ? 'logging in' : 'registering'}`);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <Container className="mt-4">
      {!token ? (
        <Row>
          <Col>
            <h1>法律案例搜尋</h1>
            <Form onSubmit={handleAuth}>
              <Form.Group>
                <Form.Label>用戶名</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>密碼</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-2">
                {isLogin ? '登錄' : '註冊'}
              </Button>
              <Button
                variant="secondary"
                type="button"
                className="mt-2 ml-2"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? '切換到註冊' : '切換到登錄'}
              </Button>
            </Form>
          </Col>
        </Row>
      ) : (
        <>
          <Row>
            <Col>
              <h1>法律案例搜尋</h1>
              <Button variant="danger" onClick={handleLogout} className="mb-3">登出</Button>
              <ListGroup>
                {cases.map((caseItem, index) => (
                  <ListGroup.Item key={index}>
                    <h5>{caseItem.title}</h5>
                    <p>{caseItem.content}</p>
                    <Button variant="warning" onClick={() => handleEdit(caseItem)}>編輯</Button>
                    <Button variant="danger" onClick={() => handleDelete(caseItem._id)}>刪除</Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Form onSubmit={handleSubmit} className="mt-4">
                <Form.Group>
                  <Form.Label>標題</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={newCase.title}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>內容</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="content"
                    value={newCase.content}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-2">添加案例</Button>
              </Form>
            </Col>
          </Row>
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>編輯案例</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleEditSubmit}>
                <Form.Group>
                  <Form.Label>標題</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={editCase ? editCase.title : ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>內容</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="content"
                    value={editCase ? editCase.content : ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-2">保存變更</Button>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      )}
    </Container>
  );
}

export default App;
