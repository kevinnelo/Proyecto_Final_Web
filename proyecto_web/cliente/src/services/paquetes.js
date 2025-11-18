//Accede al backend para gestionar paquetes
import api from './api';

// Crear paquete
export const crearPaquete = (data) => api.post('/paquetes', data);

// Obtener todos
export const obtenerPaquetes = () => api.get('/paquetes');

// Buscar por guía
export const buscarPorGuia = (guia) => api.get(`/paquetes/${guia}`);

// Actualizar estado
export const actualizarEstado = (id, estado) =>
    api.put(`/paquetes/${id}`, { estado });

//Utilizamos fetch para eliminar paquete
export const eliminarPaquete = async (id) => {
  const res = await fetch(`http://localhost:5000/api/paquetes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar');
  return res.json();
};

