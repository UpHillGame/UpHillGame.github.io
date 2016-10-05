//GameField

const Level = require('Level');
const BlockType = require('Types').BlockType;
const ItemType = require('Types').ItemType;
const GameState = require('States').GameState;

var startX = 113;
var startY = 501;

var distX = 83;
var distY = 65;

var spawnOffSetY = 200;
var despawnOffSetY = -100;
var ySpawnPosition = 485;

var floatAboveCube = [1, 2, 3, 4, 5, 6];
var rightOnTopOfCube = [7, 8, 9, 10];

var startField = [
	[7, 1, 2, 2, 1, 7],
	[7, 1, 5, 1, 2, 1, 7],
	[7, 2, 1, 1, 2, 7],
	[7, 2, 1, 1, 1, 2, 7],
	[7, 2, 1, 1, 2, 7],
	[7, 1, 2, 1, 5, 1, 7],
	[7, 1, 2, 2, 1, 7],
	[7, 1, 1, 2, 1, 1, 7]
	/*[7,1,1,1,1,0],
	 [7,1,1,1,1,1,0],
	 [7,1,1,4,4,5],
	 [7,1,1,1,5,1,0],
	 [7,1,1,1,1,0],
	 [7,5,6,3,1,1,0],
	 [7,1,1,5,1,0],
	 [7,1,1,1,1,1,0],*/
];

//Array for each individual block
var pufferField = [
	[7, 1, 6, 6, 6, 1, 7],
	[7, 1, 2, 2, 1, 7],
	[7, 1, 3, 1, 3, 1, 7],
	[7, 1, 2, 2, 1, 7],
	[7, 1, 2, 1, 2, 1, 7],
	[7, 3, 2, 2, 3, 7],
	[7, 7, 1, 1, 1, 7, 7],
	[7, 1, 1, 4, 4, 7],
	[7, 4, 1, 4, 1, 4, 7],
	[7, 4, 1, 1, 1, 7],
	[7, 4, 1, 1, 1, 1, 7],
	[7, 5, 1, 5, 1, 7],
	[7, 1, 1, 1, 1, 1, 7],
	[7, 1, 1, 1, 1, 7],
	[7, 6, 1, 1, 1, 1, 7],
	[7, 1, 1, 1, 1, 7]
];
/*
 The items-array has the same dimensions as the startField. Each item will be a child of the corresponding block (seen as a layover).
 // 0.Empty, 1.antidoteLeft, 2.antidoteRight, 3.coinLeft, 4.coinRight, 5.starLeft,
 // 6.starRight, 7.BlockedBush, 8.BlockedStone, 9.SlowDownBottom, 9.SlowDownTop
 //TODO: 10.WaterLeft, 11.WaterRight */
var startFieldItems = [
	[0, 8, 0, 0, 8, 0],
	[0, 8, 0, 7, 0, 8, 0],
	[0, 0, 7, 7, 2, 0],
	[0, 6, 7, 7, 7, 0, 0],
	[0, 0, 7, 7, 0, 0],
	[0, 7, 4, 7, 0, 7, 0],
	[0, 7, 0, 0, 7, 0],
	[0, 8, 8, 0, 8, 8, 0]
];


/*
 The items-array has the same dimensions as the pufferField. Each item will be a child of the corresponding block (seen as a layover).
 // 0.Empty, 1.antidoteLeft, 2.antidoteRight, 3.coinLeft, 4.coinRight, 5.starLeft,
 // 6.starRight, 7.BlockedBush, 8.BlockedStone, 9.SlowDownBottom, 9.SlowDownTop
 //TODO: 10.WaterLeft, 11.WaterRight */
