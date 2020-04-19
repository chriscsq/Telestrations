let user = Cookies.get('username');
let code = Cookies.get('roomCode');
let chatSocket = io();

console.log('In chat');

let scrollToBottom = (container = '.message') => {
    let messages = $(container);
    if (messages.length > 0) {
        let bottomRow = messages[messages.length - 1];
        $('#messages')[0].scrollTop = bottomRow.offsetTop;
    }
}

chatSocket.on('connect', () => {
    chatSocket.emit('chat-connect', { code: code });
});

chatSocket.on('chat-messages', data => {
    console.log(data);
    $('#messages').empty();
    $('#messages').append('<div style="height: 210px;"></div>');
    for (let info of data.messages) {
        let timeSpan = `<span class="time">${info.time}</span>`;
        let userSpan = `<span class="username">${info.user}</span>`;
        let messageSpan = `<span class="message-data">: ${info.message}</span>`;
        let messageClass = 'message';

        if (info.user == user) {
            messageClass += ' message-current-user';
        }

        let elem = `<div class="${messageClass}">${timeSpan} ${userSpan}${messageSpan}</div>`;
        $('#messages').append(elem);
    }
    scrollToBottom();
});

$(document).on('keypress', '#input', event => {
    if (event.charCode === 13) {
        let message = $('#input').val().toString();

        if (message.length > 0) {
            chatSocket.emit('chat-message', { user: user, message: message, code: code });
            $('#input').val('')
        }
    }
});