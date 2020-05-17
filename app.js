// Requires
const express = require('express');
const mongoose = require('mongoose');
const AppRoutes = require('./Routes/app');
const UsuariosRoutes = require('./Routes/usuarios');
const LoginRoutes = require('./Routes/login');
const HospitalRoutes = require('./Routes/hospital');
const MedicosRoutes = require('./Routes/medicos');
const BusquedasRoutes = require('./Routes/busquedas');
const UploadRoutes = require('./Routes/upload');
const ImagenRoutes = require('./Routes/imagenes');
const bodyParser = require('body-parser')
    // Inicializar variabls
const app = express();

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

// Server Index Config
const serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Rutas
app.use('/usuarios', UsuariosRoutes);
app.use('/hospitales', HospitalRoutes);
app.use('/medicos', MedicosRoutes);
app.use('/login', LoginRoutes);
app.use('/busqueda', BusquedasRoutes);
app.use('/upload', UploadRoutes);
app.use('/img', ImagenRoutes);
app.use('/', AppRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express serve puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});