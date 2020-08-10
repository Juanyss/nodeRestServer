const express = require('express');

const { checkToken } = require('../middlewares/auth');
const Producto = require('../models/producto');


const app = express();


//Get all products
app.get('/productos', checkToken, (req, res) => {
    //Get all products
    //populate: usuario and categoria
    //paginado    
    let desde = req.body.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde).limit(3)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, total) => {
                res.json({
                    ok: true,
                    productTotal: total,
                    productos,
                })
            })
        })


})

//Get 1 products by ID
app.get('/productos/:id', checkToken, (req, res) => {
    //Get all products
    //populate: usuario and categoria
    //paginado

    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                if (err.kind === "ObjectId") {
                    return res.status(400).json({ ok: false, err: 'Id not valid' });
                }

                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.status(404).json({
                    ok: false,
                    err: 'Product not found'
                });
            }

            res.json({
                ok: true,
                producto,
            })
        })
})

//Search Products
app.get('/productos/buscar/:termino', checkToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ descripcion: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ descripcion: regex }, (err, total) => {
                res.json({
                    ok: true,
                    productTotal: total,
                    productos,
                })
            })


        })
})

//Post 1 products 
app.post('/productos', checkToken, (req, res) => {
    //Get user
    //save category
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id,
    })

    producto.save((err, newProducto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: newProducto
        })
    })
})

//Update 1 products by ID
app.put('/productos/:id', checkToken, (req, res) => {
    //Update product
    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' },
        (err, productoUpdated) => {
            if (err) {
                if (err.kind === "ObjectId") {
                    return res.status(400).json({ ok: false, err: 'Id not valid' });
                }

                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoUpdated) {
                return res.status(404).json({
                    ok: false,
                    err: 'Product not found'
                });
            }


            return res.json({
                ok: true,
                categoria: productoUpdated
            })
        })
})


//Delete 1 products by ID
app.delete('/productos/:id', checkToken, (req, res) => {
    //Update estado product (true => false)
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true, context: 'query' },
        (err, productoUpdated) => {
            if (err) {
                if (err.kind === "ObjectId") {
                    return res.status(400).json({ ok: false, err: 'Id not valid' });
                }

                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoUpdated) {
                return res.status(404).json({
                    ok: false,
                    err: 'Product not found'
                });
            }

            return res.json({
                ok: true,
                categoria: productoUpdated
            })
        })
})






module.exports = app;