class level2intro extends Phaser.Scene {

    constructor() {
        super({
            key: 'level2intro'
        });
    }

    preload() {
        this.load.image("level2intro", "assets/beforeroom2.png");
        this.load.image('space1', 'assets/spaceup.png');  
        this.load.image('space2', 'assets/spacedown.png');
    }

    create() {
        console.log('*** level2intro scene');

        this.add.image(320, 320, 'level2intro')

        var spaceDown = this.input.keyboard.addKey('SPACE');
       
        spaceDown.on('down', function () {
            console.log('Jump to room2 scene');
            this.scene.start('room2', {});
        }, this);
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

    }

    
}