module.exports.getIdFromSession = (req) => {   
    return req.session.passport.user.id_usuario;
}

module.exports.getPaginaIdFromSession = (req) => {
    return req.session.passport.user.id_pw;
}

module.exports.getCurrentTime = () => {
	var now = new Date();
    return now;
}




