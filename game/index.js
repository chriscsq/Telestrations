let socket = io();

let defaultUser = {
    username: 'Anonymous',
    usericon: 'fa-crow',
    iconColor: '#5A5ACA',
    bannerColor: '#5ACA5A',
    usernameColor: '#CA5A5A',
};
for (key in defaultUser) {
    Cookies.set(key, defaultUser[key]);
}

socket.on('create-room', data => {
    Cookies.set('roomCode', data.code);
    window.location.href = '/lobby';
});

socket.on('join-room', data => {
    if (data.success) {
        Cookies.set('roomCode', data.code);
        window.location.href = '/lobby';
    } else {
        playArea.errorMsg = 'Invalid room code';
    }
});

let loginButton = new Vue({
    el: '#loginButton',
    data: {
        isLoggedIn: Cookies.get('user') !== undefined,
        userIconClasses: 'justify-content-center align-self-center fas fa-3x ' + Cookies.get('usericon'),
        username: Cookies.get('user'),
        userIconStyle: { color: Cookies.get('iconColor') },
        usernameStyle: { color: Cookies.get('usernameColor') },
    },
    methods: {
        click: function (event) {
            if (this.isLoggedIn) {
                window.location.href = '/profile';
            } else {
                window.location.href = '/login';
            }
        },
    },
});

let playArea = new Vue({
    el: '#playArea',
    data: {
        altButtonText: 'Create Room',
        roomCode: '',
        errorMsg: '',
    },
    methods: {
        createRoom: function (event) {
            if (this.altButtonText === 'Create Room') {
                socket.emit('create-room', { user: Cookies.get('user') });
            } else {
                this.altButtonText = 'Create Room';
                this.roomCode = '';
                this.errorMsg = '';
            }
        },
        joinRoom: function (event) {
            if (this.inputVisible) {
                if (this.roomCode.length !== 4) {
                    this.errorMsg = 'Room code must be four characters';
                } else {
                    socket.emit('join-room', { code: this.roomCode });
                }
            } else {
                this.altButtonText = 'Back';
            }
        },
        roomCodeChanged: function () {
            this.roomCode = this.roomCode.toUpperCase();
        },
    },
    computed: {
        inputVisible: function () {
            return this.altButtonText !== 'Create Room';
        },
        showError: function () {
            return (this.errorMsg !== '') && (this.altButtonText === 'Back');
        },
    },
});