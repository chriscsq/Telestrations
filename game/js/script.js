((io, Whiteboard) => {
    const printDemoMessage = () => {
        // console.log(
        //     '%c👋 Hello there!',
        //     'font-weight: bold; font-size: 2rem;',
        // );

        // console.log(
        //     'Make the line %cgreen',
        //     'color: #00ff00;',
        // );

        // console.log(
        //     '%cwhiteboard.color = \'#00ff00\';',
        //     'color: #f3900c;',
        // );

        // console.log(
        //     'Make the line %cthicker',
        //     'font-weight: bold;',
        // );

        // console.log(
        //     '%cwhiteboard.increaseThickness(20);',
        //     'color: #f3900c;',
        // );

        // console.log(
        //     '🎉 Or you can %cdownload the image!',
        //     'font-weight: bold;',
        // );

        // console.log(
        //     '%cwhiteboard.download();',
        //     'color: #f3900c;',
        // );
    };

    window.addEventListener('load', () => {
        console.log('🌍 Connecting to server…');

        const socket = io();
        const canvas = document.querySelector('#myCanvas');
        var eraser = document.getElementById("eraser");
        var isEraser = false;

        socket.on('connect', () => {
            // At this point we have connected to the server
            console.log('🌍 Connected to server');

            // Create a Whiteboard instance
            const whiteboard = new Whiteboard(canvas, socket);

        eraser.addEventListener("click", function () {
            console.log('eraser pressed')
            if (isEraser === false){
                isEraser = true;
                console.log('eraser is now true')
                whiteboard.color = '#f5f5f5';
                whiteboard.thickness = 12;
                eraser.innerHTML = 'Pencil';
            }
            else{
                isEraser = false;
                whiteboard.color = '#000000';
                whiteboard.thickness = 4;
                eraser.innerHTML = 'Eraser';
            }
        })
            // Expose the whiteboard instance
            window.whiteboard = whiteboard;
            printDemoMessage();
        });
    });
})(io, Whiteboard);