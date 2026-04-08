class main extends Phaser.Scene {

    constructor() {
        super({
            key: 'main'
        });
    }

    preload() {
        this.load.image("introduction", "assets/introduction.png");
        this.load.image('space1', 'assets/spaceup.png');  
        this.load.image('space2', 'assets/spacedown.png');
        this.load.audio('bg_music', 'assets/background.mp3');
    }

    
    create() {
        console.log('*** introduction scene');

       bg_music = this.sound.add('bg_music', { loop: true, volume: 0.5 });
       bg_music.play();
       
 

        // Background
        this.add.image(320, 320, 'introduction');

        // "Press spacebar to continue" text
        this.add.text(290, 560, 'Press spacebar to continue', {
            font: '18px Courier',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

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

        // Spacebar to next scene
        var spaceDown = this.input.keyboard.addKey('SPACE');
        spaceDown.on('down', function () {
            console.log('Jump to introduction2 scene');
            this.scene.start('introduction2', {});
        }, this);
    }
}