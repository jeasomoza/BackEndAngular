// Requires
var express = require('express');
var mongoose = require('mongoose');
var AppRoutes = require('./Routes/app');
var UsuariosRoutes = require('./Routes/usuarios');
var LoginRoutes = require('./Routes/login');
var bodyParser = require('body-parser')
    // Inicializar variabls
var app = express();

// bodyParser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Conexion a la base de datos
mongoose.connect(
    'mongodb://localhost:27017/HospitalDB', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    },
    (err) => {
        if (err) throw err;
        console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
    });
// Rutas
app.use('/usuarios', UsuariosRoutes);
app.use('/login', LoginRoutes);
app.use('/', AppRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express serve puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});