var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}
let usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    correo: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    contraseña: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
    rol: { type: String, required: false, default: 'USER_ROLE', enum: rolesValidos },
    google: { type: Boolean, default: false },
});

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe de ser unico' });
module.exports = mongoose.model('Usuario', usuarioSchema);