const { generateToken } = require('../middlewares/jwtGenerate');
const User = require('./../models/user.model');

const getAllUsers = async (req,res) => {
    try {
        const users = await User.find();  
        return res.status(200).json({users});
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Hubo un error'});
    }
}

const createUser = async (req,res) =>{
    const {username,password} = req.body;
    if(!username || !password){
        return res.status(400).json({msg:'Ingrese usuario y contraseña'});
    }
    try {
        const user = await User.findOne({username});
        if(user){
            return res.status(400).json({msg:`El usuario ${username} ya existe`});
        }

        const nUser = new User({
            username: username,
            password: password
        });

        await nUser.save();
        
        return res.status(200).json({msg:'Usuario registrado exitosamente'});

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:'Error inesperado'})
    }
}

const loginUser = async (req,res) =>{
    const {username,password} = req.body;
    if(!username || !password){
        return res.status(400).json({msg:'Ingrese usuario y contraseña'});
    }

    try {
        const dbUser = await User.findOne({username});
        if(!dbUser){
            return res.status(400).json({
                msg: 'El usuario no existe'
            })
        }
        if(password !== dbUser.password){
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            })
        }

        const token = await generateToken(username, password);

        return res.status(200).json({
            msg: 'Sesion iniciada',
            token: token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:'Error inesperado'})
    }
}

const findUser = async(req,res) =>{
    const {username} = {username : req.params.id};
    if(!username){
        return res.status(400).json({msg:'Ingrese el usuario que desea buscar'});
    }

    try {
        const dbUser = await User.findOne({username});
        if(!dbUser){
            return res.status(400).json({msg:'El usuario no existe'});
        }
        return res.status(200).json({
            User:{
                username:dbUser.username,
                id:dbUser._id
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:'Error inesperado'});
    }
}

const updateUser = async(req,res) =>{
    const {username,password,updatedPassword} = req.body;
    console.log(username);
    console.log(password);
    console.log(updatedPassword);
    if(!updatedPassword || !password){
        return res.status(400).json({msg:'Ingrese la contraseña actual y la nueva'});
    }

    try {
        const dbUser = await User.findOne({username});
        if(password !== dbUser.password){
            return res.status(400).json({msg:'Contraseña incorrecta'});
        }
        await User.updateOne({username},{password:updatedPassword});
        return res.status(200).json({msg:'Contraseña actualizada exitosamente'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:'Error inesperado'});
    }
}

const deleteUser = async(req,res) =>{
    const {username} = {username : req.params.id};
    console.log(username);
    
    try {
        await User.deleteOne({username});
        return res.status(200).json({msg:'Usuario eliminado exitosamente'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:'Error inesperado'});
    }
}

module.exports = {
    getAllUsers,
    createUser,
    loginUser,
    findUser,
    updateUser,
    deleteUser
}