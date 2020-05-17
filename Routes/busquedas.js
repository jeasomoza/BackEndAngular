var express = require('express');
var HospitalModels = require('../Models/hospital');
var MedicosModels = require('../Models/medicos');
var UsuarioModels = require('../Models/usuario');
var app = express();


//==================================================
//Busqueda General
//==================================================

app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    let regx = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospital(regx),
        buscarMedicos(regx),
        buscarUsuarios(regx),
    ]).then(respuestas => {
        res.status(200).json({
            status: 'ok',
            data: [{
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2],
            }]
        });
    })



});


//==================================================
//Busqueda Especifica
//==================================================

app.get('/coleccion/:donde/:busqueda', (req, res, next) => {
    const donde = req.params.donde;
    const busqueda = req.params.busqueda;
    let regx = new RegExp(busqueda, 'i');
    let promesa;
    switch (donde) {
        case 'usuarios':
            promesa = buscarUsuarios(regx);
            break;
        case 'medicos':
            promesa = buscarMedicos(regx);
            break;
        case 'hospitales':
            promesa = buscarHospital(regx);
            break;
        default:
            return res.status(400).json({
                status: false,
                mensaje: 'Los tipos de busqueda solo pueden ser: usuarios, medicos o hospitales y tu has elejido: ' + donde,
                error: { message: 'Tipo de tabla de busqueda no valida' }
            });
    }
    promesa.then(data => {
        res.status(200).json({
            status: true,
            data: data
        });
    })
});

function buscarHospital(regx) {
    return new Promise((resolve, reject) => {
        HospitalModels.find({ nombre: regx })
            .populate('usuario', 'nombre correo')
            .exec((err, Hospitales) => {
                if (err) {
                    reject('Error al cargar la busqueda de los hospitales', err);
                } else {
                    resolve(Hospitales);
                }
            });

    });
}

function buscarMedicos(regx) {
    return new Promise((resolve, reject) => {
        MedicosModels.find({ nombre: regx })
            .populate('usuario', 'nombre correo').exec((err, Medicos) => {
                if (err) {
                    reject('Error al cargar la busqueda de los Medicos', err);
                } else {
                    resolve(Medicos);
                }
            });

    });
}


function buscarUsuarios(regx) {
    return new Promise((resolve, reject) => {
        UsuarioModels.find({}, 'nombre correo rol').or(
            [
                { nombre: regx },
                { correo: regx },
            ]).exec(
            (err, Usuarios) => {
                if (err) {
                    reject('Error al cargar la busqueda de los Usuarios', err);
                } else {
                    resolve(Usuarios);
                }
            });

    });
}
module.exports = app;