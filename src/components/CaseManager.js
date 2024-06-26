import React, { useState, useEffect, useContext } from 'react';
import axios from '../axios';
import { AuthContext } from '../context/AuthContext';

const CaseManager = () => {
  const { user, login, logout } = useContext(AuthContext);
  const [cases, setCases] = useState([]);
  const [newCase, setNewCase] = useState({ title: '', content: '' });

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get('/api/cases');
        setCases(response.data);
      } catch (error) {
        console.error('Failed to fetch cases:', error);
      }
    };
    fetchCases();
  }, []);

  const handleAddCase = async () => {
    try {
      const response = await axios.post('/api/cases', newCase);
      setCases([...cases, response.data]);
      setNewCase({ title: '', content: '' });
    } catch (error) {
      console.error('Failed to add case:', error);
    }
  };

  const handleDeleteCase = async (id) => {
    try {
      await axios.delete(`/api/cases/${id}`);
      setCases(cases.filter((caseItem) => caseItem._id !== id));
    } catch (error) {
      console.error('Failed to delete case:', error);
    }
  };

  return (
    <div>
      <h1>法律案例搜尋</h1>
      {user ? (
        <div>
          <button onClick={logout}>Logout</button>
          <div>
            <input
              type="text"
              value={newCase.title}
              onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
              placeholder="Title"
            />
            <textarea
              value={newCase.content}
              onChange={(e) => setNewCase({ ...newCase, content: e.target.value })}
              placeholder="Content"
            />
            <button onClick={handleAddCase}>Add Case</button>
          </div>
          <ul>
            {cases.map((caseItem) => (
              <li key={caseItem._id}>
                <h2>{caseItem.title}</h2>
                <p>{caseItem.content}</p>
                <button onClick={() => handleDeleteCase(caseItem._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <button onClick={() => login('testuser', 'testpassword')}>Login as testuser</button>
        </div>
      )}
    </div>
  );
};

export default CaseManager;
