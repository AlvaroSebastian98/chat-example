const { io } = require('../server');

const Usuarios = require('../classes/usuarios')
const { crearMensaje } = require('../utils/utils')

const usuarios = new Usuarios()

io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {

        if(!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre y sala son necesarios'
            })
        }

        // conecta al usuario a una sala
        client.join(usuario.sala)

        // client.leave('room'); // remueve al usuario de la sala

        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala)

        client.broadcast.to(usuario.sala).emit('listaPersona', usuarios.obtenerPersonasPorSala(usuario.sala))

        callback(usuarios.obtenerPersonasPorSala(usuario.sala))

        // avisa a los demás usuarios que un nuevo usuario se ha conectado
        client.broadcast.to(usuario.sala).emit('crearMensaje', {
            usuario: 'Administrador',
            mensaje: `${usuario.nombre} se ha unido al chat`
        })

    })

    client.on('crearMensaje', (data) => {

        let persona = usuarios.obtenerPersona(client.id)

        let mensaje = crearMensaje(persona.nombre, data.mensaje)
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)
    })

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id)

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandonó el chat`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.obtenerPersonasPorSala(personaBorrada.sala))
    })


    // Mensajes privados
    client.on('mensajePrivado', data => {

        let persona = usuarios.obtenerPersona(client.id)
        client.broadcast.to(data.receptor).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))

    })

});