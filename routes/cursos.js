const express = require('express');
const Curso = require('../models/curso_model');
const verificarToken = require('../middlewares/auth');
const router = express.Router();

router.get('/', verificarToken, (req, res)=>{


    let resultado = listarCursosActivados();
    resultado.then(cursos=>{
        res.json(cursos)
    }).catch(err=>{
        res.status(400).json(err)
    })
});

router.post('/', verificarToken,(req, res)=>{

    let resultado = crearCurso(req);
    resultado.then(curso=>{
        res.json({curso})
    }).catch(err=> 
        res.status(400).json({err}));
});

router.put('/:id', verificarToken,(req, res)=>{
    let resultado = actualizarCurso(req.params.id, req.body);
    resultado.then(curso=>{
        res.json({curso})
    }).catch(err=>{
        res.status(400).json({err})
    });
});

router.delete('/:id', verificarToken,(req, res)=>{
    let resultado = desactivarCurso(req.params.id);
    resultado.then(curso=>{
        res.json({curso})
    }).catch(err=>{
        res.status(400).json({err})
    });
});

async function crearCurso(req){
    let curso = new Curso({
        titulo       : req.body.titulo,
        autor        : req.usuario._id,
        descripcion  : req.body.descripcion
    });
    return await curso.save();
}

async function actualizarCurso(id , body){
    let curso = await Curso.findByIdAndUpdate(id, {
        $set: {
            titulo: body.titulo,
            descripcion: body.descripcion
        }
    }, {new: true});
    return curso;
}

async function desactivarCurso(id){
    let curso = await Curso.findByIdAndUpdate(id,{
        $set: {
            estado: false
        }
    }, {new: true});
    return curso;
}

async function listarCursosActivados(){
    let cursos = await Curso.find({"estado": true})
    //para mostrar la relación
    .populate('autor', 'nombre -_id');
    return cursos;
}
module.exports = router;