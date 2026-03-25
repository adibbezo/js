class room3 extends Phaser.Scene {
  constructor() {
    super({ key: "room3" });
  }

  init(data) {
    this.inventory = data.inventory || [];
    this.fromScene = data.fromScene || "room2";
  }

  preload() {
    this.load.tilemapTiledJSON("neighbourhoodmap", "assets/neighbourhood32x32.tmj");
    this.load.image("train", "assets/13_train.png");
    this.load.image("avila", "assets/22_avila.png");
    this.load.image("road", "assets/23_road.png");
    this.load.image("sign", "assets/24_sign.png");
    this.load.image("school", "assets/25_school.png");
    this.load.image("subway", "assets/26_subway.png");
    this.load.image("roombuilder", "assets/3_roombuilder.png");
    this.load.spritesheet("aiman", "assets/aiman-64x64.png", { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    console.log("*** room3 scene");

    let map = this.make.tilemap({ key: "neighbourhoodmap" });
    let trainTiles         = map.addTilesetImage("13_train", "train");
    let avilaTiles         = map.addTilesetImage("22_avila", "avila");
    let roadTiles         = map.addTilesetImage("23_road", "road");
    let signTiles         = map.addTilesetImage("24_sign", "sign");
    let schoolTiles         = map.addTilesetImage("25_school", "school");
    let subwayTiles         = map.addTilesetImage("26_subway", "subway");
    let roombuilderTiles   = map.addTilesetImage("Room_Builder_32x32", "roombuilder");

    let tilesArray = [
    trainTiles, roombuilderTiles, avilaTiles, roadTiles, signTiles, schoolTiles, subwayTiles 
    ];
    this.FloorLayer2  = map.createLayer("BaseLayer2",   tilesArray, 0, 0);
    this.FloorLayer  = map.createLayer("BaseLayer",   tilesArray, 0, 0);
    this.RailLayer  = map.createLayer("RailLayer",  tilesArray, 0, 0);
    this.ItemLayer   = map.createLayer("ItemLayer",   tilesArray, 0, 0);
    this.ItemLayer2  = map.createLayer("ItemLayer2",  tilesArray, 0, 0);
    this.ItemLayer3  = map.createLayer("ItemLayer3",  tilesArray, 0, 0);

    let townspawn = map.findObject("Object", (obj) => obj.name === "townspawn");
    let spawnX = townspawn ? townspawn.x : 100;
    let spawnY = townspawn ? townspawn.y : 100;

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
    this.ItemLayer.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, this.ItemLayer);

    this.ItemLayer2.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, this.ItemLayer2);

    this.ItemLayer3.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, this.ItemLayer3);

    // Key "2" - go back to room2
    this.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
  }

  update() {
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

 if (
      this.player.x > 3919 &&
      this.player.x < 3972 &&
      this.player.y > 663 &&
      this.player.y < 696
    ) {
      console.log("*** Player entering winscene");
      this.scene.start("winscene", {
        inventory: this.inventory,
      });
    }
  
  }
}

