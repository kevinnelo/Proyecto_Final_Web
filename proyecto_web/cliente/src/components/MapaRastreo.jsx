import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { buscarPorGuia } from '../services/paquetes';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// FIX PARA ICONOS
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

//Busca paquete por numero de Guia
export default function MapaRastreo({ numeroGuia }) {
  const [paquete, setPaquete] = useState(null);
  const [loading, setLoading] = useState(true);

  //Carga Paquete por numero de Guia
  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await buscarPorGuia(numeroGuia);
        setPaquete(res.data);
      } catch (err) {
        console.error('Paquete no encontrado');
      } finally {
        setLoading(false);
      }
    };
    if (numeroGuia) cargar();
  }, [numeroGuia]);

  if (loading) return <p>Cargando mapa...</p>;
  if (!paquete) return <p>Paquete no encontrado</p>;

  //Convierte cada punto del mapa en una coordenada
  const posiciones = paquete.historial.map(h => [h.lat, h.lng]);
  //Define Centro del Mapa
  const centro = posiciones[posiciones.length - 1] || [4.6097, -74.0817]; // Bogotá

  return (
    <div style={{ height: '400px', margin: '20px 0', borderRadius: '12px', overflow: 'hidden' }}>
      <h3 style={{ margin: '0 0 10px', color: '#007bff', textAlign: 'center' }}>
        Rastreo: {paquete.numeroGuia}
      </h3>
      <MapContainer center={centro} zoom={13} style={{ height: '100%', width: '100%' }}>
        {/* OPENSTREETMAP - SIN RASTREO */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {/* Ruta de rastreo de color azul */}
        <Polyline positions={posiciones} color="blue" weight={4} opacity={0.7} />
        
        {/* Marca cada punto del historial */}
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
  );
}