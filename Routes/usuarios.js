var express = require('express');
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('../middlewares/autenticacion');
var Usuario = require('../Models/usuario');
var app = express();

//**************************************************************** */
// Obtener un usuario
//**************************************************************** */
app.get('/', (req, res, next) => {
    Usuario.find({}, 'nombre correo img rol').exec(
        (err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                data: usuarios
            });
        });
});

//**************************************************************** */
// Verificar Token
//**************************************************************** */



//**************************************************************** */
// Crear todos los usuarios
//**************************************************************** */


app.post('/create', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        correo: body.correo,
        contraseña: bcrypt.hashSync(body.contraseña, 8),
        img: body.img,
        rol: body.rol,

    });
    usuario.save((err, UsuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            data: UsuarioGuardado
        })
    });
});

//**************************************************************** */
// Actualizar un usuario
//**************************************************************** */

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (err, DbUsuario) => {
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
                mensaje: 'El usuario con el id:' + id + ' no existe',
                errors: { mensaje: 'No existe un usuario con ese ID ' },
            });
        }
        (!body.nombre) ? '' : DbUsuario.nombre = body.nombre;
        (!body.correo) ? '' : DbUsuario.correo = body.correo;
        (!body.rol) ? '' : DbUsuario.rol = body.rol;
        DbUsuario.save((err, UsuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al alctualizar el usuario',
                    errors: err
                });
            }
            UsuarioGuardado.contraseña = null;
            res.status(200).json({
                ok: true,
                data: UsuarioGuardado
            })

        });
    });

});

//**************************************************************** */
// Borrar un usuario
//**************************************************************** */

app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, DbUsuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar el usuario el usuario para eliminarlo',
                errors: err
            });
        }
        if (!DbUsuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id:' + id + ' no existe',
                errors: { mensaje: 'No existe un usuario con ese ID ' },
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'El usuario con el id:' + id + ' fue borrado exitosamente',
            data: DbUsuario
        })
    });
});

module.exports = app;