var roomName = { room_name_json };
var personName = { person_name_json };
var contador = 0;

var chatSocket = new WebSocket(
    'ws://' + window.location.host +
    '/ws/chat/' + roomName + '/');

chatSocket.onmessage = function(e) {
    var data = JSON.parse(e.data);
    var message = data['message'];
    var nameAuthor = data['name'];
    var time_send = data['time'];

    var codigo = '<div class="rounded-right" id="'+ "mensaje-" + contador + '" style="background-color: #98c1d9; width: 70%; margin: auto;">'				+
            '<div class="nombre" style="background-color: #ee6c4d;">'				+
                '<h4>'+ nameAuthor + '</h4>'	+
            '</div>'							+
            '<div class="contenido">'			+
                '<h2>'+ message +'</h2>'	+
            '</div>'							+
            '<div class="time">'			+
                '<p>'+ time_send +'</p>'	+
            '</div>'							+
        '</div>';
    $('#conversacion1').append(codigo);
    contador++;
    if (contador > 5){
        var element = contador - 6;
        $('#mensaje-' + element.toString()).remove();
    };
    //$('#conversacion').html('<h1>Hola</h1>');
    //#document.getElementById('conversacion').innerHTML = '<ol><li>html data</li></ol>';
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

document.querySelector('#chat-message-input').focus();
document.querySelector('#chat-message-input').onkeyup = function(e) {
    if (e.keyCode === 13) {  // enter, return
        document.querySelector('#chat-message-submit').click();
    }
};

document.querySelector('#chat-message-submit').onclick = function(e) {
    var messageInputDom = document.querySelector('#chat-message-input');
    var message = messageInputDom.value;
    chatSocket.send(JSON.stringify({
        "name": personName,
        "message": message,
    }));

    messageInputDom.value = '';
};