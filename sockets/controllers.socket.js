const { comprobarJwt } = require("../middlewares/validar-jwt")
const { Chat } = require("../models")

const chat = new Chat()
const controllerSocket = async(socket, io) =>{

  const usuario = await comprobarJwt( socket.handshake.headers['x-token'] )

  if( !usuario ) socket.disconnect()

  chat.agregarUsuario(usuario)

  socket.broadcast.emit('usuarios-conectado',chat.usuariosArr)
  socket.emit('usuarios-conectado', chat.usuariosArr)
  socket.emit('recibir-mensaje',chat.ultimo10)

  // Crear un sala donde el valor entre parentesis el nombre de la sala
  socket.join( usuario.id )

  socket.on('disconnect',()=>{
    chat.desconectarUsuario( usuario.id )
    socket.broadcast.emit('usuarios-conectado', chat.usuariosArr)
  })

  socket.on('enviar-mensaje',({uid,mensaje})=>{

    if( uid ==='' ){

      chat.enviarMensaje( uid, usuario.nombre, mensaje )
  
      io.emit('recibir-mensaje',chat.ultimo10)
    }else{
      // ir a una sala
      socket.to(uid).emit('mensaje-privado',{ de: usuario.nombre, mensaje })


    }

  })

  


}


module.exports = {
  controllerSocket
}