const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const Usuario = require('../Models/usuario');
const seed = require('../config/config').seed;
const CLIENT_ID = require('../config/config').Id_Cliente;
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(CLIENT_ID);

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
        DbUsuario.contraseña = null;
        var token = jwt.sign({ usuario: DbUsuario }, seed, { expiresIn: 21600 });
        res.status(200).json({
            ok: true,
            messaje: 'Bienvenido al registro',
            data: DbUsuario,
            token: token
        });
    });
});

//******************************
// Autenticacion de Google
//******************************

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        correo: payload.email,
        imagen: payload.picture,
        google: true,

    }
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
}
app.post('/google', async(req, res) => {
    var token = req.body.token;
    const googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                mensaje: 'token no valido',
                error: e,
            });
        })

    Usuario.findOne({ correo: googleUser.correo }, 'nombre correo img rol google')
        .exec((err, recurso) => {
            // Si existe un error en la base de datos
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                });
            }
            // Si existe el usuario en la base de datos
            if (recurso) {
                if (recurso.google === false) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Debes usar tu autenticacion normal',

                    });
                } else {
                    var token = jwt.sign({ usuario: DbUsuario }, seed, { expiresIn: 21600 });
                    res.status(200).json({
                        ok: true,
                        messaje: 'Bienvenido al registro',
                        data: recurso,
                        token: token
                    });
                }

            } else {
                // Si no existe el usuario en la base de datos
                var usuario = new Usuario({
                    nombre: googleUser.nombre,
                    correo: googleUser.correo,
                    img: googleUser.imagen,
                    google: googleUser.google,
                    contraseña: ':)',
                });
                usuario.save((err, UsuarioGuardado) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al crear el usuario',
                            errors: err
                        });
                    }
                    var token = jwt.sign({ usuario: UsuarioGuardado }, seed, { expiresIn: 21600 });
                    res.status(200).json({
                        ok: true,
                        messaje: 'Bienvenido al registro',
                        data: UsuarioGuardado,
                        token: token
                    });
                });

            }

        });
});

module.exports = app;