const mongoose = require('mongoose')
const DisfrazSchema = mongoose.Schema({
    Nombre: {
        type: String,
        default: true
    },
    Talla:{
        type: String,
        required: true
    },
    Color:{
        type: String,
        required: true
    },
    Precio:{
        type: String,
        required:true
    },
    Categoria:{ //referencia a la categoria
        type: mongoose.Types.ObjectId, ref: "Categorias",
        required: true
    },
    Imagen:{ //ruta de la imagen
        type: String,
        required: true
    }

})
module.exports = mongoose.model('Disfraz', DisfrazSchema)