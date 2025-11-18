import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { buscarPorGuia } from '../services/paquetes';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
  margin: '20px 0'
};

//Llama numero de guia como prop
export default function MapaOpenStreetMap({ numeroGuia }) {
  const [paquete, setPaquete] = useState(null);
  const [loading, setLoading] = useState(true);

  //Carga Guia desde el BackeEnd
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

  if (loading) return <p style={{ textAlign: 'center' }}>Cargando mapa...</p>;
  if (!paquete) return <p style={{ textAlign: 'center', color: 'red' }}>Paquete no encontrado</p>;

  //Procesar centro del mapa
  const posiciones = paquete.historial.map(h => [h.lat, h.lng]);
  const centro = posiciones[posiciones.length - 1] || [4.6097, -74.0817];

  return (
    <div>
      <h3 style={{ textAlign: 'center', color: '#d35400', margin: '10px 0' }}>
        Rastreo: {paquete.numeroGuia}
      </h3>
      <MapContainer center={centro} zoom={13} style={containerStyle}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {/* Crea una linea roja entre cada punto del historial */}
        <Polyline
          positions={posiciones}
          color="#e74c3c"
          weight={5}
          opacity={0.8}
        />
        {/* Muestra cada punto por cada punto del historial */}
        {paquete.historial.map((h, i) => (
          <Marker key={i} position={[h.lat, h.lng]}>
            <Popup>
              <strong>{h.ubicacion}</strong><br />
              {new Date(h.fecha).toLocaleString('es-CO')}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#7f8c8d', marginTop: '10px' }}>
        Última actualización: {new Date(paquete.historial[paquete.historial.length - 1].fecha).toLocaleString('es-CO')}
      </p>
    </div>
  );
}