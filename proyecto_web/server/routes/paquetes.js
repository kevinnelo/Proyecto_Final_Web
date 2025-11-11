const express = require('express');
const router = express.Router();
const NodeGeocoder = require('node-geocoder');
const Paquete = require('../db');

// GEOCODER GRATIS: OpenStreetMap
const geocoder = NodeGeocoder({
  provider: 'openstreetmap'
});

// GEOCODIFICAR DIRECCIÓN REAL
async function geocodeAddress(address) {
  try {
    const res = await geocoder.geocode(address + ', Bogotá, Colombia');
    if (res && res[0]) {
      return { lat: res[0].latitude, lng: res[0].longitude };
    }
  } catch (err) {
    console.error('Error geocodificando:', err.message);
  }
  // Fallback: centro de Bogotá
  return { lat: 4.6097, lng: -74.0817 };
}

// CREAR PAQUETE
router.post('/', async (req, res) => {
  try {
    const { destinatario, direccion, peso } = req.body;
    if (!destinatario || !direccion || !peso) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const coords = await geocodeAddress(direccion);

    const nuevoPaquete = new Paquete({
      numeroGuia: `GUI${Date.now().toString().slice(-6)}`,
      destinatario,
      direccion,
      peso,
      estado: 'En bodega',
      historial: [
        {
          fecha: new Date(),
          ubicacion: 'Bodega Central',
          lat: coords.lat,
          lng: coords.lng,
        },
      ],
    });

    const guardado = await nuevoPaquete.save();
    res.status(201).json(guardado);
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// ACTUALIZAR ESTADO
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const paquete = await Paquete.findById(id);
    if (!paquete) return res.status(404).json({ error: 'No encontrado' });

    if (!['En bodega', 'En tránsito', 'Entregado'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    paquete.estado = estado;

    const nuevasCoords = {
      'En bodega': { lat: 4.6097, lng: -74.0817 },
      'En tránsito': { lat: 4.6500, lng: -74.0900 },
      'Entregado': { lat: 4.6762, lng: -74.0487 },
    };

    paquete.historial.push({
      fecha: new Date(),
      ubicacion: estado === 'Entregado' ? 'Destino final' : 'En ruta',
      lat: nuevasCoords[estado].lat,
      lng: nuevasCoords[estado].lng,
    });

    const actualizado = await paquete.save();
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: 'Error' });
  }
});

// OBTENER TODOS
router.get('/', async (req, res) => {
  const paquetes = await Paquete.find();
  res.json(paquetes);
});

// BUSCAR POR GUÍA
router.get('/:guia', async (req, res) => {
  const { guia } = req.params;
  const paquete = await Paquete.findOne({ numeroGuia: guia });
  if (!paquete) return res.status(404).json({ error: 'No encontrado' });
  res.json(paquete);
});

// ELIMINAR
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Paquete.findByIdAndDelete(id);
    if (!resultado) {
      return res.status(404).json({ error: 'Paquete no encontrado' });
    }
    res.json({ message: 'Paquete eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;