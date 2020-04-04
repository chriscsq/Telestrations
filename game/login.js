let socket = io();

socket.on('register', data => {
    if (data.success) {
        Cookies.set('user', data.user);
        Cookies.set('user-icon', data.usericon);
        window.location.href = '/';
    } else {
        formArea.errorMsg = 'Username or email already taken';
    }
});

socket.on('login', data => {
    if (data.success) {
        Cookies.set('user', data.user);
        Cookies.set('user-icon', data.usericon);
        window.location.href = '/';
    } else {
        formArea.errorMsg = 'Invalid username or password';
    }
});

let backButton = new Vue({
    el: '#backButton',
    methods: {
        click: function (event) {
            window.location.href = '/';
        },
    },
});

let formArea = new Vue({
    el: '#formArea',
    data: {
        username: '',
        password: '',
        email: '',
        isRegistering: false,
        errorMsg: '',
    },
    methods: {
        buttonClicked: function (event) {
            this.errorMsg = '';
            if (this.username.length === 0 || this.password.length === 0) {
                this.errorMsg = 'Please enter a username and password';
                return;
            }
            if (this.isRegistering) {
                if (this.email.length === 0) {
                    this.errorMsg = 'Please enter a valid email';
                }
                socket.emit('register', { username: this.username, password: this.password, email: this.email });
            } else {
                socket.emit('login', { username: this.username, password: this.password });
            }
        },
        switchType: function (event) {
            this.isRegistering = !this.isRegistering;
        },
    },
    computed: {
        showError: function () {
            return this.errorMsg.length > 0;
        },
        buttonText: function () {
            return this.isRegistering ? 'Register' : 'Login';
        },
        switchText: function () {
            return this.isRegistering ? 'Login' : 'Register';
        },
    },
})