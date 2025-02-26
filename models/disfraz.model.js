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
    
})
module.exports = mongoose.model('Disfraz', DisfrazSchema)