const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//===============================
// Mostrar todas las categorias
//================================
app.get('/categoria', (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, listado) => {
            if (err) {
                return res.status.json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                listado
            });
        });

});

//===============================
// Mostrar una categoria por ID
//================================
app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'id no valid'
                }
            });
        }

        return res.json({
            ok: true,
            categoriaDB
        });
    });

});

//===============================
// Registra categoria
//================================
//verificaToken
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoriaDB
        });
    });
});

//===============================
// Modifica una categoria
//================================
app.put('/categoria/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoriaDB
        });
    });
});


//===============================
// Elimina una categoria por ID
//================================
//,
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // solo el adm puede borrar
    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaDelete) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encuentra el id en base de datos'
                }
            });
        }

        return res.json({
            ok: true,
            eliminada: categoriaDelete
        });
    });
});

module.exports = app;