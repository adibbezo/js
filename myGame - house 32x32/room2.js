class room2 extends Phaser.Scene {
  constructor() {
    super({ key: "room2" });
  }

  init(data) {
    this.inventory = data.inventory || [];
    this.fromScene = data.fromScene || "world";
  }

  preload() {
    this.load.tilemapTiledJSON("trainmap", "assets/trainstation.tmj");
    this.load.image("gatherdeco1", "assets/1_gatherdeco1.png");
    this.load.image("city", "assets/10_city.png");
    this.load.image("grocery", "assets/11_grocery.png");
    this.load.image("hospital", "assets/12_hospital.png");
    this.load.image("train", "assets/13_train.png");
    this.load.image("graffiti", "assets/19_graffiti32x32.png");
    this.load.image("gatherdeco2", "assets/2_gatherdeco2.png");
    this.load.image("bedroom", "assets/4_bedroom.png");
    this.load.image("bathroom", "assets/5_bathroom.png");
    this.load.image("kitchen", "assets/6_kitchen.png");
    this.load.image("livingroom", "assets/7_livingroom.png");
    this.load.image("generic", "assets/8_generic.png");
    this.load.image("airport", "assets/9_airport.png");
    this.load.image("roombuilder", "assets/3_roombuilder.png");
    
    // FIX: Changed comma to period in the filename
    this.load.spritesheet("aimanpants", "assets/aimanpants-64x64.png", { frameWidth: 64, frameHeight: 64 });
    
    this.load.image('ticket', 'assets/ticket.png');
    this.load.audio('collect', 'assets/collect.wav');
  }

  create() {
    console.log("*** room2 scene");

    // Add sound for collecting collectibles
    this.collectSound = this.sound.add('collect', { volume: 0.5 });
    let map = this.make.tilemap({ key: "trainmap" });

    let gatherdecoTiles  = map.addTilesetImage("1_gatherdeco1", "gatherdeco1");
    let cityTiles        = map.addTilesetImage("10_city", "city");
    let groceryTiles     = map.addTilesetImage("11_grocery", "grocery");
    let hospitalTiles    = map.addTilesetImage("12_hospital", "hospital");
    let trainTiles       = map.addTilesetImage("13_train", "train");
    let gatherdeco2Tiles = map.addTilesetImage("2_gatherdeco2", "gatherdeco2");
    let bedroomTiles     = map.addTilesetImage("4_bedroom", "bedroom");
    let bathroomTiles    = map.addTilesetImage("5_bathroom", "bathroom");
    let kitchenTiles     = map.addTilesetImage("6_kitchen", "kitchen");
    let livingroomTiles  = map.addTilesetImage("7_livingroom", "livingroom");
    let genericTiles     = map.addTilesetImage("8_generic", "generic");
    let airportTiles     = map.addTilesetImage("9_airport", "airport");
    let roombuilderTiles = map.addTilesetImage("Room_Builder_32x32", "roombuilder");
    let graffitiTiles    = map.addTilesetImage("19_graffiti32x32", "graffiti");

    let tilesArray = [
      gatherdecoTiles, cityTiles, groceryTiles, hospitalTiles,
      trainTiles, gatherdeco2Tiles, bedroomTiles, bathroomTiles,
      kitchenTiles, livingroomTiles, genericTiles, airportTiles,
      roombuilderTiles, graffitiTiles,
    ];

    this.FloorLayer2    = map.createLayer("BaseLayer2",     tilesArray, 0, 0);
    this.RailLayer      = map.createLayer("RailLayer",      tilesArray, 0, 0);
    this.TrainLayer     = map.createLayer("TrainLayer",     tilesArray, 0, 0);
    this.FloorLayer     = map.createLayer("BaseLayer",      tilesArray, 0, 0);
    this.BorderLayer    = map.createLayer("BorderLayer",    tilesArray, 0, 0);
    this.BorderLayer2   = map.createLayer("BorderLayer2",   tilesArray, 0, 0);
    this.ItemLayer      = map.createLayer("ItemLayer",      tilesArray, 0, 0);
    this.ItemLayer2     = map.createLayer("ItemLayer2",     tilesArray, 0, 0);
    this.ItemLayer3     = map.createLayer("ItemLayer3",     tilesArray, 0, 0);
    this.BorderLayer3   = map.createLayer("BorderLayer3",   tilesArray, 0, 0);
    this.EscalatorLayer = map.createLayer("EscalatorLayer", tilesArray, 0, 0);

    // Find spawn
    let trainspawn = map.findObject("Object", (obj) => obj.name === "trainspawn");
    let spawnX = trainspawn ? trainspawn.x : 100;
    let spawnY = trainspawn ? trainspawn.y : 100;

    // Player animations
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

    // Create player first
    this.player = this.physics.add.sprite(spawnX, spawnY, "aimanpants").setScale(1.2);
    window.player = this.player;
    this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.6);

    // Float tween helper
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

    this.ticketsCollected = 0;
    this.isTransitioning = false; // FIX: Flag to prevent scene starting multiple times

    const iconSize = 32;
    const padding  = 18;
    const gap      = 12;
    const marginX  = 8;
    const marginY  = 8;
    const totalW   = padding + (iconSize * 3) + (gap * 2) + padding;
    const totalH   = padding + iconSize + padding;

    const startX = marginX + padding + iconSize / 2;
    const iconY  = marginY + totalH / 2;

    this.hudSlot1 = this.add.image(startX,                    iconY, 'ticket')
      .setScrollFactor(0).setDepth(21).setDisplaySize(iconSize, iconSize).setAlpha(0.3);
    this.hudSlot2 = this.add.image(startX + iconSize + gap,   iconY, 'ticket')
      .setScrollFactor(0).setDepth(21).setDisplaySize(iconSize, iconSize).setAlpha(0.3);
    this.hudSlot3 = this.add.image(startX + (iconSize+gap)*2, iconY, 'ticket')
      .setScrollFactor(0).setDepth(21).setDisplaySize(iconSize, iconSize).setAlpha(0.3);

    this.hudSlots = [this.hudSlot1, this.hudSlot2, this.hudSlot3];

    // Find ticket objects from Tiled
    let ticket1obj = map.findObject("Object", (obj) => obj.name === "ticket1");
    let ticket2obj = map.findObject("Object", (obj) => obj.name === "ticket2");
    let ticket3obj = map.findObject("Object", (obj) => obj.name === "ticket3");

    if (ticket1obj) {
      this.ticket1 = this.physics.add.sprite(ticket1obj.x, ticket1obj.y, 'ticket');
      addFloat(this.ticket1);
      this.physics.add.overlap(this.player, this.ticket1, (p, t) => {
        t.destroy();
        this.inventory.push('ticket1');
        this.collectSound.play();
        this.ticketsCollected++;
        this.updateHUD();
        console.log('ticket1 collected!', this.inventory);
      }, null, this);
    }

    if (ticket2obj) {
      this.ticket2 = this.physics.add.sprite(ticket2obj.x, ticket2obj.y, 'ticket');
      addFloat(this.ticket2);
      this.physics.add.overlap(this.player, this.ticket2, (p, t) => {
        t.destroy();
        this.inventory.push('ticket2');
        this.collectSound.play();
        this.ticketsCollected++;
        this.updateHUD();
        console.log('ticket2 collected!', this.inventory);
      }, null, this);
    }

    if (ticket3obj) {
      this.ticket3 = this.physics.add.sprite(ticket3obj.x, ticket3obj.y, 'ticket');
      addFloat(this.ticket3);
      this.physics.add.overlap(this.player, this.ticket3, (p, t) => {
        t.destroy();
        this.inventory.push('ticket3');
        this.collectSound.play();
        this.ticketsCollected++;
        this.updateHUD();
        console.log('ticket3 collected!', this.inventory);
      }, null, this);
    }

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.player);

    // Collisions
    this.BorderLayer.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, this.BorderLayer);

    this.BorderLayer2.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, this.BorderLayer2);

    this.BorderLayer3.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, this.BorderLayer3);

    this.ItemLayer.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, this.ItemLayer);

    this.ItemLayer2.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, this.ItemLayer2);

    this.ItemLayer3.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, this.ItemLayer3);

    // Key "2" - go back to world
    this.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
  }

  updateHUD() {
    // FIX: Only trigger scene transition if we aren't already transitioning
    if (this.isTransitioning) return;

    // 1. Update the alphas for all slots
    for (let i = 0; i < this.hudSlots.length; i++) {
      if (i < this.ticketsCollected) {
        this.hudSlots[i].setAlpha(1);
      } else {
        this.hudSlots[i].setAlpha(0.3);
      }
    }

    // FIX: 2. Only tween the newly collected ticket slot
    if (this.ticketsCollected > 0 && this.ticketsCollected <= this.hudSlots.length) {
      let currentSlot = this.hudSlots[this.ticketsCollected - 1];
      this.tweens.add({
        targets: currentSlot,
        scaleX: 1.2, scaleY: 1.2,
        duration: 100, yoyo: true,
      });
    }

    // FIX: 3. Check for scene transition and set flag
    if (this.ticketsCollected >= 3) {
      console.log('All tickets collected! Going to room3...');
      this.isTransitioning = true; 
      this.time.delayedCall(800, () => {
        this.scene.start("level3intro", { inventory: this.inventory });
      });
    }
  }

  update() {
    let speed = 400;

    // FIX: Check if key "2" is pressed to trigger scene change
    if (Phaser.Input.Keyboard.JustDown(this.key2)) {
      this.scene.start(this.fromScene, { inventory: this.inventory });
    }

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
  }
}