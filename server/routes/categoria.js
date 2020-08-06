const express = require('express');
var mongoose = require('mongoose');
const { checkToken, checkRol } = require('../middlewares/auth');

const app = express();

const Categoria = require('../models/categoria');

//Show all categories
app.get('/categoria', checkToken, (req, res) => {
    Categoria.find({ estado: true })
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({ estado: true }, (err, total) => {
                res.json({
                    ok: true,
                    categoryTotal: total,
                    categorias,
                })
            })
        })
})

//Show 1 category by ID
app.get('/categoria/:id', checkToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            if (err.kind === "ObjectId") {
                return res.status(404).json({
                    errors: [{
                        ok: false,
                        error: 'Categoria not found'
                    }, ],
                });
            }

            return res.status(500).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            usuario: categoria,
        })
    })
})

//Create new category
app.post('/categoria', [checkToken, checkRol], (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        estado: true
    })

    categoria.save((err, categoriaNueva) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaNueva
        })
    })
})


//Update a category
app.put('/categoria/:id', [checkToken, checkRol], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Categoria.findOneAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }), (err, categoriaUpdated) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaUpdated
        })
    }
})

//Delete a category



module.exports = app;