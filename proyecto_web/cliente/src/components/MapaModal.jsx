import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { buscarPorGuia } from '../services/paquetes';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// FIX ICONOS LEAFLET
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ÚNICO MAPAMODAL
export default function MapaModal({ guia, onClose }) {
  const [paquete, setPaquete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await buscarPorGuia(guia);
        setPaquete(res.data);
      } catch (err) {
        console.error('Error al cargar paquete');
      } finally {
        setLoading(false);
      }
    };
    if (guia) cargar();
  }, [guia]);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando mapa...</div>;
  if (!paquete) return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Paquete no encontrado</div>;

  const posiciones = paquete.historial.map(h => [h.lat, h.lng]);
  const centro = posiciones[0] || [4.6097, -74.0817];

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px'
      }} 
      onClick={onClose}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }} 
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          padding: '15px 20px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#d35400' }}>
            Rastreo: {paquete.numeroGuia}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              fontSize: '18px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            X
          </button>
        </div>
        <div style={{ height: '500px' }}>
          <MapContainer center={centro} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <Polyline positions={posiciones} color="#e74c3c" weight={5} opacity={0.8} />
            {paquete.historial.map((h, i) => (
              <Marker key={i} position={[h.lat, h.lng]}>
                <Popup>
                  <strong>{h.ubicacion}</strong><br />
                  {new Date(h.fecha).toLocaleString('es-CO')}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <div style={{ padding: '10px 20px', textAlign: 'center', fontSize: '0.9rem', color: '#7f8c8d' }}>
          Última actualización: {new Date(paquete.historial[paquete.historial.length - 1].fecha).toLocaleString('es-CO')}
        </div>
      </div>
    </div>
  );
}