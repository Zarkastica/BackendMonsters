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
    }
    //como se guardaran las imagenes para que se muestren en el backed, otro modelo aca
    //se puede crear otro archivo o otro modelo para la categoria del disfraz. Profesor recomendo muller.
})
module.exports = mongoose.model('Disfraz', DisfrazSchema)