const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');
const app = express();
const HospitalModels = require('../Models/hospital');
const MedicosModels = require('../Models/medicos');
const UsuarioModels = require('../Models/usuario');
const mdAutenticacion = require('../middlewares/autenticacion');


// default options
app.use(fileUpload());


app.put('/:coleccion/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    const idColecction = req.params.id;
    const coleccion = req.params.coleccion;
    const TiposColecciones = ['hospitales', 'medicos', 'usuarios'];

    if (TiposColecciones.indexOf(coleccion) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'La coleccion a actualizar no es valida',
            errors: { mensaje: 'los tipos de colecciones disponibles son: hospitales, medicos, usuarios' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Por favor selecciona un archivo',
            errors: { mensaje: 'Por favor, selecciona un archivo' }
        });
    }
    if (!req.files.imagen) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Por favor el campo que mandas se tiene que llamar imagen',
            errors: { mensaje: 'Por favor el campo que mandas se tiene que llamar imagen' }
        });
    }

    // Obtener nombre del archivo de
    var archivo = req.files.imagen
    var NombreCortado = archivo.name.split('.');
    let ExtencionArchivo = NombreCortado[NombreCortado.length - 1]
    const ExtencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (ExtencionesValidas.indexOf(ExtencionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'La extencion del archivo no es valida',
            errors: { mensaje: 'Por favor manda un archivo con alguna de la exteciones: png, jpg, gif o jpeg' }
        });
    }

    const NombreArchivo = `${ idColecction }-${ new Date().getMilliseconds() }.${ ExtencionArchivo }`;
    var path = `./uploads/${ coleccion }/${ NombreArchivo }`

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El archivo no se logro guardar exitosamente',
                errors: err
            });
        }
        subirPorTipo(coleccion, idColecction, NombreArchivo, res);
    });


});

function subirPorTipo(coleccion, idColecction, NombreArchivo, res) {
    if (coleccion === 'usuarios') {
        UsuarioModels.findById(idColecction, 'nombre correo img', (err, usuario) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al buscar al usuario',
                    errors: err
                });
            }
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con el id:' + idColecction + ' no existe',
                    errors: { mensaje: 'No existe un usuario con ese ID ' },
                });
            }
            var pathViejo = './uploads/usuarios/' + usuario.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = NombreArchivo;
            usuario.save((err, UsuarioActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error actualizar el usuarios',
                        errors: err
                    });
                };
                return res.status(200).json({
                    status: true,
                    mensaje: 'La imagen del usuario fue guardado correctamente',
                    data: UsuarioActualizado
                });
            });
        });
    }
    if (coleccion === 'medicos') {
        MedicosModels.findById(idColecction, 'nombre img usuario hospital')
            .populate('usuario', 'nombre correo')
            .populate('hospital')
            .exec((err, medico) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al buscar al medico',
                        errors: err
                    });
                }
                if (!medico) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El medico con el id:' + idColecction + ' no existe',
                        errors: { mensaje: 'No existe un medico con ese ID ' },
                    });
                }
                var pathViejo = './uploads/medicos/' + medico.img;
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }

                medico.img = NombreArchivo;
                medico.save((err, medicoActualizado) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error actualizar el medicos',
                            errors: err
                        });
                    };
                    return res.status(200).json({
                        status: true,
                        mensaje: 'La imagen del medico fue guardado correctamente',
                        data: medicoActualizado
                    });
                });
            });
    }
    if (coleccion === 'hospitales') {
        HospitalModels.findById(idColecction, 'nombre img usuario')
            .populate('usuario', 'nombre correo')
            .exec((err, hospital) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al buscar al hospital',
                        errors: err
                    });
                }
                if (!hospital) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El hospital con el id:' + idColecction + ' no existe',
                        errors: { mensaje: 'No existe un hospital con ese ID ' },
                    });
                }
                var pathViejo = './uploads/hospitales/' + hospital.img;
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }

                hospital.img = NombreArchivo;
                hospital.save((err, hospitalActualizado) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error actualizar el hospital',
                            errors: err
                        });
                    };
                    return res.status(200).json({
                        status: true,
                        mensaje: 'La imagen del hospital fue guardado correctamente',
                        data: hospitalActualizado
                    });
                });
            });
    }

}

module.exports = app;