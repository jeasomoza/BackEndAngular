const express = require('express');
const mdAutenticacion = require('../middlewares/autenticacion');
const app = express();
const path = require('path');
const fs = require('fs-extra');

app.get('/:coleccion/:img', mdAutenticacion.verificaToken, (req, res, next) => {
    const coleccion = req.params.coleccion;
    const img = req.params.img;
    const PathImg = path.resolve(__dirname, `../uploads/${coleccion}/${img}`)
    if (fs.existsSync(PathImg)) {
        res.sendFile(PathImg);
    } else {
        const pathNoImage = path.resolve(__dirname, `../assets/no-img.jpg`)
        res.sendFile(pathNoImage);
    }
});
module.exports = app;