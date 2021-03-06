const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { checkToken, checkRol } = require('../middlewares/auth')

const app = express();

app.get('/usuario', checkToken, (req, res) => {



    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite)

    Usuario.find({ estado: true }, 'nombre email img rol estado')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, total) => {
                res.json({
                    ok: true,
                    usersTotal: total,
                    usuarios,
                })
            })


        })

});

app.post('/usuario', [checkToken, checkRol], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        rol: body.rol
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});

app.put('/usuario/:id', [checkToken, checkRol], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'rol', 'estado']);


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            if (err.kind === "ObjectId") {
                return res.status(400).json({ ok: false, err: 'Id not valid' });
            }

            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                err: 'User not found'
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB,
        })
    });

});

app.delete('/usuario/:id', [checkToken, checkRol], (req, res) => {
    let id = req.params.id;
    newEstado = { estado: false }

    Usuario.findByIdAndUpdate(id, newEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            if (err.kind === "ObjectId") {
                return res.status(400).json({ ok: false, err: 'Id not valid' });
            }

            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(404).json({
                ok: false,
                err: 'User not found'
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado,
        })
    });
});

module.exports = app;