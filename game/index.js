let loginButton = new Vue({
    el: '#loginButton',
    data: {
        isLoggedIn: false, //Cookies.get('user') !== null,
        userIconClasses: 'justify-content-center align-self-center fas fa-3x ' + 'fa-dot-circle',//Cookies.get('user-icon'),
        username: 'Test User',//Cookies.get('user'),
    },
    methods: {
        click: function (event) {
            if (this.isLoggedIn) {
                console.log('Go to profile');
            } else {
                console.log('Go to login');
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
                // should retrieve new code first
                window.location.href = '/create';
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
                    Cookies.set('roomCode', this.roomCode);
                    window.location.href = '/room';
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
})

const EVENTS = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
};

let socket = io();

socket.on(EVENTS.CONNECT, () => {
    console.log("Connected");
});

socket.on(EVENTS.DISCONNECT, () => {
    console.log("Disconnected");
});
