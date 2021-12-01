const express = require('express');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario_model');
//const Joi = require('@hapi/joi');
const router = express.Router();

router.post('/', (req, res)=>{
    Usuario.findOne({email: req.body.email})
    .then(datos=>{
        if(datos){
            const passwordValido = bcrypt.compareSync(req.body.password, datos.password);
            if(!passwordValido) return res.status(400).json({error:'OK', msj:'Usuario o contraseña incorrecta.'});
            const jwtoken = 
            jwt.sign({
              usuario: {_id: datos._id, nombre: datos.nombre, email: datos.email}
            }, config.get('configToken.secretKey'), { expiresIn: config.get('configToken.expiration') });
            //jwt.sign({_id: datos._id, nombre: datos.nombre, email: datos.email}, 'password');
            res.send({
                usuario: {
                    _id: datos._id,
                    nombre: datos.nombre,
                    email: datos.email
                },
                jwtoken
            });
        }else{
            res.status(400).json({
                error:'OK',
                msj: 'Usuario o contraseña incorrecta.'
            })
        }
    })
    .catch(err=>{
        res.status(400).json({
            error: 'OK',
            msj:' Error en el servicio ' + err
        })
    })
})

module.exports = router;