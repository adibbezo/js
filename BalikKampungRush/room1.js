class room1 extends Phaser.Scene {
  constructor() {
    super({ key: "room1" });
  }

  init(data) {
    this.inventory = data.inventory || [];
    this.fromScene = data.fromScene || "world";
  }

  preload() {
    this.load.tilemapTiledJSON("room", "assets/room32x32.tmj");
    this.load.image("gatherdeco1", "assets/1_gatherdeco1.png");
    this.load.image("gatherdeco2", "assets/2_gatherdeco2.png");
    this.load.image("roombuilder", "assets/3_roombuilder.png");
    this.load.image("bedroom", "assets/4_bedroom.png");
    this.load.image("bathroom", "assets/5_bathroom.png");
    this.load.image("kitchen", "assets/6_kitchen.png");
    this.load.image("livingroom", "assets/7_livingroom.png");
    this.load.spritesheet("aiman", "assets/aimannaked-64x64.png", { frameWidth: 64, frameHeight: 64 });
    this.load.image('shirt', 'assets/shirt.png');
    this.load.audio('collect', 'assets/collect.wav');
  }

  create() {
    console.log("*** room1 scene");

    this.shirtCollected = false;
    this.warningActive = false;
    this.sceneReady = false;

    this.collectSound = this.sound.add('collect', { volume: 0.5 });

    let map = this.make.tilemap({ key: "room" });

    let gatherdecoTiles  = map.addTilesetImage("1_gatherdeco1", "gatherdeco1");
    let gatherdeco2Tiles = map.addTilesetImage("2_gatherdeco2", "gatherdeco2");
    let roombuilderTiles = map.addTilesetImage("Room_Builder_32x32", "roombuilder");
    let bedroomTiles     = map.addTilesetImage("4_bedroom", "bedroom");
    let bathroomTiles    = map.addTilesetImage("5_bathroom", "bathroom");
    let kitchenTiles     = map.addTilesetImage("6_kitchen", "kitchen");
    let livingroomTiles  = map.addTilesetImage("7_livingroom", "livingroom");

    let tilesArray = [
      gatherdecoTiles,
      gatherdeco2Tiles,
      roombuilderTiles,
      bedroomTiles,
      bathroomTiles,
      kitchenTiles,
      livingroomTiles,
    ];

    this.FloorLayer   = map.createLayer("BaseLayer",    tilesArray, 0, 0);
    this.BorderLayer  = map.createLayer("BorderLayer",  tilesArray, 0, 0);
    this.BorderLayer2 = map.createLayer("BorderLayer2", tilesArray, 0, 0);
    this.ItemLayer    = map.createLayer("ItemLayer",    tilesArray, 0, 0);
    this.ItemLayer2   = map.createLayer("ItemLayer2",   tilesArray, 0, 0);
    this.ItemLayer3   = map.createLayer("ItemLayer3",   tilesArray, 0, 0);

    // Find spawn point
    let roomspawn = map.findObject("Object", (obj) => obj.name === "roomspawn");
    let spawnX = roomspawn ? roomspawn.x : 100;
    let spawnY = roomspawn ? roomspawn.y : 100;

    // Find shirt object from Tiled
    let shirt = map.findObject("Object", (obj) => obj.name === "shirt");

    // Collectible sprite
    this.shirt = this.physics.add.sprite(shirt.x, shirt.y, 'shirt');

    // Float tween
    const addFloat = (target) => {
      this.tweens.add({
        targets: target,
        y: target.y - 8,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    };
    addFloat(this.shirt);

    // Player animations
    if (!this.anims.exists("aiman-up")) {
      this.anims.create({
        key: "aiman-up",
        frames: this.anims.generateFrameNumbers("aiman", { start: 105, end: 112 }),
        frameRate: 5, repeat: -1,
      });
    }
    if (!this.anims.exists("aiman-left")) {
      this.anims.create({
        key: "aiman-left",
        frames: this.anims.generateFrameNumbers("aiman", { start: 118, end: 125 }),
        frameRate: 5, repeat: -1,
      });
    }
    if (!this.anims.exists("aiman-down")) {
      this.anims.create({
        key: "aiman-down",
        frames: this.anims.generateFrameNumbers("aiman", { start: 131, end: 138 }),
        frameRate: 5, repeat: -1,
      });
    }
    if (!this.anims.exists("aiman-right")) {
      this.anims.create({
        key: "aiman-right",
        frames: this.anims.generateFrameNumbers("aiman", { start: 144, end: 151 }),
        frameRate: 5, repeat: -1,
      });
    }

    // Create player
    this.player = this.physics.add.sprite(spawnX, spawnY, "aiman").setScale(1.2);
    window.player = this.player;
    this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.6);

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

    this.ItemLayer3.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, this.ItemLayer3);

    this.physics.add.overlap(this.player, this.shirt, this.collectshirt, null, this);

    // --- Warning text ---
    const cam = this.cameras.main;
    this.warningText = this.add.text(cam.width / 2, cam.height - 80,
      "Collect an item in this room first!",
      {
        fontSize: '20px',
        fill: '#ff0000',
        fontStyle: 'bold',
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(100)
    .setAlpha(0);

    this.wakeOverlay = this.add.rectangle(
      cam.width / 2, cam.height / 2,
      cam.width, cam.height,
      0x000000, 1
    )
    .setScrollFactor(0)
    .setDepth(200);

    this.time.delayedCall(800, () => {
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

  showWarning() {
    if (this.warningActive) return;
    this.warningActive = true;

    this.tweens.killTweensOf(this.warningText);

    this.warningText.setAlpha(1);
    this.tweens.add({
      targets: this.warningText,
      alpha: 0,
      delay: 2000,
      duration: 600,
      ease: 'Linear',
      onComplete: () => {
        this.warningActive = false;
      }
    });
  }

  collectshirt(player, shirt) {
    shirt.destroy();
    this.shirtCollected = true;
    this.inventory.push('shirt');
    this.collectSound.play();
    console.log("Shirt collected!", this.inventory);
  }

  update() {
    // Block movement during wake-up sequence
    if (!this.sceneReady) {
      this.player.body.setVelocity(0, 0);
      this.player.anims.stop();
      return;
    }

    let speed = 400;

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
      this.player.body.setVelocityY(0);
      this.player.anims.play("aiman-left", true);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
      this.player.body.setVelocityY(0);
      this.player.anims.play("aiman-right", true);
    } else if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
      this.player.body.setVelocityX(0);
      this.player.anims.play("aiman-up", true);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
      this.player.body.setVelocityX(0);
      this.player.anims.play("aiman-down", true);
    } else {
      this.player.anims.stop();
      this.player.body.setVelocity(0, 0);
    }

    // Exit zone — requires shirt to be collected first
    if (
      this.player.x > 1396 &&
      this.player.x < 1463 &&
      this.player.y > 983 &&
      this.player.y < 1064
    ) {
      if (!this.shirtCollected) {
        this.showWarning();
      } else {
        console.log("*** Player entering house");
        this.scene.start("house", {
          inventory: this.inventory
        });
      }
    }
  }
}