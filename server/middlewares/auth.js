const jwt = require('jsonwebtoken');

//==============
//Check token
//==============

let checkToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;
        next();
    })
};

let checkRol = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.rol != 'ADMIN_ROL') {
        return res.status(403).json({
            ok: false,
            err: "You don't have the rol necesary for the task"
        })
    } else {
        next();
    }
}

module.exports = {
    checkToken,
    checkRol
}