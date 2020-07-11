const db = require('./db');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
let sessionHelper = require('../models/session');


module.exports.registrarUsuario = async (data) => {
    try{
        const result = await db.result('INSERT INTO usuario (id_usuario, nombre_usuario, contraseña_usuario, alias_usuario,correo_usuario,descripcion_usuario) VALUES (DEFAULT, $1, $2, $3, $4,$5)', [data.nombre, bcrypt.hashSync(data.contraseña, 10), data.alias,data.correo,data.descripcion])
        return result
    }catch(err){
        throw err
    }
}

module.exports.getUserByUsername = async (username) => {
    try{
        const data = await db.oneOrNone('SELECT * FROM usuario WHERE alias_usuario = $1', [username]);
        return data;
    }catch(err){
        throw err
    }
}

module.exports.checkingEmail = async (correo) => {
    try{
        const data = await db.oneOrNone('SELECT * FROM usuario WHERE correo_usuario = $1', [correo]);
        return data;
    }catch(err){
        throw err
    }
}

module.exports.comparePassword = async (candidatePassword, hash) => {
    return bcrypt.compare(candidatePassword, hash);
}


module.exports.Despliegue = async (id) => {
    try{
        const result = await db.any('SELECT * FROM pagina WHERE id_usuario = $1', [id])
        return result;
    }catch(err){
        throw err
    }
}


module.exports.postDespliegue = async (id,pid) => {
    try{
        const data = await db.any('SELECT * FROM post WHERE id_pw = $1 AND id_post = $2', [id,pid])
        return data;
    }catch(err){
        throw err
    }
}


module.exports.postCrear = async (data,id) => {
    try{
        const result = await db.none('INSERT INTO post (id_post,titulo_post,contenido_post,fecha_post,id_pw,imagen_post) VALUES (default, $1, $2, $3, $4, $5)' , [data.titulo,data.contenido,sessionHelper.getCurrentTime(),id,data.imagen])
        return result
    }catch(e){
        throw e;
    }
}

module.exports.postModificar = async (data,id) => {
    try {
        const result = await db.none('UPDATE post SET titulo_post = $1, contenido_post = $2, imagen_post = $3,  WHERE id_post = $5', [data.titulo,data.contenido,data.imagen]);
        return result
    }catch(e){
        throw e;
    }
}


module.exports.postBorrar = async (data) => {
    try{
        const result = await db.none('DELETE FROM post WHERE id_pagina = $1 ', [data.id_pagina])
        return result
    }catch(e){
        throw e;
    }
}


module.exports.paginaDespliegue = async (id) => {
    try{
        const result = await db.oneOrNone('SELECT * FROM pagina WHERE id_pw = $1', [id])
        return result;
    }catch(err){
        throw err
    }
}


module.exports.paginaCrear = async (data,user) => {
    try{
        const result = await db.one('INSERT INTO pagina (id_pw,id_usuario,titulo_pw,formato_pw,fecha_pw) VALUES (default, $1, $2, $3, $4) RETURNING *', [user, data.titulo, data.formato,sessionHelper.getCurrentTime()]);
        return await result;        
    }catch(e){
        throw e
    }
}


module.exports.paginaModificar = async (data,pagid,poid,valid) => {
    try{
        const result = await db.none('UPDATE pagina SET titulo_pw = $1, formato_pw = $2 WHERE id_pw = $3 AND id_usuario = $4 AND id_post = $5', [data.titulo, data.formato, pagid, valid,poid]);
        return result;
    }catch(e){
        throw e;
    }
}



module.exports.paginaBorrar = async (pagid,poid,valid) => {
    try{
        const result = await db.none('DELETE FROM pagina WHERE id_pw = $1 AND id_usuario = $2 AND id_post = $3', [pagid,valid,poid])
        return result
    }catch(e){
        throw e;
    }
}



module.exports.getUserById = async (id) => {
    try{
        const data = db.oneOrNone('SELECT * FROM usuario WHERE id_usuario = $1', [id]);
        return data;
    }catch(err){
        throw err
    }
}