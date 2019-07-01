var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();


var Usuario = require('../models/usuario');

// ==============================
// Obtener Ususarios
// ==============================

app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
     .exec(

      (err, usuarios) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando Usuarios',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            usuarios: usuarios
        });


      });

    
});



// ==============================
// Create New Ususario
// ==============================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save( (err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error Add Usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });


    });

    


});

// ==============================
// Update Ususario
// ==============================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById( id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error searching User',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error the User with ID ' + id + ' does not exists',
                errors: { message: 'No existe un ususario con ese id '}
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( (err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error to update User',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

   

});

// ==============================
// Delete Ususario by ID
// ==============================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioDelete) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error to delete User',
                errors: err
            });
        }

        if (!usuarioDelete) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un user con ese id',
                errors: { message: 'No existe un ususario con ese id '}
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioDelete
        });

    });

});

module.exports = app;