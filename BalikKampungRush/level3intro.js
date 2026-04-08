class level3intro extends Phaser.Scene {

    constructor() {
        super({
            key: 'level3intro'
        });
    }

    preload() {
        this.load.image("level3intro", "assets/level3intro.jpg");
        this.load.image('space1', 'assets/spaceup.png');  
        this.load.image('space2', 'assets/spacedown.png');
    }

    create() {
        console.log('*** level3intro scene');

        this.add.image(320, 320, 'level3intro')

          // Spacebar button animation
        const spaceBtn = this.add.image(510, 560, 'space1').setScale(0.7);

        let frame = 0;
        this.time.addEvent({
            delay: 400,
            loop: true,
            callback: () => {
                frame = frame === 0 ? 1 : 0;
                spaceBtn.setTexture(frame === 0 ? 'space1' : 'space2');
            }
        });

        var spaceDown = this.input.keyboard.addKey('SPACE');
       
        spaceDown.on('down', function () {
            console.log('Jump to room3 scene');
            this.scene.start('room3', {});
        }, this);

        this.add.text(90, 600, 'Press spacebar to continue', {
            font: '30px Courier',
            fill: '#FFFFFF'
        });

    }
}