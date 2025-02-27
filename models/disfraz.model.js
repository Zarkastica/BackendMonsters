const mongoose = require('mongoose')
const DisfrazSchema = mongoose.Schema({
    nombre: {
        type: String,
        default: true
    },
    talla:{
        type: String,
        required: true
    },
    color:{
        type: String,
        required: true
    },
    precio:{
        type: String,
        required:true
    },
    categoria:{ //referencia a la categoria
        type: mongoose.Types.ObjectId, ref: "Categorias",
        required: true
    },
    imagen:{ //ruta de la imagen
        type: String,
        required: true
    }

})
module.exports = mongoose.model('Disfraces', DisfrazSchema)