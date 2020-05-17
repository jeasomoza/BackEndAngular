var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

let HostpitalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

HostpitalSchema.plugin(uniqueValidator, { message: 'El {PATH} debe de ser unico' });
module.exports = mongoose.model('Hospital', HostpitalSchema);