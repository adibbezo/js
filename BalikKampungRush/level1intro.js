class level1intro extends Phaser.Scene {

    constructor() {
        super({
            key: 'level1intro'
        });

        // Put global variable here
    }

    preload() {
    this.load.image("level1intro", "assets/level1intro.png");
    this.load.image('space1', 'assets/spaceup.png');  
    this.load.image('space2', 'assets/spacedown.png');
        // Preload all the assets here

        // Preload any images here

        // Preload any sound and music here
        // this.load.audio('ping', 'assets/ping.mp3');
        // this.load.audio('bgMusic', 'assets/bgMusic.mp3');
    }

    create() {

        console.log('*** level1intro scene');
        this.add.image(320, 320, 'level1intro')

         // "Press spacebar to continue" text
        this.add.text(310, 490, 'Press spacebar when You Are Ready', {
            font: '18px Courier',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        // Add any sound and music here
        // ( 0 = mute to 1 is loudest )main.js
        //this.music = this.sound.add('bgMusic').setVolume(0.3) // 10% volume

        //this.music.play()
        //window.music = this.music


        // Add image and detect spacebar keypress
        //this.add.image(0, 0, 'main').setOrigin(0, 0);

        // Check for spacebar or any key here
        var spaceDown = this.input.keyboard.addKey('SPACE');

        // On spacebar event, call the world scene        
        spaceDown.on('down', function () {
            console.log('Jump to room1 scene');

            this.scene.start('room1',
                // Optional parameters
                {

                }
            );
        }, this);


        // Create all the game animations here
        // Spacebar button animation
        const spaceBtn = this.add.image(310, 530, 'space1').setScale(0.7);

        let frame = 0;
        this.time.addEvent({
            delay: 400,
            loop: true,
            callback: () => {
                frame = frame === 0 ? 1 : 0;
                spaceBtn.setTexture(frame === 0 ? 'space1' : 'space2');
            }
        });
    }


}