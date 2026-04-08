class house extends Phaser.Scene {
  constructor() {
    super({
      key: "house",
    });
  }

  init(data) {
    this.inventory = data.inventory || [];
    this.life = 2;
    this.sceneReady = false;
  }

  preload() {
    this.load.tilemapTiledJSON("world", "assets/house32x32.tmj");
    this.load.image("gatherdeco1", "assets/1_gatherdeco1.png");
    this.load.image("gatherdeco2", "assets/2_gatherdeco2.png");
    this.load.image("roombuilder", "assets/3_roombuilder.png");
    this.load.image("bedroom", "assets/4_bedroom.png");
    this.load.image("bathroom", "assets/5_bathroom.png");
    this.load.image("kitchen", "assets/6_kitchen.png");
    this.load.image("livingroom", "assets/7_livingroom.png");
    this.load.image("airport", "assets/9_airport.png");
    this.load.spritesheet("aimanshirt", "assets/aimanshirt-64x64.png", { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet("abc", "assets/wallet.png", { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet("enemy1", "assets/enemy1.png", { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet("enemy2", "assets/enemy2.png", { frameWidth: 64, frameHeight: 64 });
    this.load.image('key', 'assets/key.png');
    this.load.image('pants', 'assets/pants.png');
    this.load.image('heart', 'assets/heart.png');
    this.load.audio('collect', 'assets/collect.wav');
    this.load.audio('hit', 'assets/hit.mp3');
    this.load.audio('door', 'assets/door.m4a');
  }

  create() {
    console.log("*** world scene");

    this.sceneReady = false;

    // Sound
    this.collectSound = this.sound.add('collect', { volume: 0.5 });
    this.hitSound     = this.sound.add('hit',     { volume: 0.7 });
    this.doorSound    = this.sound.add('door',    { volume: 0.7 });

    this.hearts = [];
    for (let i = 0; i < 2; i++) {
      const heart = this.add.image(30 + (i * 40), 30, 'heart')
        .setScrollFactor(0)
        .setDepth(999)
        .setScale(0.5);
      this.hearts.push(heart);
    }

    //Find exit
    const cam = this.cameras.main;
    this.findExitText = this.add.text(cam.width / 2, cam.height - 80,
      "Find the exit!",
      {
        fontSize: '20px',
        fill: '#00ff00',
        fontStyle: 'bold',
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(100)
    .setAlpha(0);

    // Tilemap
    let map = this.make.tilemap({ key: "world" });

    let gatherdecoTiles  = map.addTilesetImage("1_gatherdeco1",      "gatherdeco1");
    let gatherdeco2Tiles = map.addTilesetImage("2_gatherdeco2",      "gatherdeco2");
    let roombuilderTiles = map.addTilesetImage("Room_Builder_32x32", "roombuilder");
    let bedroomTiles     = map.addTilesetImage("4_bedroom",          "bedroom");
    let bathroomTiles    = map.addTilesetImage("5_bathroom",         "bathroom");
    let kitchenTiles     = map.addTilesetImage("6_kitchen",          "kitchen");
    let livingroomTiles  = map.addTilesetImage("7_livingroom",       "livingroom");
    let airportTiles     = map.addTilesetImage("9_airport",          "airport");

    let tilesArray = [
      gatherdecoTiles,
      gatherdeco2Tiles,
      roombuilderTiles,
      bedroomTiles,
      bathroomTiles,
      kitchenTiles,
      livingroomTiles,
      airportTiles,
    ];

    this.FloorLayer    = map.createLayer("BaseLayer",     tilesArray, 0, 0);
    this.BorderLayer   = map.createLayer("BorderLayer",   tilesArray, 0, 0);
    this.BorderLayer2  = map.createLayer("BorderLayer2",  tilesArray, 0, 0);
    this.ItemLayer     = map.createLayer("ItemLayer",     tilesArray, 0, 0);
    this.ItemLayer2    = map.createLayer("ItemLayer2",    tilesArray, 0, 0);
    this.BathroomLayer = map.createLayer("BathroomLayer", tilesArray, 0, 0);

    // Player animations
    if (!this.anims.exists("aimanshirt-up")) {
      this.anims.create({
        key: "aimanshirt-up",
        frames: this.anims.generateFrameNumbers("aimanshirt", { start: 105, end: 112 }),
        frameRate: 5,
        repeat: -1,
      });
    }
    if (!this.anims.exists("aimanshirt-left")) {
      this.anims.create({
        key: "aimanshirt-left",
        frames: this.anims.generateFrameNumbers("aimanshirt", { start: 118, end: 125 }),
        frameRate: 5,
        repeat: -1,
      });
    }
    if (!this.anims.exists("aimanshirt-down")) {
      this.anims.create({
        key: "aimanshirt-down",
        frames: this.anims.generateFrameNumbers("aimanshirt", { start: 131, end: 138 }),
        frameRate: 5,
        repeat: -1,
      });
    }
    if (!this.anims.exists("aimanshirt-right")) {
      this.anims.create({
        key: "aimanshirt-right",
        frames: this.anims.generateFrameNumbers("aimanshirt", { start: 144, end: 151 }),
        frameRate: 5,
        repeat: -1,
      });
    }

    // Enemy animations
    if (!this.anims.exists("gen-up")) {
      this.anims.create({
        key: "gen-up",
        frames: this.anims.generateFrameNumbers("enemy2", { start: 105, end: 112 }),
        frameRate: 5,
        repeat: -1,
      });
    }
    if (!this.anims.exists("gen-left")) {
      this.anims.create({
        key: "gen-left",
        frames: this.anims.generateFrameNumbers("enemy1", { start: 118, end: 125 }),
        frameRate: 5,
        repeat: -1,
      });
    }
    if (!this.anims.exists("gen-down")) {
      this.anims.create({
        key: "gen-down",
        frames: this.anims.generateFrameNumbers("enemy2", { start: 131, end: 138 }),
        frameRate: 5,
        repeat: -1,
      });
    }
    if (!this.anims.exists("gen-right")) {
      this.anims.create({
        key: "gen-right",
        frames: this.anims.generateFrameNumbers("enemy1", { start: 144, end: 151 }),
        frameRate: 5,
        repeat: -1,
      });
    }

    // Find objects from Tiled
    let abc    = map.findObject("Object", (obj) => obj.name === "abc");
    let spawn  = map.findObject("Object", (obj) => obj.name === "spawn");
    let enemy1 = map.findObject("Object", (obj) => obj.name === "enemy1");
    let enemy2 = map.findObject("Object", (obj) => obj.name === "enemy2");
    let key    = map.findObject("Object", (obj) => obj.name === "key");
    let pants  = map.findObject("Object", (obj) => obj.name === "pants");
    console.log("wallet position:", abc.x, abc.y);

    // Collectible sprites
    this.wallet = this.physics.add.sprite(abc.x,   abc.y,   'abc');
    this.key    = this.physics.add.sprite(key.x,   key.y,   'key');
    this.pants  = this.physics.add.sprite(pants.x, pants.y, 'pants');

    // Spawn player
    let spawnX = spawn ? spawn.x : 100;
    let spawnY = spawn ? spawn.y : 100;

    this.player = this.physics.add.sprite(spawnX, spawnY, "aiman").setScale(1.2);
    window.player = this.player;
    this.player.body.setSize(this.player.width * 0.6, this.player.height * 0.7);

    this.enemy1 = this.physics.add.sprite(enemy1.x, enemy1.y, "enemy1").setScale(1.2);
    this.enemy1.body.setSize(this.enemy1.width * 0.6, this.enemy1.height * 0.7);

    this.enemy2 = this.physics.add.sprite(enemy2.x, enemy2.y, "enemy2").setScale(1.2).play("gen-left");
    this.enemy2.body.setSize(this.enemy2.width * 0.6, this.enemy2.height * 0.7);

    this.physics.add.overlap(this.player, [this.enemy1, this.enemy2], this.hitEnemy, null, this);

    // Enemy1 patrol (vertical)
    this.tweens.add({
      targets: this.enemy1,
      y: 1000,
      flipY: false,
      yoyo: true,
      duration: 4000,
      repeat: -1,
      onYoyo: () => { this.enemy1.play("gen-up"); },
      onRepeat: () => { this.enemy1.play("gen-down"); },
    });

    // Enemy2 patrol (horizontal)
    this.tweens.add({
      targets: this.enemy2,
      x: 1629,
      flipX: true,
      yoyo: true,
      duration: 3000,
      repeat: -1,
    });

    // Floating animation for collectibles
    const addFloat = (target) => {
      this.tweens.add({
        targets: target,
        y: target.y - 8,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    };

    addFloat(this.key);
    addFloat(this.pants);
    addFloat(this.wallet);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.player);

    // Collisions
    this.BorderLayer.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, this.BorderLayer);

    this.BorderLayer2.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, this.BorderLayer2);

    this.ItemLayer.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, this.ItemLayer);

    this.ItemLayer2.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, this.ItemLayer2);

    // Overlaps to collect
    this.physics.add.overlap(this.player, this.wallet, this.collectwallet, null, this);
    this.physics.add.overlap(this.player, this.key,    this.collectkey,    null, this);
    this.physics.add.overlap(this.player, this.pants,  this.collectpants,  null, this);

    this.key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);

    // --- Fade in overlay ---
    this.wakeOverlay = this.add.rectangle(
      cam.width / 2, cam.height / 2,
      cam.width, cam.height,
      0x000000, 1
    )
    .setScrollFactor(0)
    .setDepth(200);

    // Play door sound immediately when scene starts
    this.doorSound.play();

    // Hold black for 500ms then fade out over 1.5s (total ~2s)
    this.time.delayedCall(500, () => {
      this.tweens.add({
        targets: this.wakeOverlay,
        alpha: 0,
        duration: 1500,
        ease: 'Sine.easeOut',
        onComplete: () => {
          this.wakeOverlay.destroy();
          this.sceneReady = true;
        }
      });
    });
  }

  // Only shows after all 3 items collected
  showFindExit() {
    const hasWallet = this.inventory.includes('wallet');
    const hasKey    = this.inventory.includes('key');
    const hasPants  = this.inventory.includes('pants');

    if (!hasWallet || !hasKey || !hasPants) return;

    this.tweens.killTweensOf(this.findExitText);
    this.findExitText.setAlpha(1);
    this.tweens.add({
      targets: this.findExitText,
      alpha: 0,
      delay: 2000,
      duration: 600,
      ease: 'Linear',
    });
  }

  // Collectibles
  collectwallet(player, wallet) {
    wallet.destroy();
    this.collectSound.play();
    this.inventory.push('wallet');
    console.log("Wallet collected!");
    this.showFindExit();
  }

  collectkey(player, key) {
    key.destroy();
    this.collectSound.play();
    this.inventory.push('key');
    console.log("Key collected!");
    this.showFindExit();
  }

  collectpants(player, pants) {
    pants.destroy();
    this.collectSound.play();
    this.inventory.push('pants');
    console.log("Pants collected!");
    this.showFindExit();
  }

hitEnemy(player, enemy) {
  console.log("Player hit enemy");

  if (this.isHit) return;
  this.isHit = false; 

  this.hitSound.play();
  this.life--;
  this.cameras.main.shake(300);

  if (this.hearts[this.life]) {
    this.tweens.add({
      targets: this.hearts[this.life],
      scaleX: 0,
      scaleY: 0,
      duration: 200,
      ease: 'Back.easeIn',
      onComplete: () => {
        this.hearts[this.life].setVisible(true);
      }
    });
  }

  this.tweens.add({
    targets: this.player,
    alpha: 0.2,
    duration: 100,
    yoyo: true,
    repeat: 4,
    onComplete: () => {
      this.player.setAlpha(1);
      if (this.life > 0) {
        this.isHit = false;
      }
    },
  });

  enemy.disableBody(true, true);

  if (this.life <= 0) {
    this.time.delayedCall(400, () => {
      this.scene.start("gameover", {
        inventory: this.inventory,
      });
    });
  }
}

  update() {
    if (!this.sceneReady) {
      this.player.body.setVelocity(0, 0);
      this.player.anims.stop();
      return;
    }

    let speed = 400;

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
      this.player.body.setVelocityY(0);
      this.player.anims.play("aimanshirt-left", true);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
      this.player.body.setVelocityY(0);
      this.player.anims.play("aimanshirt-right", true);
    } else if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
      this.player.body.setVelocityX(0);
      this.player.anims.play("aimanshirt-up", true);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
      this.player.body.setVelocityX(0);
      this.player.anims.play("aimanshirt-down", true);
    } else {
      this.player.anims.stop();
      this.player.body.setVelocity(0, 0);
    }

    if (
      this.player.x > 1527 &&
      this.player.x < 1576 &&
      this.player.y > 81 &&
      this.player.y < 187
    ) {
      console.log("*** Player entering level2intro");
      this.scene.start("level2intro", {
        inventory: this.inventory,
      });
    }
  }
}