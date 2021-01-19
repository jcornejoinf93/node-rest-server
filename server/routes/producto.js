const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// ===========================
// Obtener todos los productos
// ===========================
app.get('/productos', (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado

    let desde = req.desde || 0;
    let hasta = req.hasta || 15;
    desde: Number;
    hasta: Number

    Producto.find({})
        .populate('usuario', 'nombre')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(hasta)
        .exec((err, listadoPro) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                Productos: listadoPro
            });
        });
});

// ===========================
// Obtener un productos x id
// ===========================
app.get('/productos/:id', (req, res) => {
    // populate usuario categoria
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto seleccionado, no existe'
                }
            });
        }

        return res.json({
            ok: true,
            productoDB
        });
    });
});

// ===========================
// Buscar productos
// ===========================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                productos
            });
        });
});

// ===========================
// Crear nuevo producto
// ===========================
app.post('/productos', verificaToken, (req, res) => {
    // grabar usuario
    // grabar categoria del listado
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            producto: productoDB
        });
    });

});

// ===========================
// Actualizar un productos x id
// ===========================
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;



    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                productoGuardado
            });

        });

    });

});

app.delete('/productos/:id', (req, res) => {
    // cambiar estado disponible a false
    let id = req.params.id;
    let body = req.body;

    let cambiaDisponible = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaDisponible, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            productoBorrado
        });
    });
});

module.exports = app;