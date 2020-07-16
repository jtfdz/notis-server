const qformat = {
	select: 'SELECT * FROM usuario_tabla WHERE'
}

const config = {
    dbUrl: 'postgres://postgres:masterkey@localhost:9999/notas_moviles',
    port: 3000,
    q1: 'INSERT INTO usuario_tabla(id_usuario, alias_usuario, contraseña, nombre, fecha_registro, correo) VALUES (DEFAULT, $1, $2, $3, $4, $5)',
    q2:  qformat.select + ' alias_usuario = $1',
    q3:  qformat.select + ' correo = $1',
    q4:  qformat.select + ' id_usuario = $1',
    q5: 'INSERT INTO nota_tabla (id_nota, id_usuario, tipo_contenido, contenido, fecha, pinned, orden, titulo) VALUES (DEFAULT, $1, $2, $3, $4, false, DEFAULT, $5)',
    q6: 'SELECT * from nota_tabla WHERE id_usuario = $1',
    q7: 'SELECT tipo_contenido, count(*) from nota_tabla WHERE id_usuario=$1 group by tipo_contenido HAVING count(*) > 0 ORDER BY count(*) LIMIT 1;',
    q8: 'SELECT fecha, count(*) from nota_tabla WHERE id_usuario=$1 AND fecha=current_date group by fecha HAVING count(*) > 0 ORDER BY count(*) LIMIT 1;',
    q9: 'SELECT fecha, count(*) from nota_tabla WHERE id_usuario=1 AND ((SELECT extract(month from fecha)) =	(SELECT extract(month from current_date))) group by fecha  HAVING count(*) > 1 LIMIT 1;',
    q10: 'DELETE FROM nota_tabla WHERE id_nota= $1 AND id_usuario= $2',
    q11: 'SELECT * FROM nota_tabla WHERE id_nota=$1' 
}


module.exports = config;