var pufferFieldItems = [
	[0, 8, 0, 0, 0, 8, 0],
	[0, 8, 0, 0, 8, 0],
	[0, 8, 0, 0, 0, 8, 0],
	[0, 8, 0, 0, 8, 0],
	[0, 8, 0, 7, 0, 8, 0],
	[0, 0, 0, 0, 0, 0],
	[0, 0, 9, 7, 9, 0, 0],
	[0, 9, 7, 0, 0, 0],
	[0, 0, 7, 0, 7, 0, 0],
	[0, 0, 7, 9, 9, 0],
	[0, 0, 7, 7, 0, 7, 0],
	[0, 0, 7, 0, 8, 0],
	[0, 0, 0, 0, 0, 7, 0],
	[0, 0, 0, 7, 0, 0],
	[0, 0, 7, 0, 0, 0, 0],
	[0, 0, 0, 2, 0, 0],
];

var nextFirstLine = 0;
var nextFirstLineItem = 0;

var newCube = null;
var newItem = null;


cc.Class({
	extends: cc.Component,

	properties: {
		gridSizeX: 0, // Rows - dont change here but in cocos creator!!
		gridSizeY: 0, // Columns

		despawnHeight: 0,

		item: {
			default: null,
			type: cc.Node,
		},

		//Blocks start here
		Empty: {						//0		EMPTY
			default: null,
			type: cc.Prefab,
		},
		Grass: {						//1		GRASS
			default: null,
			type: cc.Prefab,
		},
		Dirt: {							//2		DIRT
			default: null,
			type: cc.Prefab,
		},
		Trapdoor: {					//3		TRAPDOOR
			default: null,
			type: cc.Prefab,
		},
		Switcher: {					//4		SWITCHER
			default: null,
			type: cc.Prefab,
		},
		Poison: {						//5		POISON
			default: null,
			type: cc.Prefab,
		},
		Spike: {						//6		SPIKE
			default: null,
			type: cc.Prefab,
		},
		WaterC: {						//7		WATER (Like EMPTY)
			default: null,
			type: cc.Prefab,
		},

		// Game reference to pass field
		game: {
			default: null,
			type: cc.Node,
		},

		//Items start here
		AntidoteL: {						//1		AntidoteL
			default: null,
			type: cc.Prefab,
		},
		AntidoteR: {						//2		AntidoteR
			default: null,
			type: cc.Prefab,
		},
		CoinL: {								//3		CoinL
			default: null,
			type: cc.Prefab,
		},
		CoinR: {								//4		CoinR
			default: null,
			type: cc.Prefab,
		},
		StarL: {								//5		StarL
			default: null,
			type: cc.Prefab,
		},
		StarR: {								//6		StarR
			default: null,
			type: cc.Prefab,
		},

		BlockedBush: {					//7		BlockedBush
			default: null,
			type: cc.Prefab,
		},
		BlockedStone: {					//8		BlockedStone
			default: null,
			type: cc.Prefab,
		},
		SlowDownBottom: {				//9		SlowDownBottom (Bottom and Top are always together)
			default: null,
			type: cc.Prefab,
		},
		SlowDownTop: {					//9		SlowDownTop (Bottom and Top are always together)
			default: null,
			type: cc.Prefab,
		},
		/*
		 WaterLeft: {						//10		WaterLeft
		 default: null,
		 type: cc.Prefab,
		 },*/
		WaterRight: {						//11		WaterRight
			default: null,
			type: cc.Prefab,
		},

		//Player
	},

	// use this for initialization
	onLoad: function () {
		//register gamefield at game for processing gamefield logic
		this.game.getComponent('Game').gamefield = this;

		this.player = null; // load later when player ran onLoad()
		this.count = 0;
		this.gameField = [];
		this.items = [];

		this.disTX = distX;
		this.disTY = distY;
		this.resetArrays();
		this.initializeField();

		this.game.getComponent('Game').onGameFieldLoadCallback();
	},

	resetArrays: function () {
		nextFirstLine = 0;
		nextFirstLineItem = 0;
		pufferField = [
			[7, 1, 6, 6, 6, 1, 7],
			[7, 1, 2, 2, 1, 7],
			[7, 1, 3, 1, 3, 1, 7],
			[7, 1, 2, 2, 1, 7],
			[7, 1, 2, 1, 2, 1, 7],
			[7, 3, 2, 2, 3, 7],
			[7, 7, 1, 1, 1, 7, 7],
			[7, 1, 1, 4, 4, 7],
			[7, 4, 1, 4, 1, 4, 7],
			[7, 4, 1, 1, 1, 7],
			[7, 4, 1, 1, 1, 1, 7],
			[7, 5, 1, 5, 1, 7],
			[7, 1, 1, 1, 1, 1, 7],
			[7, 1, 1, 1, 1, 7],
			[7, 6, 1, 1, 1, 1, 7],
			[7, 1, 1, 1, 1, 7]
		];
		pufferFieldItems = [
			[0, 8, 0, 0, 0, 8, 0],
			[0, 8, 0, 0, 8, 0],
			[0, 8, 0, 0, 0, 8, 0],
			[0, 8, 0, 0, 8, 0],
			[0, 8, 0, 7, 0, 8, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 9, 7, 9, 0, 0],
			[0, 9, 7, 0, 0, 0],
			[0, 0, 7, 0, 7, 0, 0],
			[0, 0, 7, 9, 9, 0],
			[0, 0, 7, 7, 0, 7, 0],
			[0, 0, 7, 0, 8, 0],
			[0, 0, 0, 0, 0, 7, 0],
			[0, 0, 0, 7, 0, 0],
			[0, 0, 7, 0, 0, 0, 0],
			[0, 0, 0, 2, 0, 0],
		];
	},

	initializeField: function () {
		for (var y = 0; y < startField.length; y++) {
			this.gameField[y] = [];
			for (var x = 0; x < startField[y].length; x++) {
				if (startField[y].length % 2 === 0) {
					newCube = this.spawnCube(startX + (x * distX), startY - (distY * y), startField[y][x], startFieldItems[y][x]);
				}
				else {
					newCube = this.spawnCube(startX + (x * distX) - (distX / 2), startY - (distY * y), startField[y][x], startFieldItems[y][x]);
				}
				this.gameField[y][x] = newCube;
			}
		}
	},

	/* Displaces the entire gamefield by *Speed*-Pixel
	 * In case border is crossed -> delete lowest row */
	updateFieldPosition: function (speed) {
		for (var y = 0; y < this.gameField.length; y++) {
			for (var x = 0; x < this.gameField[y].length; x++) {
				var posX = this.gameField[y][x].getPositionX();
				var posY = this.gameField[y][x].getPositionY();
				this.gameField[y][x].setPosition(posX, posY + speed);
			}
		}
		this.updatePlayerPosition(speed);
		/*var fieldx =  this.node.getPositionX(); //BUGGY
		var fieldy = this.node.getPositionY();
		this.node.setPosition(fieldx, fieldy+speed); */
		if (this.gameField[this.gameField.length - 1][0].getPositionY() <= this.despawnHeight) {
			this.destroyLine(this.gameField.length - 1);
			this.rearrangeGameField();
		}
		return true;
	},

	updatePlayerPosition: function (speed) {
		var x = this.player.node.getPositionX();
		var y = this.player.node.getPositionY();
		this.player.node.setPosition(x, y + speed);
	},

	updatePlayerArrayPos: function () {
		if (this.gameField[this.player.arrayPosY].length % 2 == 0) {
			if (this.player.dir < 0) {
				this.player.arrayPosX = this.player.arrayPosX + 1;
			}
		} else {
			if (this.player.dir > 0) {
				this.player.arrayPosX = this.player.arrayPosX - 1;
			}
		}

		this.player.arrayPosY = this.player.arrayPosY - 1;
	},

	setPlayerStart: function (player) {
		var mid = Math.round(Number(this.gameField[this.gameField.length - 1].length / 2)) - 1;
		var startField = this.gameField[this.gameField.length - 1][mid];
		player.arrayPosX = mid;
		player.arrayPosY = this.gameField.length - 1;
		player.oldDest = startField;
		var startpos = cc.p(startField.getPositionX(), startField.getPositionY() + player.offsetY);
		player.node.setPosition(startpos);
	},

	getJumpField: function (dir) {
		if (this.gameField[this.player.arrayPosY].length % 2 == 0) {
			if (dir > 0) {
				return this.gameField[this.player.arrayPosY - 1][this.player.arrayPosX];
			} else {
				return this.gameField[this.player.arrayPosY - 1][this.player.arrayPosX + 1];
			}

		} else {
			if (dir > 0) {
				return this.gameField[this.player.arrayPosY - 1][this.player.arrayPosX - 1];
			} else {
				return this.gameField[this.player.arrayPosY - 1][this.player.arrayPosX];
			}
		}
	},

	destroyLine: function (line) {
		for (var i = 0; i < this.gameField[line].length; i++) {
			this.destroyBlock(this.gameField[line][i]);
		}
	},

	destroyBlock: function (block) {
		var fall = cc.moveTo(1, cc.p(block.getPosition().x, despawnOffSetY)).easing(cc.easeCubicActionIn());
		var fade = cc.fadeOut(1.5);
		block.runAction(cc.sequence(cc.spawn(fall, fade), cc.callFunc(this.destroyBlockData, this)));
	},

	destroyBlockData: function (block) {
		block.destroy();
	},

	rearrangeGameField: function () {
		var newarray = [];
		var x = this.gameField[1][0].getPositionX();
		newarray[0] = this.createFirstLine(x);
		for (var i = 0; i < this.gameField.length - 1; i++) {
			newarray[i + 1] = this.gameField[i];
		}
		this.gameField = newarray;
		this.addZOrderToGameField();
		this.player.arrayPosY = this.player.arrayPosY + 1;
		if (this.player.arrayPosY >= this.gameField.length) {
			this.player.fall();
			this.game.getComponent('Game').state = GameState.GameOver;
		}
	},

	createFirstLine: function (x) {
		var newarray = [];
		var bufferarray = this.getNextLineFromPuffer();
		var arrayItems = this.getNextLineFromItemPuffer();

		for (var i = 0; i < bufferarray.length; i++) {
			if ((bufferarray.length % 2) == 0) {

				newarray[i] = this.spawnCube((x + (i * distX)), (ySpawnPosition + distY - spawnOffSetY), bufferarray[i], arrayItems[i]);
				newarray[i].opacity = 0;
				// Let blocks slowly rise when they spawn
				var rise = cc.moveTo(1, cc.p(newarray[i].getPosition().x, ySpawnPosition + distY)).easing(cc.easeCubicActionIn());
				var fade = cc.fadeIn(1);
				newarray[i].runAction(cc.spawn(fade, rise));
			}
			else {
				newarray[i] = this.spawnCube((x + (i * distX)), (ySpawnPosition + distY - spawnOffSetY), bufferarray[i], arrayItems[i]);
				newarray[i].opacity = 0;
				var rise = cc.moveTo(1, cc.p(newarray[i].getPosition().x, ySpawnPosition + distY)).easing(cc.easeCubicActionIn());
				var fade = cc.fadeIn(1);
				newarray[i].runAction(cc.spawn(fade, rise));
			}
		}
		return newarray;
	},


	//
	// All relevant data has to be loaded as properties within the prefabs instantiated here.!!
	//
	spawnCube: function (x, y, cubeNumber, itemNumber) {
		cc.log('M: spawnCube');
		switch (cubeNumber) {
			case 0:
				var newCube = cc.instantiate(this.Empty);
				break;
			case 1:
				var newCube = cc.instantiate(this.Grass);
				newCube = this.spawnItem(newCube, itemNumber);

				break;
			case 2:
				var newCube = cc.instantiate(this.Dirt);
				newCube = this.spawnItem(newCube, itemNumber);

				break;
			case 3:
				newCube = cc.instantiate(this.Trapdoor);
				break;
			case 4:
				var newCube = cc.instantiate(this.Switcher);
				newCube = this.spawnItem(newCube, itemNumber);

				break;
			case 5:
				var newCube = cc.instantiate(this.Poison);
				newCube = this.spawnItem(newCube, itemNumber);

				break;
			case 6:
				var newCube = cc.instantiate(this.Spike);
				newCube = this.spawnItem(newCube, itemNumber);

				break;
			case 7:
				var newCube = cc.instantiate(this.WaterC);
				break;
			default:
				var newCube = cc.instantiate(this.Grass);
				newCube = this.spawnItem(newCube, itemNumber);

				break;
		}

		newCube.setPosition(x, y);

		this.node.addChild(newCube);

		return newCube;
	},


	spawnItem: function (parentBlock, itemNumber) {
		switch (itemNumber) {
			case 0:							 															//Empty/ no item
				var newItem = cc.instantiate(this.Empty);
				break;
			case 1:							 															//antidoteLeft
				var newItem = cc.instantiate(this.AntidoteL);
				break;
			case 2:							 															//antidoteRight
				var newItem = cc.instantiate(this.AntidoteR);
				break;
			case 3:							 															//coinLeft
				var newItem = cc.instantiate(this.CoinL);
				break;
			case 4:							 															//coinRight
				var newItem = cc.instantiate(this.CoinR);
				break;
			case 5:							 															//starLeft
				var newItem = cc.instantiate(this.StarL);
				break;
			case 6:							 															//starRight
				var newItem = cc.instantiate(this.StarR);
				break;
			case 7:							 															//BlockedBush
				var newItem = cc.instantiate(this.BlockedBush);
				parentBlock.getComponent('Block').isBlocked = true;
				break;
			case 8:							 															//BlockedStone
				var newItem = cc.instantiate(this.BlockedStone);
				parentBlock.getComponent('Block').isBlocked = true;
				break;
			case 9:							 															//SlowDown (Top AND Bottom)
				var newItem = cc.instantiate(this.SlowDownBottom);
				var newItem2 = cc.instantiate(this.SlowDownTop);
				newItem.addChild(newItem2);
				break;
			default:							 															//Empty/ no item
				var newItem = cc.instantiate(this.Empty);
				break;
		}

		var posY = newItem.getPositionY();
		var posX = newItem.getPositionX();

		if (floatAboveCube.includes(itemNumber)) {
			newItem.setPosition(posX, posY + 50);

		} else if (rightOnTopOfCube.includes(itemNumber)) {
			newItem.setPosition(posX, posY + 40);
		}

		parentBlock.getComponent('Block').item = newItem;
		parentBlock.addChild(newItem);

		return parentBlock;
	},


	getNextLineFromPuffer: function () {
		var ret = [];
		if (pufferField.length === nextFirstLine) {
			//cc.log('Puffer array is empty!');
			this.defineNextRandomArray();
			ret = pufferField[nextFirstLine];
			nextFirstLine = nextFirstLine + 1;
		}
		else {
			//cc.log('Getting next array line fro puffer...')
			ret = pufferField[nextFirstLine];
			nextFirstLine = nextFirstLine + 1;
		}
		//cc.log('Returning next puffer array line, exiting getNextLineFromPuffer', ret);
		return ret;
	},


	getNextLineFromItemPuffer: function () {
		cc.log('M: getNextLineFromItemPuffer');
		var ret = [];

		if (pufferFieldItems.length === nextFirstLineItem) {
			ret = pufferFieldItems[nextFirstLineItem];
			nextFirstLineItem = nextFirstLineItem + 1;
		}
		else {
			ret = pufferFieldItems[nextFirstLineItem];
			nextFirstLineItem = nextFirstLineItem + 1;
		}
		return ret;
	},

	defineNextRandomArray: function () {
		var score = this.game.getComponent('Game').score;

		pufferField = [];
		pufferFieldItems = [];

		var rand = (Math.random() * 10) + 1;

		if (score <= 35) {
			if (rand < 4) {
				console.log('WIR WEISE L11C zu');
				pufferField = Level.L11C;
				pufferFieldItems = Level.L11I;
			}
			else if (rand < 7) {
				console.log('WIR WEISE L12C zu');
				pufferField = Level.L12C;
				pufferFieldItems = Level.L12I;
			}
			else {
				console.log('WIR WEISE L13C zu');
				pufferField = Level.L13C;
				pufferFieldItems = Level.L13I;
			}
		}
		else if (score <= 70) {
			if (rand < 4) {
				console.log('WIR WEISE L21C zu');
				pufferField = Level.L21C;
				pufferFieldItems = Level.L21I;
			}
			else if (rand < 7) {
				console.log('WIR WEISE L22C zu');
				pufferField = Level.L22C;
				pufferFieldItems = Level.L22I;
			}
			else {
				console.log('WIR WEISE L23C zu');
				pufferField = Level.L23C;
				pufferFieldItems = Level.L23I;
			}
		}
		else {
			if (rand < 4) {
				console.log('WIR WEISE L31C zu');
				pufferField = Level.L31C;
				pufferFieldItems = Level.L31I;
			}
			else if (rand < 7) {
				console.log('WIR WEISE L32C zu');
				pufferField = Level.L32C;
				pufferFieldItems = Level.L32I;
			}
			else {
				console.log('WIR WEISE L33C zu');
				pufferField = Level.L33C;
				pufferFieldItems = Level.L33I;
			}
		}
		nextFirstLine = 0;
		nextFirstLineItem = 0;
	},

	addZOrderToGameField: function () {
		var count = 1;
		for (var y = 0; y < this.gameField.length; y++) {
			for (var x = 0; x < this.gameField[y].length; x++) {
				this.gameField[y][x].setLocalZOrder(count);
				count++;
			}
		}
	},


	/*
	 initializeField2: function(x,y){
	 this.gameField = [x];
	 for (var h = 0; h < x; h++) { //create array with uneven rows
	 if(h%2===1){
	 this.gameField[h] = [y-1]; //uneven
	 } else {
	 this.gameField[h] = [y];
	 }
	 }

	 for (var i = 0; i < this.gameField.length; i++) {
	 for (var j = 0; j < this.gameField[i].length; j++) {
	 if(this.gameField[i].length%2===1){ // even array/row
	 newCube = this.spawnCube(startX+(x*distX), startY-(distY*y), startField2[i][j]);
	 }
	 else{ // uneven array/row
	 newCube = this.spawnCube(startX+(x*distX)-(distX/2), startY-(distY*y), startField2[i][j]);
	 }
	 this.gameField[i][j] = newCube; //TODO add blocks not numbers
	 }
	 }


	 cc.log("Field:");
	 for (var i = 0; i < this.gameField.length; i++) {
	 cc.log(this.gameField[i].join("Row: "+i+" "));
	 }
	 },

	 addFirstFieldRow: function(row){
	 this.field.unshift(row);
	 },

	 removeLastFieldRow: function(){
	 this.field.pop();
	 },

	 addFieldRow : function(index, row){
	 this.field[index] = row;
	 },

	 removeFieldRow : function(index){
	 var temp = [this.gridSizeX];
	 for(var h = 0; h < this.gridSizeX; h++){
	 temp[h] = this.field[h];
	 }

	 for(var i = 0; i < this.gridSizeX; i++){
	 if(i != 0){
	 var newindex = i-1;
	 cc.log("Ind: "+newindex);
	 this.field[i] = temp[newindex];
	 }
	 }
	 },

	 generateRow : function(){
	 var i = this.gridSizeX+this.count;
	 this.count++;
	 return [i,i,i,i,i];
	 //TODO: load a row from tiled file return array
	 },*/

	// called every frame, uncomment this function to activate update callback
	// update: function (dt) {

	// },
});
