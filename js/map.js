// Javascript Map Class

function Map(width, height) {
	
	// set initial properties
	this.width = width;
	this.height = height;
	this.tiles;
	
	// builds our map
	this.buildMap = function() {
		this.tiles = new Array(this.width);
		for(y=1; y <= this.width; y++) {
			this.tiles[y] = new Array(this.width);
		}
		for(y=1; y <= this.height; y++) {
			for(x=1; x <= this.width; x++) {
				this.tiles[x][y] = {init: true};
			}
		}
	}

	// Used to return an object that has x and y attributes
	this.generatePoint = function(x,y) {
		console.log('generating point at: '+x+', '+y);
		var point = {
			"x": x,
			"y": y,
			"tileName": x+'-'+y
		}
		return point;
	}
	
	// Places a unit on the map and redraws it
	this.placeUnit = function(unitType,str,def,move,point) {
		console.log('adding unit: '+unitType+', str: '+str+', def: '+def+', move: '+move+'. Tile: '+point['x']+', '+point['y']);
		var newDate = new Date;
		var id = newDate.getTime();
		this.tiles[point['x']][point['y']]['unit'] = {"id": id, "type": unitType, "str": str, "def": def, "move": move, "rendered": false};
		this.updateMap();
		return id;
	}
	
	// Places terrain on the map
	this.placeTerrain = function(terrainType,gold,prod,food,moveCost) {
		console.log('generating lanscape: '+terrainType+', gold: '+gold+', production: '+prod+', food: '+food);
		this.tiles[point['x']][point['y']]['terrain'] = {"type": terrainType, "gold": gold, "prod": prod, "food": food, "rendered": false, "moveCost":moveCost};
		this.updateMap();
	}
	
	// prints the map
	this.printMap = function(element_id,element_type) {		
		var mapContainer = document.getElementById(element_id);
		for(y=1; y <= this.height; y++) {
			for(x=1; x <= this.width; x++) {
				var mapTile = document.createElement('div');
				mapTile.id = x+'-'+y;
				mapTile.innerHTML = '<span class=\'tileNumber\'>'+x+'-'+y+'</span>';
				mapContainer.appendChild(mapTile);
			}	
		}
	}
	
	// Updates the map
	this.updateMap = function() {
		console.log('updating map');
		for(x=1; x <= this.width; x++) {
			for(y=1; y <= this.height; y++) {
				
				/* RENDER UNITS */
				if(this.tiles[x][y]['unit'] && this.tiles[x][y]['unit']['rendered'] == false) {
					console.log('rending unit at: '+x+', '+y);
					console.log(x+'-'+y);
					var addUnit = document.getElementById(x+'-'+y);					
					addUnit.className = this.tiles[x][y]['unit']['type'];
					this.tiles[x][y]['unit']['rendered'] = true;
				}
				
				/* RENDER TERRAIN */
				if(this.tiles[x][y]['terrain'] && this.tiles[x][y]['terrain']['rendered'] == false) {
					console.log('rending terrain at: '+x+', '+y);
					console.log(x+'-'+y);
					var addUnit = document.getElementById(x+'-'+y);					
					addUnit.className = this.tiles[x][y]['terrain']['type'];
					this.tiles[x][y]['terrain']['rendered'] = true;
				}
				
			}
		}				
	}
	
	// Adds a class of path_'id' to given map tiles
	this.highlightPath = function(path) {
		console.log('highlighting path: ');
		console.log(path.length-1);
		for(var i=0; i<path.length; i++) {
			console.log(i);
			this.tiles[ path[i]['x'] ][ path[i]['y'] ]['terrain'] = {"type": 'path',"rendered": false};		
		}
		this.updateMap();
	}
	
};