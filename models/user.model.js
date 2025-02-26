const {Schema, model} = require('mongoose');

const userSchema = Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
})

module.exports = model('Users', userSchema);