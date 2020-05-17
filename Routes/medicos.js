var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var MedicosModels = require('../Models/medicos');
var HospitalModels = require('../Models/hospital');
var app = express();

//**************************************************************** */
// Obtener todos los Medicos
//**************************************************************** */
app.get('/', (req, res, next) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    MedicosModels.find({}, 'nombre img usuario hospital')
        .skip(desde)
        .populate('usuario', 'nombre correo')
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando los medicos',
                        errors: err
                    });
                }
                MedicosModels.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        data: medicos,
                        total: conteo,
                    });
                });
            });
});

//**************************************************************** */
// Verificar Token
//**************************************************************** */



//**************************************************************** */
// Crear un nuevo Medico
//**************************************************************** */


app.post('/create', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var IdHospital = body.hospital
    HospitalModels.findById(IdHospital, (err, DBHospital) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Hospital seleccionado no existe',
                errors: err
            });
        }
        if (!DBHospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id:' + IdHospital + ' no existe',
                errors: { mensaje: 'No existe un hospital con ese ID ' },
            });
        }
        var Medico = new MedicosModels({
            nombre: body.nombre,
            usuario: req.usuario._id,
            hospital: DBHospital._id

        });
        Medico.save((err, MedicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear el medico',
                    errors: err
                });
            }
            res.status(201).json({
                ok: true,
                data: MedicoGuardado
            })
        });
    });
});

//**************************************************************** */
// Actualizar un Hospital
//**************************************************************** */

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    var IdHospital = body.hospital

    MedicosModels.findById(id, (err, DBMedico) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar el hospital',
                errors: err
            });
        }
        if (!DBMedico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id:' + id + ' no existe',
                errors: { mensaje: 'No existe un hospital con ese ID ' },
            });
        }
        (!body.nombre) ? '' : DBMedico.nombre = body.nombre;

        if (!body.hospital) {} else {
            HospitalModels.findById(IdHospital, (err, DBHospital) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El Hospital seleccionado no existe',
                        errors: err
                    });
                }
                if (!DBHospital) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El hospital con el id:' + IdHospital + ' no existe',
                        errors: { mensaje: 'No existe un hospital con ese ID ' },
                    });
                }
                DBMedico.hospital = DBHospital._id
            });
        }


        DBMedico.save((err, MedicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al alctualizar el hospital',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                data: MedicoGuardado
            })

        });
    });

});

//**************************************************************** */
// Borrar un usuario
//**************************************************************** */

app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;
    MedicosModels.findByIdAndRemove(id, (err, DBMedico) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar el medico',
                errors: err
            });
        }
        if (!DBMedico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id:' + id + ' no existe',
                errors: { mensaje: 'No existe un medico con ese ID ' },
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'El medico con el id:' + id + ' fue borrado exitosamente',
            data: DBMedico
        })
    });
});


function buscarHospital(IdHospital) {

};


module.exports = app;