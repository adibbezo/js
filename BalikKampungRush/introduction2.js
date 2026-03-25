class introduction2 extends Phaser.Scene {

    constructor() {
        super({
            key: 'introduction2'
        });
    }

    preload() {
        this.load.image("introduction2", "assets/introduction2.png");

        // Load your own arrow images here
        this.load.image("arrow_up",    "assets/upkeybind.png");
        this.load.image("arrow_right", "assets/rightkeybind.png");
        this.load.image("arrow_down",  "assets/downkeybind.png");
        this.load.image("arrow_left",  "assets/leftkeybind.png");
        this.load.image('space1', 'assets/spaceup.png');  
        this.load.image('space2', 'assets/spacedown.png');
    }

    create() {
        console.log('*** introduction2 scene');

        // Background
        this.add.image(320, 320, 'introduction2');

        // === POSITIONS ===
        const btnSize   = 60;
        const btnRadius = 12;
        const centerX   = 460;
        const centerY   = 340;
        const gap       = 70;

        const arrowData = [
            { x: centerX,       y: centerY - gap, key: 'arrow_up'    },
            { x: centerX + gap, y: centerY,       key: 'arrow_right' },
            { x: centerX,       y: centerY + gap, key: 'arrow_down'  },
            { x: centerX - gap, y: centerY,       key: 'arrow_left'  },
        ];

        const dimColor  = 0x8888bb;
        const highlight = 0xffffff;
        const arrowObjects = [];

        arrowData.forEach(({ x, y, key }) => {
            // Rounded rectangle background
            const gfx = this.add.graphics();
            gfx.fillStyle(dimColor, 0.45);
            gfx.fillRoundedRect(x - btnSize / 2, y - btnSize / 2, btnSize, btnSize, btnRadius);

            // Your custom arrow image on top
            const img = this.add.image(x, y, key);
            img.setDisplaySize(36, 36); // adjust size to fit inside button
            img.setAlpha(0.5);          // dim when inactive

            arrowObjects.push({ gfx, img, x, y, btnSize, btnRadius });
        });

        // === CYCLE ANIMATION ===
        let currentIndex = 0;

        const resetAll = () => {
            arrowObjects.forEach(({ gfx, img, x, y, btnSize, btnRadius }) => {
                gfx.clear();
                gfx.fillStyle(dimColor, 0.45);
                gfx.fillRoundedRect(x - btnSize / 2, y - btnSize / 2, btnSize, btnSize, btnRadius);
                img.setAlpha(0.5);
                img.setScale(1.0);
            });
        };

        const highlightArrow = () => {
            resetAll();

            const { gfx, img, x, y, btnSize, btnRadius } = arrowObjects[currentIndex];

            // Bright background
            gfx.clear();
            gfx.fillStyle(highlight, 0.95);
            gfx.fillRoundedRect(x - btnSize / 2, y - btnSize / 2, btnSize, btnSize, btnRadius);

            // Brighten arrow image
            img.setAlpha(1.0);

            // Slow pop tween
            this.tweens.add({
                targets: img,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 300,  // slower pop
                yoyo: true,
                ease: 'Sine.easeInOut'
            });

            currentIndex = (currentIndex + 1) % arrowObjects.length;
        };

        highlightArrow();
        this.time.addEvent({
            delay: 900,         // slower cycle - 900ms between each
            callback: highlightArrow,
            loop: true
        });

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

        // === SPACEBAR to next scene ===
        var spaceDown = this.input.keyboard.addKey('SPACE');
        spaceDown.on('down', function () {
            console.log('Jump to level1intro scene');
            this.scene.start('level1intro', {});
        }, this);
    }
}