var config = {
    type: Phaser.AUTO,
    pixelArt: true,
    // pixel size * tile map size * zoom 
    width: 32 * 20, //640wx640h
    height: 32 * 20, 
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#000000',
    pixelArt: true,
    scene: [main, introduction2, house, room1,room2,room3, level2intro, level1intro, level3intro, gameover, winscene]
};

var game = new Phaser.Game(config);

let life = 2

let bg_music