const miFormulario = document.querySelector('form')

var url = (window.location.hostname.includes('localhost'))
  && 'http://localhost:8081/api/auth/'

miFormulario.addEventListener('submit',(e)=>{
  e.preventDefault()
  const formData = {}

  for(let el of miFormulario.elements){
    if(el.name.length > 0) 
      formData[el.name] = el.value
  }

  fetch(url + 'login',{
    method: 'POST',
    body: JSON.stringify(formData),
    headers:{
      'Content-Type': 'application/json'
    }
  })
  .then(res =>res.json())
  .then(({msg, token}) =>{
    if( msg ) return console.error( msg )
    
    localStorage.setItem('token',token)
    window.location = 'chat.html'
  })
  .catch(console.log)
})

function onSignIn(googleUser) {
  // var profile = googleUser.getBasicProfile();
  // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log('Name: ' + profile.getName());
  // console.log('Image URL: ' + profile.getImageUrl());
  // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

  // no hay confiar en la info de google por ello tenemos que poner esta funcion para tener un token (info en la pagina de googlr)
  var id_token = googleUser.getAuthResponse().id_token;

  const data = { id_token }
  console.log('hola')
  fetch(url + 'google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(resp => resp.json())
    .then(({token}) => {
      localStorage.setItem('token', token);
      window.location = 'chat.html'
    })
    .catch(console.log)
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}