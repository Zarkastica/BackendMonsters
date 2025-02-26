const Disfraz = require('../models/disfraz.model')

exports.AgregarDisfraz = async (req, res) => {
    try {
        let data_Disfraz = new Disfraz(req.body)
        await data_Disfraz.save()
        res.send(data_Disfraz)
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error, contáctanos')
    }
}

exports.traerDisfraz = async (req, res)=>{
    try {
        let data_Disfraz = await Disfraz.find()
        res.json(data_Disfraz)
    
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error en el servidor')
    }
}


exports.traerDisfrazPorId = async (req,res) => {
    try {
        let data_Disfraz = await Disfraz.findById(req.params.id)
        if(!data_Disfraz){
            res.status(404).json({msg:'Producto no encontrado'})
        }
        res.json(data_Disfraz)
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error con el servidor :(')
        
    }
}

exports.actualizarDisfrazPorId = async (req,res) =>{
    try {
        let data_Disfraz = await Disfraz.findByIdAndUpdate(req.params.id,req.body)
        if(!data_Disfraz){
            res.status(404).json({msg:'Producto no encontrado'})
        }
        res.json(data_Disfraz)
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error con el servidor :(')
    }
}

exports.eliminarDisfrazPorId = async (req,res) =>{
    try {
        let data_Disfraz = await Disfraz.findByIdAndDelete(req.params.id)
        if(!data_Disfraz){
            res.status(404).json({msg:'Producto no encontrado'})
        }
        res.json(data_Disfraz)
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error con el servidor :(')
    }
}