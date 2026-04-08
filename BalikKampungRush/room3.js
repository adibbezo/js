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
    this.load.image("garage", "assets/27_garage.png");
    this.load.image("fences", "assets/28_fences.png");
    this.load.image("roombuilder", "assets/3_roombuilder.png");
    
    this.load.spritesheet("aimanpants", "assets/aimanpants-64x64.png", { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet("cow", "assets/cow.png", { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    console.log("*** room3 scene");

    let map = this.make.tilemap({ key: "neighbourhoodmap" });
    let trainTiles          = map.addTilesetImage("13_train", "train");
    let avilaTiles          = map.addTilesetImage("22_avila", "avila");
    let roadTiles           = map.addTilesetImage("23_road", "road");
    let signTiles           = map.addTilesetImage("24_sign", "sign");
    let schoolTiles         = map.addTilesetImage("25_school", "school");
    let subwayTiles         = map.addTilesetImage("26_subway", "subway");
    let garageTiles         = map.addTilesetImage("27_garage", "garage");
    let fencesTiles         = map.addTilesetImage("28_fences", "fences");
    let roombuilderTiles    = map.addTilesetImage("Room_Builder_32x32", "roombuilder");

    let tilesArray = [
      trainTiles, roombuilderTiles, avilaTiles, roadTiles, signTiles, schoolTiles, subwayTiles, garageTiles, fencesTiles 
    ];
    
    this.FloorLayer2  = map.createLayer("BaseLayer2",   tilesArray, 0, 0);
    this.FloorLayer   = map.createLayer("BaseLayer",    tilesArray, 0, 0);
    this.RailLayer    = map.createLayer("RailLayer",    tilesArray, 0, 0);
    this.ItemLayer    = map.createLayer("ItemLayer",    tilesArray, 0, 0);
    this.ItemLayer2   = map.createLayer("ItemLayer2",   tilesArray, 0, 0);
    this.ItemLayer3   = map.createLayer("ItemLayer3",   tilesArray, 0, 0);

    // --- FIXED: Expand the physics world and camera bounds to match the Tiled Map ---
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    let townspawn = map.findObject("Object", (obj) => obj.name === "townspawn");
    let spawnX = townspawn ? townspawn.x : 100;
    let spawnY = townspawn ? townspawn.y : 100;

    // --- Player animations ---
    if (!this.anims.exists("aimanpants-up")) {
      this.anims.create({
        key: "aimanpants-up",
        frames: this.anims.generateFrameNumbers("aimanpants", { start: 105, end: 112 }),
        frameRate: 5, repeat: -1,
      });
    }
    if (!this.anims.exists("aimanpants-left")) {
      this.anims.create({
        key: "aimanpants-left",
        frames: this.anims.generateFrameNumbers("aimanpants", { start: 118, end: 125 }),
        frameRate: 5, repeat: -1,
      });
    }
    if (!this.anims.exists("aimanpants-down")) {
      this.anims.create({
        key: "aimanpants-down",
        frames: this.anims.generateFrameNumbers("aimanpants", { start: 131, end: 138 }),
        frameRate: 5, repeat: -1,
      });
    }
    if (!this.anims.exists("aimanpants-right")) {
      this.anims.create({
        key: "aimanpants-right",
        frames: this.anims.generateFrameNumbers("aimanpants", { start: 144, end: 151 }),
        frameRate: 5, repeat: -1,
      });
    }

    // --- Cow Animations mapped to the 32x32 grid ---
    this.createCowAnims();

    // --- Create player ---
    this.player = this.physics.add.sprite(spawnX, spawnY, "aimanpants").setScale(1.2);
    window.player = this.player;
    this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.6);
    this.player.setCollideWorldBounds(true); // Now this works perfectly!

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.player);

    // --- Layer Collisions ---
    this.ItemLayer.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, this.ItemLayer);

    this.ItemLayer2.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, this.ItemLayer2);

    this.ItemLayer3.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, this.ItemLayer3);

    // --- Spawn the cows ---
    this.cowSprites = this.physics.add.group();
    const cowNames = ["cow1", "cow2", "cow3", "cow4", "cow5", "cow6", "cow7"];

    cowNames.forEach((cowName) => {
      let cowObj = map.findObject("Object", (obj) => obj.name === cowName);
      
      if (cowObj) {
        let cow = this.physics.add.sprite(cowObj.x, cowObj.y, "cow").setScale(1.5);
        cow.setName(cowName);
        cow.body.setImmovable(true);
        cow.body.setSize(20, 20); // Make the hitbox match the smaller cow

        cow.anims.play("cow-idle", true);
        
        // Start wandering
        this.time.addEvent({
          delay: Phaser.Math.Between(2000, 5000),
          loop: true,
          callback: () => this.wanderCow(cow),
          callbackScope: this,
        });

        this.cowSprites.add(cow);
      }
    });

    // Make the player collide with the cows
    this.physics.add.collider(this.player, this.cowSprites);

    // --- Key "2" - go back to room2 ---
    this.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
  }

  createCowAnims() {
    // Top row (Idle looking right)
    if (!this.anims.exists("cow-idle")) {
        this.anims.create({
            key: "cow-idle",
            frames: this.anims.generateFrameNumbers("cow", { start: 0, end: 2 }),
            frameRate: 3, repeat: -1
        });
    }
    // Row 5 (Walking sideways - Right)
    if (!this.anims.exists("cow-walk-side")) {
        this.anims.create({
            key: "cow-walk-side",
            frames: this.anims.generateFrameNumbers("cow", { start: 16, end: 19 }),
            frameRate: 4, repeat: -1
        });
    }
    // Row 6 (Walking Down/Front)
    if (!this.anims.exists("cow-walk-down")) {
        this.anims.create({
            key: "cow-walk-down",
            frames: this.anims.generateFrameNumbers("cow", { start: 20, end: 23 }),
            frameRate: 4, repeat: -1
        });
    }
    // Row 7 (Walking Up/Back)
    if (!this.anims.exists("cow-walk-up")) {
        this.anims.create({
            key: "cow-walk-up",
            frames: this.anims.generateFrameNumbers("cow", { start: 24, end: 27 }),
            frameRate: 4, repeat: -1
        });
    }
  }

  wanderCow(cow) {
    if (!cow.active) return;
    
    // Pick a random direction, or tell it to just stand still (idle)
    const directions = ["right", "left", "down", "up", "idle", "idle"];
    const dir = Phaser.Utils.Array.GetRandom(directions);
    
    const speed = 25; // Slow cow pace
    const duration = Phaser.Math.Between(1000, 2500); // Walk for 1 to 2.5 seconds

    let vx = 0;
    let vy = 0;

    if (dir === "right") {
        vx = speed;
        cow.setFlipX(false); // Face normal
        cow.anims.play("cow-walk-side", true);
    } else if (dir === "left") {
        vx = -speed;
        cow.setFlipX(true); // Flip horizontally to face left!
        cow.anims.play("cow-walk-side", true);
    } else if (dir === "down") {
        vy = speed;
        cow.anims.play("cow-walk-down", true);
    } else if (dir === "up") {
        vy = -speed;
        cow.anims.play("cow-walk-up", true);
    } else {
        cow.anims.play("cow-idle", true);
    }

    cow.body.setVelocity(vx, vy);

    // Stop walking when the timer finishes
    this.time.delayedCall(duration, () => {
      if (cow.active) {
          cow.body.setVelocity(0, 0);
          cow.anims.play("cow-idle", true);
      }
    });
  }

  update() {
    let speed = 400;

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
      this.player.body.setVelocityY(0);
      this.player.anims.play("aimanpants-left", true);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
      this.player.body.setVelocityY(0);
      this.player.anims.play("aimanpants-right", true);
    } else if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
      this.player.body.setVelocityX(0);
      this.player.anims.play("aimanpants-up", true);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
      this.player.body.setVelocityX(0);
      this.player.anims.play("aimanpants-down", true);
    } else {
      this.player.anims.stop();
      this.player.body.setVelocity(0, 0);
    }

    // Go back to room 2
    if (Phaser.Input.Keyboard.JustDown(this.key2)) {
        this.scene.start("room2", { inventory: this.inventory });
    }

    // Win condition check
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