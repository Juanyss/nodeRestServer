require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const colors = require('colors');

const app = express();

const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));


//Configuracion global de rutas
app.use(require('./routes/index'));



mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    console.log(process.env.URLDB);
    if (err) throw colors.red(err);
    console.log(colors.green('Base de datos online'));
});

app.listen(process.env.PORT, () => {
    console.log(colors.green('Escuchando el puerto: ', process.env.PORT));
})