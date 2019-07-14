var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();


var Medico = require('../models/medico');

// ==============================
// Obtener Medicos
// ==============================

app.get('/', (req, res, next) => {

    Medico.find({})
    .populate('usuario', 'nombre email')
    .populate('hospital')
     .exec(

      (err, medicos) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando Medicos',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            medicos: medicos
        });


      });

    
});


// ==============================
// Create New Medico
// ==============================

app.post('/', (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,        
        usuario: body.usuario,
        hospital: body.hospital
    });

    medico.save( (err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al Add Medico',
                errors: err + ' ' + body.hospital
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,            
        });


    });


});

// ==============================
// Update Medico
// ==============================

app.put('/:id', mdAutenticacion.verificaToken,(req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById( id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error searching Medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error the medico with ID ' + id + ' does not exists',
                errors: { message: 'No existe un medico con ese id '}
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = body.usuario;
        medico.hospital = body.hospital;
        

        medico.save( (err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error to update Medico',
                    errors: err
                });
            }            

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });

    });

   

});

// ==============================
// Delete Ususario by ID
// ==============================
app.delete('/:id', mdAutenticacion.verificaToken,(req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoDelete) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error to delete Medico',
                errors: err
            });
        }

        if (!medicoDelete) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un medico con ese id',
                errors: { message: 'No existe un Medico con ese id '}
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoDelete
        });

    });

});




module.exports = app;