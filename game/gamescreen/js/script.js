((io, Whiteboard) => {

    window.addEventListener('load', () => {
        console.log('Connecting to server…');

        const socket = io();
        const canvas = document.querySelector('#myCanvas');
        var eraser = document.getElementById("eraser");
        var colorSelect = document.querySelector('.colorSelect');
        var timer = document.getElementById("timer");
        var isEraser = false;
        var lastChosenColor = '#000000';

        socket.on('connect', () => {
            // At this point we have connected to the server
            console.log('Connected to server');

            // Create a Whiteboard instance
            var whiteboard = new Whiteboard(canvas, socket);

            eraser.addEventListener("click", function () {
                if (isEraser === false) {
                    isEraser = true;
                    console.log('eraser is now true')
                    whiteboard.color = '#FFFFFF';
                    whiteboard.thickness = 15;
                    eraser.innerHTML = 'Pencil';
                    eraser.src="https://i.imgur.com/PB7ggOx.png"
                }
                else {
                    eraser.src="https://i.imgur.com/BBNKLpl.png";
                    isEraser = false;
                    whiteboard.color = lastChosenColor;
                    whiteboard.thickness = 4;
                    eraser.innerHTML = 'Eraser';
                    console.log("eraser is false")
                }
            })
            colorSelect.addEventListener('change', (event) => {
                if (event.target.value == "red") {
                    console.log('red chosen')
                    whiteboard.color = lastChosenColor = '#f08080';
                    if (whiteboard.thickness > 5) {
                        whiteboard.color = '#ffffff'
                    }
                } else if (event.target.value == "black") {
                    console.log('black chosen')
                    whiteboard.color = lastChosenColor = '#000000';
                    if (whiteboard.thickness > 5) {
                        whiteboard.color = '#ffffff'
                    }
                } else if (event.target.value == "blue") {
                    console.log('blue chosen')
                    whiteboard.color = lastChosenColor = '#87cefa';
                    if (whiteboard.thickness > 5) {
                        whiteboard.color = '#ffffff'
                    }
                } else if (event.target.value == "green") {
                    console.log('green chosen')
                    whiteboard.color = lastChosenColor = '#90ee90';
                    if (whiteboard.thickness > 5) {
                        whiteboard.color = '#ffffff'
                    }
                } else if (event.target.value == "pink") {
                    console.log('pink chosen')
                    whiteboard.color = lastChosenColor = '#ffc0cb';
                    if (whiteboard.thickness > 5) {
                        whiteboard.color = '#ffffff'
                    }
                } else if (event.target.value == "orange") {
                    console.log('orange chosen')
                    whiteboard.color = lastChosenColor = '#ffa07a';
                    if (whiteboard.thickness > 5) {
                        whiteboard.color = '#ffffff'
                    }
                } else if (event.target.value == "yellow") {
                    console.log('yellow chosen')
                    whiteboard.color = lastChosenColor = '#fafad2';
                    if (whiteboard.thickness > 5) {
                        whiteboard.color = '#ffffff'
                    }
                }
            })
            window.whiteboard = whiteboard;

            var watchTimer = { watch: null, prev: timer.innerHTML }

            function Watch(timerO, e) {
                timerO.watch = setInterval(function () {
                    if (e.innerHTML != timerO.prev) {
                        timerO.prev = e.innerHTML;
                        if (timerO.prev === "Time's up" || e.innerHTML === "Time's up") {
                            console.log('timer ran out you can trigger download now')
                            whiteboard.download('image.png').then(() => {
                                changeRound();
                                whiteboard = new Whiteboard(canvas, socket);
                                window.whiteboard = whiteboard;
                            });
                        } else if (timerO.prev === "DRAW YOUR GUESS") {
                            whiteboard = new Whiteboard(canvas, socket);
                            window.whiteboard = whiteboard;
                        }
                    }
                }, 1000);
            }
            Watch(watchTimer, timer);

        });
    });
})(io, Whiteboard);