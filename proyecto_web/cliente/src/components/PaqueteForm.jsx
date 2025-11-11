import { useState } from 'react';
import { crearPaquete } from '../services/paquetes';

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

  
  if (!form.destinatario || !form.direccion || !form.peso) {
    alert('Por favor completa todos los campos');
    return;
  }
  
  try {
    await crearPaquete(form);
    alert('Paquete creado con éxito');

    // LIMPIAR
    setForm({ destinatario: '', direccion: '', peso: '' });

    // LIMPIAR MAPA
    if (onPaqueteCreado) onPaqueteCreado();

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