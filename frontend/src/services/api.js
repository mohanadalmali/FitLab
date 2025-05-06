import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Flask backend'in çalıştığı adres
});

export default api;
