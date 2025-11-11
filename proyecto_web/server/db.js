const mongoose = require('mongoose');

// CONEXIÓN LOCAL
const uri = 'mongodb://127.0.0.1:27017/logistica';

mongoose.connect(uri)
  .then(() => console.log('MongoDB Local conectado'))
  .catch(err => console.error('Error MongoDB:', err));

// MODELO DE PAQUETE
const PaqueteSchema = new mongoose.Schema({
  numeroGuia: String,
  destinatario: String,
  direccion: String,
  peso: Number,
  estado: String,
  historial: [{
    fecha: Date,
    ubicacion: String,
    lat: Number,
    lng: Number,
  }],
});

module.exports = mongoose.model('Paquete', PaqueteSchema);