const {Schema, model} = require('mongoose');

const categoriaSchema = Schema({
    nombre:{
        type: String,
        required: true,
        unique: true
    }
})

module.exports = model('Categorias', categoriaSchema);