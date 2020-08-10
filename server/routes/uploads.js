const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

app.use(fileUpload());

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;



    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'files not selected'
        });
    }

    //Validar tipo de imagen
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            error: `Tipe ${tipo} not allowed`,
            typesAllowed: tiposValidos.join(', ')
        })
    }


    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];

    //Cambiar nombre
    let nuevoNombre = `${id}-${new Date().getMilliseconds()}.${extension}`

    //Extensions permited
    let extensionesPermitidas = ['jpg', 'png', 'gif', 'jpeg'];
    if (extensionesPermitidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            error: `Extension ${extension} not allowed`,
            extensionsAllowed: extensionesPermitidas.join(', ')
        })
    }


    if (tipo === 'usuarios') {
        saveUser(id, archivo, nuevoNombre, tipo, res);
    } else if (tipo === 'productos') {
        saveProduct(id, archivo, nuevoNombre, tipo, res);
    }


})




function deleteImage(imageName, type) {
    //Path to delete old image
    let pathImagen = path.resolve(__dirname, `../../uploads/${type}/${imageName}`)
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

function saveUser(id, archivo, nuevoNombre, tipo, res) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            if (err.kind === "ObjectId") {
                return res.status(400).json({ ok: false, err: 'Id not valid' });
            }
            return res.status(500).json({ ok: false, err });
        }

        if (!usuarioDB) {
            return res.status(404).json({ ok: false, err: 'User not found' });
        }

        //Path to delete old image
        deleteImage(usuarioDB.img, tipo);
        usuarioDB.img = nuevoNombre;

        usuarioDB.save((err, usuarioSave) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            archivo.mv(`uploads/${tipo}/${nuevoNombre}`, (err) => {
                if (err) {
                    return res.status(500).json({ ok: false, err });
                }

                res.json({
                    ok: true,
                    usuarioSave,
                    img: nuevoNombre
                })
            });
        })
    })
}

function saveProduct(id, archivo, nuevoNombre, tipo, res) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            if (err.kind === "ObjectId") {
                return res.status(400).json({ ok: false, err: 'Id not valid' });
            }
            return res.status(500).json({ ok: false, err });
        }

        if (!productoDB) {
            return res.status(404).json({ ok: false, err: 'Product not found' });
        }

        //Path to delete old image
        deleteImage(productoDB.img, tipo);
        productoDB.img = nuevoNombre;

        productoDB.save((err, productoSave) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            archivo.mv(`uploads/${tipo}/${nuevoNombre}`, (err) => {
                if (err) {
                    return res.status(500).json({ ok: false, err });
                }

                res.json({
                    ok: true,
                    productoSave,
                    img: nuevoNombre
                })
            });
        })
    })
}

module.exports = app;