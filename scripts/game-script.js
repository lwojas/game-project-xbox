/*$(document).ready(function() {
	
	setTimeout(function() { 
		window.countFPS = (function () {
			var lastLoop = (new Date()).getMilliseconds();
			var count = 1;
			var fps = 0;

		return function () {
		    var currentLoop = (new Date()).getMilliseconds();
		    if (lastLoop > currentLoop) {
		 	    fps = count;
		    	count = 1;
		    } else {
		      	count += 1;
		    }
		    lastLoop = currentLoop;
		    scoreText.text = 'FPS ' + fps;
		    return fps;
			};
	}());

	(function loop() {
	    requestAnimationFrame(function () {
	      countFPS();
	      loop();
	    });
	}());
		}, 500);
});*/
navigator.gamepadInputEmulation = "gamepad";

var game = new Phaser.Game(160, 90, Phaser.CANVAS, '', { init: init, preload: preload, create: create, update: update, render: render });

function init() {
	Phaser.Canvas.setImageRenderingCrisp(game.canvas);
}

function preload() {
	game.load.image('sky', 'assets/background.png');
	game.load.image('foreground', 'assets/foreground.png');
	game.load.image('ground', 'assets/collision.png');
    game.load.image('platform', 'assets/platform2.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/hero2.png', 16, 16);
    game.load.image('car', 'assets/car.png');
    game.load.image('sign', 'assets/sign.png');
    game.load.spritesheet('button-left', 'assets/touch_controls_left.png', 20, 17);
    game.load.spritesheet('button-right', 'assets/touch_controls_right.png', 20, 17);
    game.load.spritesheet('button-A', 'assets/touch_controls_A.png', 20, 17);
}

var platforms;
var player;
var uiMessage;
var scoreText;
var speechBubble;
var gp;
var hasGP = true;
var facingRight = true;
var uiButtons;
var leftKey;
var rightKey;
var leftTouch = false;
var rightTouch = false;
var jumpTouch = false;

var controlKey;

