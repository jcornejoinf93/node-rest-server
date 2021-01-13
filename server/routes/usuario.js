const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario')

const app = express();

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

app.get('/usuario', verificaToken, (req, res) => {

    return res.json({
        usuario: req.usuario,
        email: req.usuario.email,
        nombre: req.usuario.nombre
    });

    let desde = req.query.desde || 0;
    let hasta = req.query.hasta || 5;
    desde = Number(desde);
    hasta = Number(hasta);

    //Primer argumento, criterio de búsqueda
    //segundo argumento, los campos que quiero mostrar como respuesta
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(hasta)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //Primer argumento, define el criterio de búsqueda
            Usuario.count({ estado: true }, (err, conteo) => {
                return res.json({
                    ok: true,
                    conteo,
                    usuarios
                });
            });

        });
});


app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioBD) => {

        //usuarioBD.password = null;

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            usuario: usuarioBD
        })

    });

});

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])

    //delete body.password;
    //delete body.google;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            usuario: usuarioBD
        })

    });

});

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (usuarioBorrado === null) {
            return res.json({
                ok: false,
                err: {
                    mensaje: 'Usuario no encontrado'
                }
            });
        }

        return res.json({
            ok: true,
            usuarioBorrado
        });
    });

    // Usuario.findByIdAndRemove(id, (err, usuarioDelete) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (usuarioDelete === null) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuarioDelete
    //     });
    // });

});

module.exports = app;