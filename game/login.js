let socket = io();

let storeUserdata = data => {
    for (key in data) {
        if (key !== 'success') {
            Cookies.set(key, data[key]);
        }
    }
}

socket.on('register', data => {
    if (data.success) {
        storeUserdata(data);
        window.location.href = '/';
    } else {
        formArea.errorMsg = 'A user with that email already exists';
    }
});

socket.on('login', data => {
    if (data.success) {
        storeUserdata(data);
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
                if (this.email.length === 0 || !this.validEmail()) {
                    this.errorMsg = 'Please enter a valid email';
                } else {
                    socket.emit('register', { username: this.username, password: this.password, email: this.email });
                }
            } else {
                socket.emit('login', { username: this.username, password: this.password });
            }
        },
        switchType: function (event) {
            this.isRegistering = !this.isRegistering;
        },
        validEmail: function () {
            let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(this.email);
        }
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