function PathFinder(map) {
	
	// closed and open tiles
	// this.openTiles = {};
	// this.closedTiles = {};
	this.squareCost = 10;
	this.diagonalCost = 14;
	this.potentialPaths = {};
	
	// standard objects used to store information during calculations
	// this.openTiles = new Array();
	// this.closedTiles = new Array();
	
	this.openTiles = {};
	this.closedTiles = {};
	
	// main function used to set and store a potential path for given object id
	this.findPath = function(start,end,id) {
		console.log('finding a path from: '+start['x']+','+start['y']+' to: '+end['x']+','+end['y']);
		var nearestNodes = this.adjacentTiles(start);					
		this.potentialPaths[id] = {
			'init': true,
			'currentTile': start,
			'destination': end
		};
		this.potentialPaths[id]['openTiles'] - new Array();
		this.potentialPaths[id]['closedTiles'] = new Array();
		
		// Dump our results in open tiles
		for(node in nearestNodes) {
			this.openTiles[nearestNodes[node]['x']+'-'+nearestNodes[node]['y']] = {init: true};
		}
		
		// Calculate F and G fir open tiles
		for(tile in this.openTiles) {			
			this.openTiles[tile]['parent'] = start;
			if(this.isDiagonal(start,this.openTiles[tile])) {
				this.openTiles[tile]['g'] = this.diagonalCost; // 14									
			}else{
				this.openTiles[tile]['g'] = this.squareCost; // 10
			}
			var tilePoint = map.tileIdToPoint(tile);
			this.openTiles[tile]['h'] = this.estimateDistanceCost(tilePoint,end);
			this.openTiles[tile]['f'] = this.openTiles[tile]['g'] + this.openTiles[tile]['h'];
		}
		lastClosedTile = this.addTileToClosed(); // the tile with the lowest 'f' is added to closed tiles (pass parent)
		// 		lastClosedTile = map.tileIdToPoint(lastClosedTileId);
		// 		console.log('last closed tile ID: '+lastClosedTileId);
		// 		console.log(lastClosedTile);
					
			// if we find the end tile in the closed list, end the loop
			if(this.isClosed(end['x']+'-'+end['y'])) {
				console.log('FOUND PATH!');
				console.log(this.closedTiles);
				return this.closedTiles;
			}else{ // run the loop again with the latest closed tile
				console.log('running again');
				// var
				// this.findPath(this.closedTiles[this.closedTiles.length-1],end,id);
				// this.findPath(lastClosedTile,end,id);
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
		var lowestCost;
		for(tile in this.openTiles) {
			if(lowestCost==null) {
					lowestCost = this.openTiles[tile];
			}else{
				if(lowestCost['f'] > this.openTiles[tile]['f']) {
					lowestCost = this.openTiles[tile];
					lowestCost['tileId'] = tile;
				}
			}
		}
		this.closedTiles[lowestCost['tileId']] = lowestCost;
		this.removeOpenTile(lowestCost['tileId']);
		return lowestCost;
	}
	
	// (over) estimates the distance between two points
	this.estimateDistanceCost = function(pointA,pointB) {
		var xDistance = Math.abs(pointA['x'] - pointB['x']);
		var yDistance = Math.abs(pointA['y'] - pointB['y']);
		var estimatedCost = (xDistance + yDistance) * this.squareCost;
		// console.log('estimating distance between: '+pointA['x']+','+pointA['y']+' and '+pointB['x']+','+pointB['y']+' at: '+estimatedCost);	
		return estimatedCost;
	}
	
	this.regeneratePaths = function() {
		// for each id on the map, go ahead and regenerate paths.
		// Usually called at the end of a uers turn
	};
	
	
	// Finds and removes a given tile from the list of current open tiles
	this.removeOpenTile = function(tileId) {
		delete this.openTiles[tileId];
	}
	
	
	// Returns true if a given tile is already closed
	this.isClosed = function(id) {		
		var found = false;
			if(typeof this.openTiles[id] != 'undefined') {
				console.log('FOUND');
			}
		if(typeof this.closedTiles[id] != 'undefined') {
			found = true;			
			console.log("FOUND TILE");
		}else{
			found = true;
		}	
		
		console.log(this.closedTiles);
		// return found;
	}
	
	/*
	*	adjacentTiles(point)
	*	==================================
	*	Returns an object that contains only valid adjacent tiles
	*/
	this.adjacentTiles = function(point) {				
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
			// console.log('x: '+x);
			// console.log('y: '+y);
			if(x < 1 || y < 1) {
				delete adjacentTiles[tile];
			}	
			// console.log(map.tiles, 'warn');
		
			// for(tile in map.tiles) {
			// 	console.log('checking adjacent tiles for impassible');
			// 	console.log(map.tiles[tile], 'warn');
			// }
			// if(typeof map.tiles[x] != 'undefined' && map.tiles[x][y]['terrain']['moveCost']==false) {
			// 	delete adjacentTiles[tile];
			// }
			//console.log(tile);
			//console.log('adjacentTiles map tiles:');
			// console.log(map.tiles[adjacentTiles[tile]['x']][adjacentTiles[tile]['y']]);
		}
		
		// todo - make a property set to false if tile is invalid (eg. offmap)
		return adjacentTiles;
	}
	
}