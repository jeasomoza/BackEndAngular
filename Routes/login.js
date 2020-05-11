var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var app = express();
var Usuario = require('../Models/usuario');
var seed = require('../config/config').seed;

app.post('/', (req, res) => {
    var body = req.body;
    Usuario.findOne({ correo: body.correo }, (err, DbUsuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar el usuario',
                errors: err
            });
        }
        if (!DbUsuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El correo ingresado no es el correcto',
                errors: err,
            });
        }
        if (!bcrypt.compareSync(body.contraseña, DbUsuario.contraseña)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La contraseña ingresada no es la correcta',
                errors: err,
            });
        }
        var token = jwt.sign({ usuario: DbUsuario }, seed, { expiresIn: 21600 });
        DbUsuario.contraseña = null;
        res.status(200).json({
            ok: true,
            messaje: 'Bienvenido al registro',
            data: DbUsuario,
            token: token
        });
    });
});




module.exports = app;