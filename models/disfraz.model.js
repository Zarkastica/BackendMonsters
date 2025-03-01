const mongoose = require('mongoose');

const DisfrazSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    talla: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Disfraz', DisfrazSchema);