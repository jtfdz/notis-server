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

router.post('/login', auth.isLogged, passport.authenticate('local'), function(req, res){
    res.json({mensaje: "Logged in con éxito.", status: 200})
});

router.get('/logout', auth.isAuth, function(req, res){
    req.logout();
    res.json({mensaje: "Logged out con éxito.", status: 200})
})

router.post('/registro', 
    check('email').custom(value => { return user.checkingEmail(value).then(user =>{if(user){ return Promise.reject('Correo en existencia.'); } } )}),
    check('username').custom(value => { return user.getUserByUsername(value).then(user =>{if(user){ return Promise.reject('Nombre de usuario en existencia. Intente con uno diferente.'); } } )}),
    auth.isLogged, function(req, res){

    const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()  })
      }

    user.registrarUsuario(req.body).then((result)=>{
        let count = result.rowCount;
        let status, mensaje;
        if(count > 0){
            status = 200;
            mensaje = "Usuario Registrado :).";
        }else{
          status = 500;
          mensaje = 'Error al registrar Usuario :(.'
          }
      res.json({status, mensaje})
      }).catch(err => {
        console.log(err);
        res.status(500).json({status: 500, mensaje: 'Error al Registrar :(.'});
        }) 
});


router.post('/nota/crear', auth.isAuth, (req, res) => {
    user.notaCrear(req.body, sessionHelper.getIdFromSession(req)).then((result) => {
        res.json({status: 200, message: 'Nota creada :).'})
    }).catch(err => {
        console.log(err)
        res.json({status: 500, message: 'Error al crear nota :(.'})
    })
})

router.get('/estadisticas', auth.isAuth, (req, res) => {
    user.estadisticas(sessionHelper.getIdFromSession(req)).then((data) => {
        let message, status;
        if(data !== null){
            message = "estadísticas desplegadas :).";
            status = 200;
        }else{
            message = "estadísticas NO desplegadas :(.",
            status = 404;
        }
        res.json({data, message, status});
    }).catch(err => {
        console.log(err)
        res.json({status: 500, message: 'Error al enviar estadísticas.'})
    })
})


router.get('/notas', auth.isAuth, (req, res) => {
    user.notasMostrar(sessionHelper.getIdFromSession(req)).then((data) => {
        let message, status;
        if(data !== null){
            message = "notas desplegadas :).";
            status = 200;
        }else{
            message = "notas NO desplegadas :(.",
            status = 404;
        }
        res.json({data, message, status});
    }).catch(err => {
        console.log(err)
        res.json({status: 500, message: 'Error al cargar las notas.'})  
    })
})


router.delete('/notas/:id/borrar', auth.isAuth, (req, res) => {
    user.notaBorrar(req.params.id, sessionHelper.getIdFromSession(req)).then((result) => {
        res.json({status: 200, message: 'Nota borrada :).'})
    }).catch(err => {
        console.log(err)
        res.json({status: 500, message: 'Error al borrar nota :(.'})
    })
})

router.get('/nota/:id', auth.isAuth, (req, res) => {
    user.notaMostrar(req.params.id).then((data) => {
        let message, status;
        if(data !== null){
            message = "Nota desplegada :).";
            status = 200;
        }else{
            message = "Nota inexistente :(.",
            status = 404;
        }
        res.json({data, message, status});
    }).catch(err => {
        console.log(err)
        res.json({status: 500, message: 'Error'})  
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






router.put('/pagina/:id/editar', auth.isAuth, (req, res) => {
    user.paginaModificar(req.body,req.params.id,sessionHelper.getIdFromSession(req)).then((result) => {
        res.json({status: 200, message: 'Página modificada.'})
    }).catch(err => {
        console.log(err)
        res.json({status: 500, message: 'Error al modificar página.'})
    })
})




module.exports = router;
