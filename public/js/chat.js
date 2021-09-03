var url = (window.location.hostname.includes('localhost'))
  && 'http://localhost:8081/api/auth/'

let user = null
let socket = null

// Referencia de Html

const txtUid = document.querySelector('#txtUid')
const txtMensaje = document.querySelector('#txtMensaje')
const ulUsuario = document.querySelector('#ulUsuario')
const ulMensaje = document.querySelector('#ulMensaje')
const btnSalir = document.querySelector('#btnSalir')

const validarJWT = async() =>{

  const token = localStorage.getItem('token') || ''

  if(token.length <= 10 ) {
    window.location = 'index.html'
    throw new Error('No hay token')

  }

  const resp = await fetch(url,{
    headers:{'x-token': token}
  })

  const { usuario, token:tokendb } = await resp.json()

  localStorage.setItem('token',tokendb)
  user = usuario
  document.title = user.nombre

  await conectarSocket()
}

const conectarSocket = async() =>{
  socket = io({
    'extraHeaders': {
      'x-token' : localStorage.getItem('token')
    }
  })


  socket.on('recibir-mensaje',dibujarMensaje)
  socket.on('usuarios-conectado',dibujarConectado)
  socket.on('mensaje-privado',(payload)=>{
    console.log('privado', payload)
  })
}


const dibujarConectado = (usuarios=[]) =>{
  let userHtml = ''

  usuarios.forEach(({nombre,uid})=>{

    userHtml += `
      <li>
        <p>
          <h5 class="text-success">${nombre}</h5>
          <span class="fs-6 text-muted">${uid}</span>
        </p>
      </li>
    `
  })

  ulUsuario.innerHTML = userHtml
}
const dibujarMensaje = (mensaje=[]) =>{
  let userHtml = ''

  mensaje.forEach(({nombre,mensaje})=>{

    userHtml += `
      <li>
        <p>
          <h5 class="text-primary">${nombre}</h5>
          <span>${mensaje}</span>
        </p>
      </li>
    `
  })

  ulMensaje.innerHTML = userHtml
}

txtMensaje.addEventListener('keyup',({keyCode}) =>{

  const mensaje = txtMensaje.value
  const uid = txtUid.value

  if( keyCode !== 13 ) return
  if( mensaje.length === 0 ) return

  socket.emit('enviar-mensaje',{ mensaje, uid})
})


const main = async() => {

  await validarJWT()
}

main()



