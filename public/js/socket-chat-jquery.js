// const { text } = require("express")

let params = new URLSearchParams(window.location.search)

let nombre = params.get('nombre')
let sala = params.get('sala')


let divUsuarios = $('#divUsuarios')
let formEnviar = $('#formEnviar')
let txtMensaje = $('#txtMensaje')
let divChatbox = $('#divChatbox')

// Funciones para renderizar usuarios
const renderizarUsuarios = personas => {

    console.log(personas)

    let html = ''

    html += '<li>'
    html += `   <a href="javascript:void(0)" class="active"> Chat de <span> ${params.get('sala')} </span></a>`
    html += '</li>'

    personas.forEach(persona => {

        html += '<li>'
        html += `   <a data-id="${persona.id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span> ${persona.nombre} <small class="text-success">online</small></span></a>`
        html += '</li>'
        // <small class="text-warning">Away</small>
        // <small class="text-danger">Busy</small>
        // <small class="text-muted">Offline</small>

    });

    divUsuarios.html(html)

}

const renderizarMensajes = (data, yo) => {

    let html = ''
    let fecha = new Date(data.fecha)
    let hora = fecha.getHours() + ':' + fecha.getMinutes()

    let adminClass = 'info'
    if(data.nombre === 'Administrador') adminClass = 'danger'

    if(yo) {

        html += '<li class="reverse animated fadeIn">'
        html += '    <div class="chat-content">'
        html += `        <h5>${data.nombre}</h5>`
        html += `        <div class="box bg-light-inverse">${data.mensaje}</div>`
        html += '    </div>'
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>'
        html += `    <div class="chat-time">${hora}</div>`
        html += '</li>'

    } else {

        html += '<li class="animated fadeIn">'
        if(data.nombre !== 'Administrador') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>'
        }
        html += '    <div class="chat-content">'
        html += `        <h5>${data.nombre}</h5>`
        html += `        <div class="box bg-light-${adminClass}">${data.mensaje}</div>`
        html += '    </div>'
        html += `    <div class="chat-time">${hora}</div>`
        html += '</li>'

    }

    divChatbox.append(html)

}

const scrollBottom = () => {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


//* Listeners

// al hacer click en cualquier etiqueta "a"
divUsuarios.on('click', 'a', function() {

    let id = $(this).data('id') // data-id

    if(id) {
        console.log(id)
    }

})

formEnviar.on('submit', function(e) {

    e.preventDefault()

    if(txtMensaje.val().trim().length === 0) {
        return
    }

    // console.log(txtMensaje.val())

    socket.emit('crearMensaje', {
        nombre,
        mensaje: txtMensaje.val()
    }, (mensaje) => {
        txtMensaje.val('').focus()
        renderizarMensajes(mensaje, true)
        scrollBottom()
    });

})