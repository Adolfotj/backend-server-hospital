var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();


var Hospital = require('../models/hospital');

// ==============================
// Obtener Hospitales
// ==============================

app.get('/', (req, res, next) => {

    Hospital.find({})
     .populate('usuario', 'nombre email')
     .exec(

      (err, hospitales) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando Hospitales',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            hospitales: hospitales
        });


      });

    
});

// ==============================
// Create New Hospital
// ==============================

app.post('/', mdAutenticacion.verificaToken,(req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: body.usuario
    });

    hospital.save( (err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error Add Hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: hospitalGuardado
        });


    });

    


});

// ==============================
// Update Hospital
// ==============================

app.put('/:id', mdAutenticacion.verificaToken,(req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById( id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error searching Hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error the hospital with ID ' + id + ' does not exists',
                errors: { message: 'No existe un hospital con ese id '}
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = body.usuario;
        

        hospital.save( (err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error to update Hospital',
                    errors: err
                });
            }            

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

    });

   

});

// ==============================
// Delete Ususario by ID
// ==============================
app.delete('/:id', mdAutenticacion.verificaToken,(req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalDelete) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error to delete Hospital',
                errors: err
            });
        }

        if (!hospitalDelete) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errors: { message: 'No existe un Hospital con ese id '}
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalDelete
        });

    });

});


module.exports = app;
