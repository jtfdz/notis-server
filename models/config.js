const qformat = {
	select: 'SELECT * FROM usuario_tabla WHERE'
}

const config = {
    dbUrl: 'postgres://postgres:masterkey@localhost:9999/notas_moviles',
    port: 3000,
    q1: 'INSERT INTO usuario_tabla(id_usuario, alias_usuario, contraseña, nombre, fecha_registro, correo) VALUES (DEFAULT, $1, $2, $3, $4, $5)',
    q2:  qformat.select + ' alias_usuario = $1',
    q3:  qformat.select + ' correo = $1',
    q4:  qformat.select + ' id_usuario = $1'
}

module.exports = config;