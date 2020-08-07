const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Usuario = require('../models/usuario');
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: true
    },
    usuario: {
        type: String,
        required: true,
        ref: Usuario
    },
    estado: {
        type: Boolean,
        default: true,
    }
})



module.exports = mongoose.model('Categoria', categoriaSchema);