import { useState, useEffect } from 'react';
import { obtenerPaquetes, actualizarEstado } from '../services/paquetes';
import MapaModal from './MapaModal'; // ← IMPORTA EL MODAL

export default function PaquetesTable({ onCopiarGuia, onSeleccionarGuia, onEliminarPaquete }) {
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapaAbierto, setMapaAbierto] = useState(null);

  useEffect(() => {
    cargar();
    const interval = setInterval(cargar, 10000);
    return () => clearInterval(interval);
  }, []);

  const cargar = async () => {
    try {
      const res = await obtenerPaquetes();
      setPaquetes(res.data);
    } catch (err) {
      console.error('Error al cargar paquetes');
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (mongoId, nuevoEstado) => {
    try {
      const res = await actualizarEstado(mongoId, nuevoEstado);
      setPaquetes(paquetes.map(p => 
        p._id.toString() === mongoId ? res.data : p
      ));
    } catch (err) {
      alert('Error al actualizar estado');
    }
  };

  if (loading) return <p>Cargando paquetes...</p>;

  return (
    <>
      {/* TABLA DE PAQUETES */}
      <div className="lista-card">
        <h2>Paquetes ({paquetes.length})</h2>
        {paquetes.length === 0 ? (
          <p>No hay paquetes</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Guía</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Destinatario</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Estado</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {paquetes.map(p => (
                <tr key={p._id}>
                  <td style={{ padding: '10px' }}>
                    <button
                      className="copiar-btn"
                      onClick={() => onCopiarGuia(p.numeroGuia)}
                    >
                      {p.numeroGuia}
                    </button>
                    <button
                      className="mapa-btn"
                      onClick={() => setMapaAbierto(p.numeroGuia)}
                      style={{ marginLeft: '8px' }}
                    >
                      Ver Mapa
                    </button>
                  </td>
                  <td style={{ padding: '10px' }}>{p.destinatario}</td>
                  <td style={{ padding: '10px' }}>{p.estado}</td>
                  <td style={{ padding: '10px' }}>
                    <select
                      value={p.estado}
                      onChange={(e) => cambiarEstado(p._id, e.target.value)}
                      style={{ marginRight: '8px' }}
                    >
                      <option value="En bodega">En bodega</option>
                      <option value="En tránsito">En tránsito</option>
                      <option value="Entregado">Entregado</option>
                    </select>
                    <button
                      className="eliminar-btn"
                      onClick={() => onEliminarPaquete(p._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL INDEPENDIENTE */}
      {mapaAbierto && (
        <MapaModal 
          guia={mapaAbierto} 
          onClose={() => setMapaAbierto(null)} 
        />
      )}
    </>
  );
}