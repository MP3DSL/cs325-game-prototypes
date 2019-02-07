var game = new Phaser.Game(1000, 800, Phaser.Auto)

var score = 0;
var highScore = 0;
var scoreText;
var highScoreText;

var space;

var timer;

var GameState = {
	preload: function(){
		game.load.image('sky', 'assets/sky.png');
		game.load.image('ground', 'assets/ground.png');
		game.load.image('shape1', 'assets/block.png');
		game.load.image('shape2', 'assets/star.png');
	},
	create: function(){
		//Adds arcade physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//Adds a background
		background = game.add.sprite(0, 0, 'sky');
		background.scale.setTo(5, 5);
		
		//Making a group of platform objects
		platforms = game.add.group();
		
		//Adds physics to objects created in the group
		platforms.enableBody = true;
		
		//Create ground
		var ground = platforms.create(0, game.world.height - 64, 'ground');

		//Scale it to fit the width of the game
		ground.scale.setTo(5, 2);

		//Stop the ground from falling when jumped on
		ground.body.immovable = true;

		//Create Random Player with settings
		var shape;
		var num = Math.floor((Math.random() * 2) + 1);
		player = game.add.sprite(game.world.centerX, game.world.height - ground.height - 64, 'shape'+num);
		player.anchor.setTo(0.5,0.5);

		//Add physics to the player
		game.physics.arcade.enable(player);

		//Player physics properties
		player.body.gravity.y = Math.floor((Math.random() * 1000) + 300);
		player.body.collideWorldBounds = true;
		player.body.bounce.setTo(1, 0);

		//Create Scoreboard
		scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000'})
		highScoreText = game.add.text(game.world.centerX, 16, 'High Score: 0', { fontSize: '32px', fill: '#000'})

		//Add spacebar key input for jumping
		space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

		//Create Timer
		timer = game.time.create(false)
	},
	update: function(){
		//Collide player with platforms
		var hitPlatform = game.physics.arcade.collide(player, platforms);

		//Allow player to jump if they are touching the ground
		if(space.downDuration(1) && player.body.touching.down && hitPlatform){
			player.body.gravity.y = Math.floor((Math.random() * 10)) * 100 + 200;
			player.body.velocity.y = -350;
			player.body.velocity.x = (Math.random() < 0.5 ? -1 : 1)*200;
			score++;
			scoreText.text = 'Score: ' + score;
			if(highScore<score){
				highScore = score;
				highScoreText.text = 'High Score: ' + highScore;
			}
			timer.stop();
		}
		else if (space.downDuration(0.5) && !player.body.touching.down && !hitPlatform){
			score = 0;
			scoreText.text = 'Score: ' + score;
			timer.stop();
		}
		else if(player.body.touching.down && hitPlatform){
			player.body.velocity.x = 0;
			timer.loop(150, reset, this);
			timer.start();
		}
		else if(!space.isDown && !player.body.touching.down && !hitPlatform){
			timer.stop();
		}
		else if(!space.downDuration(100) && space.isDown && !player.body.touching.down && !hitPlatform){
			reset();
		}
	}
}

function reset(){
		score = 0;
		scoreText.text = 'Score: ' + score;
}

game.state.add('GameState', GameState)
game.state.start('GameState')