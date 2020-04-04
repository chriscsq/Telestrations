let socket = io();

socket.on('create-room', data => {
    console.log(data);
    Cookies.set('roomCode', data.code);
    window.location.href = '/create';
});

socket.on('join-room', data => {
    if (data.success) {
        Cookies.set('roomCode', data.code);
        window.location.href = '/room';
    } else {
        playArea.errorMsg = 'Invalid room code';
    }
});

let loginButton = new Vue({
    el: '#loginButton',
    data: {
        isLoggedIn: Cookies.get('user') !== undefined,
        userIconClasses: 'justify-content-center align-self-center fas fa-3x ' + Cookies.get('user-icon'),
        username: Cookies.get('user'),
    },
    methods: {
        click: function (event) {
            if (this.isLoggedIn) {
                window.location.href = '/account';
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
                socket.emit('create-room');
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