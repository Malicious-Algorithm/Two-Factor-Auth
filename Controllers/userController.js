require('dotenv').config()
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const User = require('../Models/User');
const speakEasy = require('speakeasy');

//---------------- Validar Campos Joi ------------//
const schemaValidate = Joi.object({
    name: Joi.string().min(6).max(200).required(),
    password: Joi.string().min(8).max(200).required()
})
//-----------------------------------------------//

exports.giveSecret = async (req, res) => {
    const { error } = schemaValidate.validate(req.body);

    if(error){
        return res.status(400).json({
            error: error.details[0].message
        });
    }

    try{
        console.log('asd');
        const secret = speakEasy.generateSecret().base32;
        const salt = await bcrypt.genSalt();
        const hashPass = await bcrypt.hash(req.body.password, salt);

        const user = {
            name: req.body.name,
            password: hashPass,
            secret: secret
        };

        let userModel = new User(user);
        await userModel.save();

        let exp = (30 - Math.floor((new Date().getTime() / 1000.0 % 30)));
        
        res.json({
            secret: secret,
            expira: exp 
        });
        

        res.status(200).send();

    } catch(err){
        res.status(500).send(err);
    }

}

//esto es para validar el OTP que el usuario me dio contra el secreto
//que está guardado en la BD
exports.validar = async (req, res, next) => {
    try{
        const secretUssBD = await User.findOne({ projection: {secret:1}});
        
        //console.log(secretUssBD.secret);
        //console.log('ddddddddddddd');
        
        if(secretUssBD == null) {
            res.status(400).send('OTP no encontrada!') 
        }

        const verif = speakEasy.totp.verify({
            secret: secretUssBD.secret,
            encoding: "base32",
            token: req.body.token, //este es el OTP que nos va a pasar el user
            window: 0 //le damos un par mas de tiempo al usuario por si no llegó a poner el OTP
        });

        if(verif == true){
            next(); 
        }else{
            res.send({"valido": "OTP inválido"});
        }
  
        
    } catch(err){
        res.status(400).send('No permitido');
    }
}

exports.admin = (req, res) => {
    res.json({
        error: null,
        data: {
            title: "Bienvenido Admin!",
            user: req.user
        }
    });
}