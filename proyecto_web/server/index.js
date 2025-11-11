const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/paquetes', require('./routes/paquetes'));

app.get('/', (req, res) => {
    res.json({ message: 'Backend Logística FUNCIONANDO', status: 'OK' });
});

app.listen(5000, () => {
    console.log('Servidor corriendo en http://localhost:5000');
});