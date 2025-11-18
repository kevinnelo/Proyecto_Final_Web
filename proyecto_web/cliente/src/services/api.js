//Permite hacer peticiones HTTP al backend
import axios from 'axios';

//Se defne la direccion del backend de donde se realizaran peticiones
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
  //Interceptor de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;