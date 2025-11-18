import { useState } from 'react';
import { crearPaquete } from '../services/paquetes';

//Formulario para Crear un nuevo paquete
export default function PaqueteForm({ onPaqueteCreado }) {
  const [form, setForm] = useState({
    destinatario: '',
    direccion: '',
    peso: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();

  //Valida que los campos del formulario esten completos
  if (!form.destinatario || !form.direccion || !form.peso) {
    alert('Por favor completa todos los campos');
    return;
  }
  
  //Lama la funcion del backend para crear un paquete
  try {
    await crearPaquete(form);
    alert('Paquete creado con éxito');

    // el formulario despues del registro
    setForm({ destinatario: '', direccion: '', peso: '' });

    // LIMPIAR MAPA
    if (onPaqueteCreado) onPaqueteCreado();

    //si falla el llamado al backend igual se limpia el formulario
  } catch (err) {
    setForm({ destinatario: '', direccion: '', peso: '' });
  }


    if (typeof onPaqueteCreado === 'function') {
      onPaqueteCreado();
}
  };
    

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h2>Crear Paquete</h2>
      <input
        placeholder="Destinatario"
        value={form.destinatario}
        onChange={(e) => setForm({ ...form, destinatario: e.target.value })}
        disabled={loading}
      />
      <input
        placeholder="Dirección"
        value={form.direccion}
        onChange={(e) => setForm({ ...form, direccion: e.target.value })}
        disabled={loading}
      />
      <input
        type="number"
        placeholder="Peso (kg)"
        value={form.peso}
        onChange={(e) => setForm({ ...form, peso: e.target.value })}
        disabled={loading}
        step="0.1"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Paquete'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}