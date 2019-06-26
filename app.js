// Requires
var express = require('express');
var mongoose = require('mongoose');


// Inicializar variables
var app = express();

// Conexion Db base date
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDb', (err, res) => {
    if(err) throw err;
    console.log('Data Base : \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: "Peticion realizada"
    });
});


// Listened peticiones
app.listen(3000, () => {
    console.log('Express Server online puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});