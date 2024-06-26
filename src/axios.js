import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5002', // 後端伺服器的基礎 URL
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default instance;
