const mongoose = require('mongoose');
const { schema } = require('./usuario');
const usuario = require('./usuario');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        require: [true, 'Este campo es obligatorio']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: usuario
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);