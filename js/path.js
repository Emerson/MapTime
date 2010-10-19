function PathFinder(map) {
	
	// closed and open tiles
	// this.openTiles = {};
	// this.closedTiles = {};
	this.squareCost = 10;
	this.diagonalCost = 14;
	
	// standard objects used to store information during calculations
	this.openTiles = new Array();
	this.closedTiles = new Array();
	this.potentialPaths = {};
	
	// main function used to set and store a potential path for given object id
	this.findPath = function(start,end,id) {
		console.log('finding a path from: '+start['x']+','+start['y']+' to: '+end['x']+','+end['y']);
		var nearestNodes = this.adjacentTiles(start);
		console.log(nearestNodes);
		this.potentialPaths[id] = {
			'init': true,
			'currentTile': start,
			'destination': end
		};
		this.potentialPaths[id]['openTiles'] - new Array();
		this.potentialPaths[id]['closedTiles'] = new Array();
		
		// Dump our results in open tiles
		for(node in nearestNodes) {
			this.openTiles.push(nearestNodes[node]);			
		}
		
		// Calculate F and G fir open tiles
		for(tile in this.openTiles) {			
			this.openTiles[tile]['parent'] = start;
			if(this.isDiagonal(start,this.openTiles[tile])) {
				this.openTiles[tile]['g'] = this.diagonalCost; // 14									
			}else{
				this.openTiles[tile]['g'] = this.squareCost; // 10
			}
			this.openTiles[tile]['h'] = this.estimateDistanceCost(this.openTiles[tile],end);
			this.openTiles[tile]['f'] = this.openTiles[tile]['g'] + this.openTiles[tile]['h'];
		}
		this.addTileToClosed(); // the tile with the lowest 'f' is added to closed tiles (pass parent)
		
		console.log('current open tiles are:');
		console.log(this.openTiles);
		
		console.log('current closed tiles are:');
		console.log(this.closedTiles);
		
			
			// if we find the end tile in the closed list, end the loop
			if(this.isClosed(end)) {
				console.log('FOUND PATH!');
				console.log(this.closedTiles);
				return this.closedTiles;
			}else{ // run the loop again with the latest closed tile
				console.log('running function again');
				this.findPath(this.closedTiles[this.closedTiles.length-1],end,id);
			}
	}
	
	
	// Tests in two points are located diagonal. Returns true if they are
	this.isDiagonal = function(pointA, pointB) {
		if(pointA['x'] != pointB['x'] && pointA['y'] != pointB['y']) {
			return true;	
		}
		return false;
	}
	
	
	// loop through our open tiles
	this.addTileToClosed = function() {
		console.log('adding best option to closed tiles');
		var lowestCost;
		for(tile in this.openTiles) {			
			console.log('looping');			
			console.log(this.openTiles[tile]);
			if(lowestCost==null) {
					lowestCost = this.openTiles[tile];
			}else{
				console.log('lowest cost is currently: '+lowestCost['f']);
				if(lowestCost['f'] > this.openTiles[tile]['f']) {
					lowestCost = this.openTiles[tile];
				}
			}
		}
		this.closedTiles.push(lowestCost);
		this.removeOpenTile(lowestCost);
		console.log('lowest cost for movement is:');
		console.log(lowestCost);						
	}
	
	// (over) estimates the distance between two points
	this.estimateDistanceCost = function(pointA,pointB) {
		console.log('estimating distance betwen:');
		console.log(pointA);
		console.log(pointB);
		console.log(Math.abs(pointA['x'] - pointB['x']) +  Math.abs(pointA['y'] - pointB['y']) * this.squareCost);
		var xDistance = Math.abs(pointA['x'] - pointB['x']);
		var yDistance = Math.abs(pointA['y'] - pointB['y']);
		return (xDistance + yDistance) * this.squareCost;
	}
	
	this.regeneratePaths = function() {
		// for each id on the map, go ahead and regenerate paths.
		// Usually called at the end of a uers turn
	};
	
	
	// Finds and removes a given tile from the list of current open tiles
	this.removeOpenTile = function(point) {
		for(tile in this.openTiles) {
			if(this.openTiles[tile]['x'] == point['x'] && this.openTiles[tile]['y'] == point['y']) {
				console.log('removing '+point['x']+','+point['y']+' from open tiles');
				delete this.openTiles[tile];
			}
		}
	}
	
	
	// Returns true if a given tile is already closed
	this.isClosed = function(point) {
		var found = false;
		for(tile in this.closedTiles) {
			if(this.closedTiles[tile]['x'] == point['x'] && this.closedTiles[tile]['y'] == point['y']) {
				found = true;
			}
		}
		return found;
	}
	
	// used to return an object populated by adjacent tiles of a point
	// F = G + H
	// G = movement cost
	// H = estimated movement cost to destination tile
	this.adjacentTiles = function(point) {
		// console.log('find adjacent squares around: '+point['x']+', '+point['y']);
		var adjacentTiles = {
			'top_left': {'x': point['x']-1, 'y': point['y']-1},
			'top': {'x': point['x'], 'y': point['y']-1},
			'top_right': {'x': point['x']+1, 'y': point['y']-1},
			'right' : {'x': point['x']+1, 'y': point['y']},
			'bottom_right': {'x': point['x']+1, 'y': point['y']+1},
			'bottom': {'x': point['x'], 'y': point['y']+1},
			'bottom_left': {'x': point['x']-1, 'y': point['y']+1},
			'left': {'x': point['x']-1, 'y': point['y']}
		};
		// Remove invalid tiles
		for(tile in adjacentTiles) {
			var x = adjacentTiles[tile]['x'];
			var y = adjacentTiles[tile]['y'];
			console.log('x: '+x);
			console.log('y: '+y);
			if(x < 1 || y < 1) {
				delete adjacentTiles[tile];
			}
			console.log(this.tiles);
			console.log(typeof map);
			// if(typeof map.tiles[x] != 'undefined' && map.tiles[x][y]['terrain']['moveCost']==false) {
			// 	delete adjacentTiles[tile];
			// }
			console.log(tile);
			console.log('adjacentTiles map tiles:');
			// console.log(map.tiles[adjacentTiles[tile]['x']][adjacentTiles[tile]['y']]);
		}
		
		// todo - make a property set to false if tile is invalid (eg. offmap)
		return adjacentTiles;
	}
	
}
Map.prototype = PathFinder;