function create() {
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	

	//game.stage.smoothed = false;
	//game.add.tileSprite(0, 0, 480, 500, 'sky');
	game.world.setBounds(0, 0, 480, 500);

	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

	controlKey = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);

	game.input.gamepad.start();
	//game.world.resize(480, 500);

	game.time.advancedTiming = true;
	game.physics.startSystem(Phaser.Physics.ARCADE);

	parallax1 = game.add.sprite(0,0, 'sky');

	game.add.sprite(0,0, 'foreground');

	platforms = game.add.group();
	platforms.enableBody = true;
	platforms.alpha = 0;
	//platforms.visible = false;

	var ground = platforms.create(0, game.world.height - 25, 'ground');

	ground.scale.setTo(48, 1);

	ground.body.immovable = true;

	//ground.visible = false;

	var ledge = platforms.create(0, 405, 'ground');

	ledge.scale.setTo(19, 3);

	ledge.body.immovable = true;


	ledge = platforms.create(230, 424, 'ground');

	ledge.body.immovable = true;

	ledge.scale.setTo(3.2, 3);


	ledge = platforms.create(214, 440, 'ground');

	ledge.body.immovable = true;

	ledge.scale.setTo(6.4, 3);


	ledge = platforms.create(270, 368, 'ground');

	ledge.body.immovable = true;

	ledge.scale.setTo(11.2, 1);


	ledge = platforms.create(179, 359, 'ground');

	ledge.body.immovable = true;

	ledge.scale.setTo(4.8, 3);


	ledge = platforms.create(0, 333, 'ground');

	ledge.body.immovable = true;

	ledge.scale.setTo(13.7, 3);


	ledge = platforms.create(0, 261, 'ground');

	ledge.body.immovable = true;

	ledge.scale.setTo(19.6, 3);


	ledge = platforms.create(230, 305, 'ground');

	ledge.body.immovable = true;

	ledge.scale.setTo(25, 3);


	player = game.add.sprite(32, game.world.height - 50, 'dude');

	player.anchor.setTo(.5, 1);

	game.physics.arcade.enable(player);

	player.body.setSize(10, 15, 3 , 1);
	player.body.bounce.y = 0;
	player.body.gravity.y = 400;
	player.body.collideWorldBounds = true;

	player.animations.add('left', [7, 8, 9, 10], 10, true);
	player.animations.add('right', [7, 8, 9, 10], 10, true);
	player.animations.add('idle', [0, 1, 2, 3], 10, true);

	var roxieCar = game.add.sprite(200, 457, 'car');



	game.camera.roundPx = false; // stops the sprite from jittering.
	game.camera.follow(player);

	//scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });

	uiButtons = game.add.group();
	uiButtons.alpha = .4;

	buttonleft = game.add.button(10, 65, 'button-left', null, this, 1, 0, 1, 0);  // Frame numbers correspond to up , down and over states for the button
    buttonleft.fixedToCamera = true;
    buttonleft.events.onInputOver.add(function(){leftTouch=true;});
    buttonleft.events.onInputOut.add(function(){leftTouch=false;});
    buttonleft.events.onInputDown.add(function(){leftTouch=true;});
    buttonleft.events.onInputUp.add(function(){leftTouch=false;});
    uiButtons.add(buttonleft);

    buttonright = game.add.button(40, 65, 'button-right', null, this, 1, 0, 1, 0);  
    buttonright.fixedToCamera = true;
    buttonright.events.onInputOver.add(function(){rightTouch=true;});
    buttonright.events.onInputOut.add(function(){rightTouch=false;});
    buttonright.events.onInputDown.add(function(){rightTouch=true;});
    buttonright.events.onInputUp.add(function(){rightTouch=false;});
    uiButtons.add(buttonright);

    buttonjump = game.add.button(130, 65, 'button-A', null, this, 1, 0, 1, 0);  
    buttonjump.fixedToCamera = true;
    buttonjump.events.onInputOver.add(function(){jumpTouch=true;});
    buttonjump.events.onInputOut.add(function(){jumpTouch=false;});
    buttonjump.events.onInputDown.add(function(){jumpTouch=true;});
    buttonjump.events.onInputUp.add(function(){jumpTouch=false;});
    uiButtons.add(buttonjump);
}

var isJumping = false;

function update() {
	parallax1.x = game.camera.x*0.1;
	var hitPlatform = game.physics.arcade.collide(player, platforms);
	gp = game.input.gamepad.pad1;
	player.body.velocity.x = 0;
	if (hasGP) {

		if ( facingRight ) {

			player.scale.x = 1;

		} else {

			player.scale.x = -1;
		}

		if (gp.isDown(Phaser.Gamepad.BUTTON_14) || leftKey.isDown || (leftTouch)) {

			facingRight = false;
			
			player.body.velocity.x = -100;

			if (!isJumping) {
				player.animations.play('left');
			};

		} else if (gp.isDown(Phaser.Gamepad.BUTTON_15) || rightKey.isDown || (rightTouch)) {

			facingRight = true;
			
			player.body.velocity.x = 100;

			if (!isJumping) {
				player.animations.play('right');
			};

		} else {
			if (!isJumping) {
				// player.animations.stop();
				// player.frame = 4;

				player.animations.play('idle');
			};
		};

		if (gp.isDown(Phaser.Gamepad.BUTTON_0) || controlKey.isDown || (jumpTouch) && player.body.touching.down && hitPlatform) {
			isJumping = true;
			player.body.velocity.y = -200;
			player.animations.stop();
			player.frame = 10;
		} else if (player.body.touching.down && hitPlatform) {
			isJumping = false;
		};

	};
	
}


function render() {
	//game.debug.text(game.time.fps, 2, 14, "#00ff00");
	//game.debug.body(player);
	//game.debug.geom(ground,'#0fffff');
	//game.debug.cameraInfo(game.camera, 16, 16);
}

