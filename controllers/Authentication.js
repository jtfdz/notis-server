module.exports.isAuth = (req, res, next) => {
    console.log('is Auth?')
    if(req.isAuthenticated()){
        console.log('yes!')
        next();
    }else{
        console.log('no!')
        res.send({
            status: 400,
            response: 'Debes iniciar sesión primero.'
        })
    }
}
module.exports.isLogged = (req, res, next) => {
    console.log('is Logged?')
    if(req.isAuthenticated()){
        console.log('yes!')
        res.send({
            status: 304,
            response: 'Ya existe una sesión.'
        })
    }else{
        console.log('no!')
        next();
    }
}



