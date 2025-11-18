import { useState } from 'react';
import PaqueteForm from './components/PaqueteForm';
import PaquetesTable from './components/PaquetesTable';
import MapaOpenStreetMap from './components/MapaOpenStreetMap';
import { obtenerPaquetes, eliminarPaquete } from './services/paquetes';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RastreoPage from './pages/RastreoPage';
import './App.css';


function App() {
  const [guiaSeleccionada, setGuiaSeleccionada] = useState('');
  const [paquetes, setPaquetes] = useState([]);

  const copiarGuia = (guia) => {
    navigator.clipboard.writeText(guia);
    alert('¡Guía copiada: ' + guia);
  };

  const eliminarPaqueteLocal = async (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este paquete?')) {
      try {
        await eliminarPaquete(id);
        const res = await obtenerPaquetes();
        setPaquetes(res.data);
      } catch (err) {
        alert('Error al eliminar el paquete');
      }
    }
  };

    return (
    <>
      {/* NAVEGACIÓN */}
      <nav className="navbar">
        <Link to="/" className="nav-link">Admin</Link>
        <Link to="/rastreo" className="nav-link">Rastreo Público</Link>
      </nav>

      {/* RUTAS */}
      <Routes>
        {/* PÁGINA ADMIN */}
        <Route path="/" element={
          <div className="App">
            <header className="App-header">
              <h1>Logística App</h1>
              <p>Panel de Administración</p>
            </header>

            <div className="container">
              <PaqueteForm onPaqueteCreado={() => setGuiaSeleccionada('')} />
              <PaquetesTable 
                onCopiarGuia={copiarGuia}
                onEliminarPaquete={eliminarPaqueteLocal}
              />
            </div>

            {guiaSeleccionada && (
              <div className="mapa-container">
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <h3 style={{ margin: 0, color: '#d35400' }}>Rastreo en vivo</h3>
                  <button
                    onClick={() => setGuiaSeleccionada('')}
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Cerrar Mapa
                  </button>
                </div>
                <MapaOpenStreetMap numeroGuia={guiaSeleccionada} />
              </div>
            )}

          </div>
        } />

        {/* PÁGINA DE RASTREO PÚBLICO */}
        <Route path="/rastreo" element={<RastreoPage />} />
      </Routes>
    </>
  );
}

export default App;