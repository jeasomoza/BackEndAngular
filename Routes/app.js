var express = require('express');
var app = express();

app.get('/', (req, res, next) => {
    res.status(200).json({
        status: 'ok',
        mensaje: 'Peticion realizada correctamente'
    });
});
module.exports = app;