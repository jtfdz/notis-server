var express = require('express');
var router = express.Router();

let passport = require('passport')

let auth = require('../controllers/Authentication');
let sessionHelper = require('../models/session');
let user = require('../models/usuario');

const { check, validationResult } = require('express-validator');


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', check('contraseña').not().isEmpty(), check('alias').not().isEmpty(), auth.isLogged, passport.authenticate('local'), function(req, res){
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    res.json({mensaje: "Logged in con éxito.", status: 200})
})

router.get('/logout', auth.isAuth, function(req, res){
        req.logout();
        res.json({mensaje: "Logged out con éxito.", status: 200})
})

router.post('/registrar', check('nombre').isLength({min: 3}), check('contraseña').isLength({min: 3}),
check('alias').isLength({min: 3}), check('correo').isLength({min: 3}), check('descripcion').isLength({min: 3}),

check('correo').custom(value => { return user.checkingEmail(value).then(user =>{if(user){ return Promise.reject('Correo en existencia.'); } } )}),
check('alias').custom(value => { return user.getUserByUsername(value).then(user =>{if(user){ return Promise.reject('Alias en existencia. Intente con un alias diferente.'); } } )}),

check('correo').isEmail(), auth.isLogged, function(req, res){

    const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }

    user.registrarUsuario(req.body).then((result)=>{
        let count = result.rowCount;
        let status, mensaje;
        if(count > 0){
        status = 200;
        mensaje = "Usuario Registrado.";
        }else{
      status = 500;
      mensaje = 'Error al registrar Usuario.'
      }
      res.json({status, mensaje})
      }).catch(err => {
    console.log(err);
    res.status(500).json({status: 500, mensaje: 'Error al Registrar.'});
    }) 
})

router.get('/pagina', auth.isAuth, (req, res) => {
    user.Despliegue(sessionHelper.getIdFromSession(req)).then((data) => {
        let message, status;
        if(data !== null){
            message = "feed desplegado :).";
            status = 200;
        }else{
            message = "error al desplegar el feed :(.",
            status = 404;
        }
        res.json({data, message, status});
    }).catch(err => {
        console.log(err)
        res.json({status: 500, message: 'Error'})  
    })
})

router.post('/pagina/crear', auth.isAuth, (req, res) => {
    user.paginaCrear(req.body, sessionHelper.getIdFromSession(req)).then((result) => {
        res.json({status: 200, message: 'Página creada.'})
    }).catch(err => {
        console.log(err)
        res.json({status: 500, message: 'Error al crear la página.'})
    })
})

router.get('/pagina/:id', auth.isAuth, (req, res) => {
    user.paginaDespliegue(req.params.id).then((data) => {
        let message, status;
        if(data !== null){
            message = "Pagina desplegada :).";
            status = 200;
        }else{
            message = "Pagina inexistente :(.",
            status = 404;
        }
        res.json({data, message, status});
    }).catch(err => {
        console.log(err)
        res.json({status: 500, message: 'Error'})  
    })
})



router.put('/pagina/:id/editar', auth.isAuth, (req, res) => {
    user.paginaModificar(req.body,req.params.id,sessionHelper.getIdFromSession(req)).then((result) => {
        res.json({status: 200, message: 'Página modificada.'})
    }).catch(err => {
        console.log(err)
        res.json({status: 500, message: 'Error al modificar página.'})
    })
})

router.delete('/pagina/:id/delete', auth.isAuth, (req, res) => {
    user.paginaBorrar(req.params.id,sessionHelper.getIdFromSession(req)).then((result) => {
        res.json({status: 200, message: 'Página borrada.'})
    }).catch(err => {
        console.log(err)
        res.json({status: 500, message: 'Error al borrar página.'})
    })
})


router.post('/pagina/:id/crear', auth.isAuth, (req, res) => {
    user.postCrear(req.body, req.params.id).then((result) => {
        res.json({status:200, message:'Post creado.'})
    }).catch(err => {
        console.log(err)
        res.json({status: 500, message: 'Error al crear post.'})
    })
})

router.get('/pagina/:id/post/:pid', auth.isAuth, (req, res) => {
    user.postDespliegue(req.params.id,req.params.pid).then((data) => {
        if(data !== null){
            message = "Post desplegado :).";
            status = 200;
        }else{
            message = "Post inexistente :(.",
            status = 404;
        }
        res.json({data, message, status});
    }).catch(err => {
        
        res.json({status: 500, message: 'Error en despliegue del post.'})
    })
})

router.put('/pagina/:id/post/:id2', auth.isAuth, (req, res) => {
    user.postModificar(req.body,req.params.id,req.params.id2,sessionHelper.getIdFromSession(req)).then((result) => {
        res.json({status:200, message:'Post modificado.'})
    }).catch(err => {
        
        res.json({status: 500, message: 'Error en modificación del post.'})
    })
})


router.delete('/pagina/:id/post/:id2/eliminar', auth.isAuth, (req, res) => {
    user.postBorrar(req.params.id,req.params.id2,sessionHelper.getIdFromSession(req)).then((result) => {
        res.json({status:200, message:'Post borrado.'})
    }).catch(err => {
        
        res.json({status: 500, message: 'Error en eliminar el post.'})
    })
})



router.get('/feed', auth.isAuth, (req, res) => {
    user.feed().then(result => {
        res.json({status: 200, data: result})
    })
})


module.exports = router;
