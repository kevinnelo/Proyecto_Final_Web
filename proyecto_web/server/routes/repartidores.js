const express = require('express');
const router = express.Router();

// Simulación de datos + repartidores en movimiento
let repartidores = [
    { id: 1, lat: -12.0464, lng: -77.0428, paqueteGuia: 'ABC123' },
    { id: 2, lat: -12.0710, lng: -77.0150, paqueteGuia: 'DEF456' },
];

// Simula movimiento
setInterval(() => {
    repartidores = repartidores.map(r => ({
        ...r,
        lat: r.lat + (Math.random() - 0.5) * 0.001,
        lng: r.lng + (Math.random() - 0.5) * 0.001,
    }));
}, 7000);

router.get('/ubicaciones', (req, res) => {
    res.json(repartidores);
});

module.exports = router;