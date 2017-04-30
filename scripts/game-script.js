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

var game = new Phaser.Game(1280, 720, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {
	game.load.image('sky', 'assets/sky.png');
	game.load.image('ground', 'assets/ground.png');
    game.load.image('platform', 'assets/platform2.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/hero.png', 32, 32);
    game.load.image('sign', 'assets/sign.png');
}

var platforms;
var player;
var uiMessage;
var scoreText;
var gp;
var hasGP = true;

function create() {
	game.input.gamepad.start();
	

	game.time.advancedTiming = true;
	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.add.sprite(0,0, 'sky');

	platforms = game.add.group();
	platforms.enableBody = true;

	var ground = platforms.create(0, game.world.height - 64, 'ground');

	ground.scale.setTo(15, 1);

	ground.body.immovable = true;

	var ledge = platforms.create(400, 500, 'platform');

	ledge.body.immovable = true;

	ledge = platforms.create(-150, 350, 'platform');

	ledge.body.immovable = true;


	player = game.add.sprite(32, game.world.height - 150, 'dude');

	game.physics.arcade.enable(player);

	player.body.bounce.y = 0;
	player.body.gravity.y = 400;
	player.body.collideWorldBounds = true;

	player.animations.add('left', [7, 8, 9, 10], 10, true);
	player.animations.add('right', [8, 9, 10, 11], 10, true);
	player.animations.add('idle', [0, 1, 2, 3], 10, true);

	uiMessage = game.add.sprite(537, 280, 'sign');
	uiMessage.visible = false;

	//scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });
}

var isJumping = false

function update() {
	var hitPlatform = game.physics.arcade.collide(player, platforms);
	gp = game.input.gamepad.pad1;
	player.body.velocity.x = 0;
	if (hasGP) {
		if (gp.isDown(Phaser.Gamepad.BUTTON_14)) {
			
			player.body.velocity.x = -250;

			player.animations.play('left');

		} else if (gp.isDown(Phaser.Gamepad.BUTTON_15)) {
			
			player.body.velocity.x = 250;

			player.animations.play('right');

		} else {
			if (!isJumping) {
				// player.animations.stop();
				// player.frame = 4;

				player.animations.play('idle');
			};
		};

		if (gp.isDown(Phaser.Gamepad.BUTTON_0) && player.body.touching.down && hitPlatform) {
			isJumping = true;
			player.body.velocity.y = -400;
		} else if (player.body.touching.down && hitPlatform) {
			isJumping = false;
		};

		if (player.x >= 600) {
			uiMessage.visible = true;
		} else {
			uiMessage.visible = false;
		}
	};
	
}


function render() {
	game.debug.text(game.time.fps, 2, 14, "#00ff00");
}

