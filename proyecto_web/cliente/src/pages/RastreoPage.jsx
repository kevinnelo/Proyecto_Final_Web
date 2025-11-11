import { useState } from 'react';
import { buscarPorGuia } from '../services/paquetes';
import MapaModal from '../components/MapaModal';
import './RastreoPage.css';

export default function RastreoPage() {
  const [guia, setGuia] = useState('');
  const [paquete, setPaquete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mostrarMapa, setMostrarMapa] = useState(false);

  const rastrear = async () => {
    if (!guia.trim()) {
      setError('Por favor ingresa un número de guía');
      return;
    }

    setLoading(true);
    setError('');
    setPaquete(null);

    try {
      const res = await buscarPorGuia(guia);
      setPaquete(res.data);
      setMostrarMapa(true);
    } catch (err) {
      setError('Paquete no encontrado. Verifica el número de guía.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rastreo-container">
      <div className="rastreo-card">
        <h1>Rastreo de Paquetes</h1>
        <p>Ingresa tu número de guía para ver el estado en tiempo real</p>

        <div className="input-group">
          <input
            type="text"
            placeholder="Ej: GUI123456"
            value={guia}
            onChange={(e) => setGuia(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && rastrear()}
          />
          <button onClick={rastrear} disabled={loading}>
            {loading ? 'Buscando...' : 'Rastrear'}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {paquete && (
          <div className="resultado">
            <div className="info-paquete">
              <h2>Guía: {paquete.numeroGuia}</h2>
              <p><strong>Destinatario:</strong> {paquete.destinatario}</p>
              <p><strong>Dirección:</strong> {paquete.direccion}</p>
              <p><strong>Peso:</strong> {paquete.peso} kg</p>
              <p><strong>Estado actual:</strong> 
                <span className={`estado ${paquete.estado.toLowerCase().replace(' ', '-')}`}>
                  {paquete.estado}
                </span>
              </p>
            </div>

            <button 
              className="btn-mapa"
              onClick={() => setMostrarMapa(true)}
            >
              Ver Mapa Completo
            </button>

            <div className="historial">
              <h3>Historial de Movimientos</h3>
              {paquete.historial.map((h, i) => (
                <div key={i} className="historial-item">
                  <div className="punto"></div>
                  <div>
                    <strong>{h.ubicacion}</strong>
                    <p>{new Date(h.fecha).toLocaleString('es-CO')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL DEL MAPA */}
      {mostrarMapa && paquete && (
        <MapaModal 
          guia={paquete.numeroGuia} 
          onClose={() => setMostrarMapa(false)} 
        />
      )}
    </div>
  );
}