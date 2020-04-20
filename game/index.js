let socket = io();

socket.on('create-room', data => {
    Cookies.set('roomCode', data.code);
    window.location.href = 'lobby/lobby.html';
});

socket.on('join-room', data => {
    if (data.success) {
        Cookies.set('roomCode', data.code);
        window.location.href = 'lobby/lobby.html';
    } else {
        playArea.errorMsg = 'Invalid room code';
    }
});

let loginButton = new Vue({
    el: '#loginButton',
    data: {
        isLoggedIn: Cookies.get('username') !== undefined,
        userIconClasses: 'justify-content-center align-self-center fas fa-3x ' + Cookies.get('usericon'),
        username: Cookies.get('username'),
        userIconStyle: { color: Cookies.get('iconColor') },
        usernameStyle: { color: Cookies.get('usernameColor') },
        userBannerStyle: { background: Cookies.get('bannerColor') },
    },
    methods: {
        click: function (event) {
            if (this.isLoggedIn) {
                window.location.href = 'profile/profile.html';
            } else {
                window.location.href = 'login/login.html';
            }
        },
        logout: function (event) {
            for (let c of document.cookie.split(';')) {
                let name = c.split('=')[0].trim();
                if (name.length > 0) {
                    Cookies.remove(name);
                }
            }
            window.location.reload();
        }
    },
});

let playArea = new Vue({
    el: '#playArea',
    data: {
        altButtonText: 'Create Room',
        roomCode: '',
        errorMsg: '',
        isLoggedIn: loginButton.isLoggedIn,
        playMessage: loginButton.isLoggedIn ? 'Play' : 'Please login to play',
    },
    methods: {
        createRoom: function (event) {
            if (this.altButtonText === 'Create Room') {
                socket.emit('create-room', { user: Cookies.get('username') });
            } else {
                this.altButtonText = 'Create Room';
                this.roomCode = '';
                this.errorMsg = '';
            }
        },
        joinRoom: async function (event) {
            if (this.inputVisible) {
                if (this.roomCode.length !== 4) {
                    this.errorMsg = 'Room code must be four characters';
                } else {
                    let checkRoomFull = await roomFull(this.roomCode);
                    if (checkRoomFull) {
                        this.errorMsg = 'Sorry, this room is full';
                    } else {
                        socket.emit('join-room', { code: this.roomCode, user: Cookies.get('username') });
                    }

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
