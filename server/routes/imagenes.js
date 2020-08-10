const express = require('express');
const fs = require('fs');
const path = require('path');

const { checkTokenURL } = require('../middlewares/auth')

const app = express();

app.get('/imagen/:tipo/:img', checkTokenURL, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`)

    let noImage = path.resolve(__dirname, `../assets/no-image.jpg`)

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        res.sendFile(noImage);
    }

})



module.exports = app;