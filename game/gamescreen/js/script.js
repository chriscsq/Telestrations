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
        var redColor = document.getElementById("redColor");
        var blackColor = document.getElementById("blackColor");
        var blueColor = document.getElementById("blueColor");
        var greenColor = document.getElementById("greenColor");
        var orangeColor = document.getElementById("orangeColor");
        var yellowColor = document.getElementById("yellowColor");
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
                    eraser.src="js/icons/crayon.png";
                }
                else {
                    eraser.src="js/icons/eraser.png";
                    isEraser = false;
                    whiteboard.color = lastChosenColor;
                    whiteboard.thickness = 4;
                    eraser.innerHTML = 'Eraser';
                    console.log("eraser is false")
                }
            })
            redColor.addEventListener("click", function () {
                if (!isEraser) {
                    whiteboard.color = lastChosenColor = '#f08080';
                }
            })
            blackColor.addEventListener("click", function () {
                if (!isEraser) {
                    whiteboard.color = lastChosenColor = '#000000';
                }
            })
            blueColor.addEventListener("click", function () {
                if (!isEraser) {
                    whiteboard.color = lastChosenColor = '#87cefa';
                }
            })
            greenColor.addEventListener("click", function () {
                if (!isEraser) {
                    whiteboard.color = lastChosenColor = '#90ee90';

                }
            })
            orangeColor.addEventListener("click", function () {
                if (!isEraser) {
                    whiteboard.color = lastChosenColor = '#ffa07a';
                }
            })
            yellowColor.addEventListener("click", function () {
                if (!isEraser) {
                    whiteboard.color = lastChosenColor = '#F0E68C';

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
                            whiteboard.download('image.png').then(() => {
                                whiteboard = new Whiteboard(canvas, socket);
                                window.whiteboard = whiteboard;
                            });
                        }
                    }
                }, 1000);
            }
            Watch(watchTimer, timer);

        });
    });
})(io, Whiteboard);