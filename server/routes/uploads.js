const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

app.use(fileUpload({ useTempFiles: true }));

const Usuario = require('../models/usuario');

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
    } else {
        archivo.mv(`uploads/${tipo}/${nuevoNombre}`, (err) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            imagenUsuario(id, res, nuevoNombre);

        });
    }

})

function imagenUsuario(id, res, nuevoNombre) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }
        usuarioDB.imagenUsuario = nuevoNombre;

        usuarioDB.save((err, usuarioSave) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            res.json({
                ok: true,
                usuarioSave,
                img: nuevoNombre
            })
        })

    })
}

module.exports = app;