var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var HospitalModels = require('../Models/hospital');
var app = express();

//**************************************************************** */
// Obtener todos los Hospitales
//**************************************************************** */
app.get('/', (req, res, next) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    HospitalModels.find({}, 'nombre img usuario')
        .skip(desde)
        .populate('usuario', 'nombre correo')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }
                HospitalModels.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        data: hospitales,
                        total: conteo,
                    });
                });
            });
});

//**************************************************************** */
// Verificar Token
//**************************************************************** */



//**************************************************************** */
// Crear un nuevo hospital
//**************************************************************** */


app.post('/create', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var Hospital = new HospitalModels({
        nombre: body.nombre,
        usuario: req.usuario._id

    });
    Hospital.save((err, HospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            data: HospitalGuardado
        })
    });
});

//**************************************************************** */
// Actualizar un Hospital
//**************************************************************** */

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    HospitalModels.findById(id, (err, DBHospital) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar el hospital',
                errors: err
            });
        }
        if (!DBHospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id:' + id + ' no existe',
                errors: { mensaje: 'No existe un hospital con ese ID ' },
            });
        }
        (!body.nombre) ? '' : DBHospital.nombre = body.nombre;

        DBHospital.save((err, HospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al alctualizar el hospital',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                data: HospitalGuardado
            })

        });
    });

});

//**************************************************************** */
// Borrar un usuario
//**************************************************************** */

app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;
    HospitalModels.findByIdAndRemove(id, (err, DBHospital) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar el hospital',
                errors: err
            });
        }
        if (!DBHospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id:' + id + ' no existe',
                errors: { mensaje: 'No existe un hospital con ese ID ' },
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'El hospital con el id:' + id + ' fue borrado exitosamente',
            data: DBHospital
        })
    });
});

module.exports = app;