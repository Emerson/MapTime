function PathFinder(map) {
		
	this.squareCost = 10;
	this.diagonalCost = 14;	
	this.openTiles = {};
	this.closedTiles = {};
	this.tries = 0;
		
	/*
	*	findPath(start,end)
	*	==================================
	*	Finds the best path from a starting point to an end point. If no path is possible it will return a
	*	simple false. Otherwise, it will return an path object.
	*	A* Concept taken from: http://www.policyalmanac.org/games/aStarTutorial.htm
	*/
	this.findPath = function(pointA,pointB) {
		var potentialTiles = {};
		var lowestCostTile = {};
		if(this.tries > (map.width * map.height)) {
			return false;
		}
		this.addToOpen(pointA);
		var adjacentTiles = this.getAdjacentTiles(pointA);	
		// Set parent data for adjacent tiles
		Y.each(adjacentTiles, function(tile) {
			var gCost = this.calculateGCost(tile,pointA);
			var parentTile = {
				tileId: pointA.x+'-'+pointA.y,
				x: pointA.x,
				y: pointA.y
			};
			var tileData = {
				x: tile.x,
				y: tile.y,
				tileId: tile.tileId,
				h: this.estimateDistanceCost(tile,pointB),
				g: gCost + this.estimateDistanceCost(tile,pointB)
			};
			console.log(tileData,'tile data for '+tileData.tileId);
			// If the tile is already open
			if(Y.Object.hasKey(this.openTiles, tile.tileId)) {
				// Recalculate theoretical G cost
				console.log(this.openTiles[tile.tileId],'tile '+tile.tileId+' is already open');
				// console.log('already open', 'alrady open '+tile.tileId);				
			}
			else {
				// console.log('adding to open', 'adding to open');
			}
			 // this.openTiles[tile.x + '-' + tile.y] = {init: true, parent: parentTile}
			this.openTiles[tile.x + '-' + tile.y] = {init: true, parent: parentTile};
		}, this);
		// Check if an adjacent tile is already open
		
		
		
		// Add the current tile to the closed list if it's not already present
		this.addToClosed(pointA);
		// Calculate the f, g, and h values for each open tile. Add the tile with the lowest f-cost to this.closedTiles		
		Y.each(adjacentTiles, function(tile, key) {
			var gCost = this.calculateGCost(tile,pointA);
			// Need to refactor this mess
			this.openTiles[tile.tileId]['x'] = tile.x;
			this.openTiles[tile.tileId]['y'] = tile.y;
			this.openTiles[tile.tileId]['tileId'] = tile.x+'-'+tile.y;
			this.openTiles[tile.tileId]['g'] = gCost;
			this.openTiles[tile.tileId]['h'] = this.estimateDistanceCost(tile,pointB);
			this.openTiles[tile.tileId]['f'] = gCost + this.openTiles[tile.tileId]['h'];
			if(Y.Object.hasKey(lowestCostTile, 'tileId')) {			
				if(lowestCostTile['f'] > this.openTiles[tile.tileId]['f']) {
					lowestCostTile = this.openTiles[tile.tileId];
				}
			}else{
				lowestCostTile = this.openTiles[tile.tileId];
			}
			// console.log(this.openTiles[tile.tileId], 'calculate');
		}, this);
		// console.log(this.tries, 'tries');
		// console.log(this.closedTiles, 'closedTiles');	
		console.log(lowestCostTile, 'closing tile... '+lowestCostTile.tileId);		
		this.addToClosed(lowestCostTile);
		this.tries++;
		if(this.isClosed(pointB)) {
			console.log('Path found!', 'complete');
			// var finalPath = calculateFinalPath(pointB);
			return this.closedTiles;
		}else{
			console.log('Running function again', 'processing...');
			this.findPath(lowestCostTile,pointB);
		}
	};
	
	/*
	*	getAdjacentTiles(point)
	*	==================================
	*	Returns an object of adjacent tiles. Ignores impassable terrain and closed tiles.
	*/
	this.getAdjacentTiles = function(point) {
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
		// Loop through and remove invalid tiles
		Y.each(adjacentTiles, function(tile,key) {			
			tile.tileId = tile.x+'-'+tile.y;
			// Remove tiles that are off map
			if(tile.x < 1 || tile.y < 1 || tile.x > map.width || tile.y > map.height3) {
				delete adjacentTiles[key];
			}
			// Remove any tiles that have terrain
			if(Y.Object.hasKey(map.tiles[tile.tileId], 'terrain')) {
				delete adjacentTiles[key];
				// console.log('Tile '+key+' has impassable terrain','TERRAIN');
			}
			// Remove any tiles already in the closed list
			console.log('checking if tile '+tile.tileId+' is on the closed list.');
			// console.log(this.closedTiles, 'CLOSED');
			if(Y.Object.hasKey(this.closedTiles, tile.tileId)) {
				console.log('deleting tile '+key+' from adjacentTiles');
				delete adjacentTiles[key];
				console.log('Tile '+key+' is already closed impassable terrain','TERRAIN');
			}
		}, this);
		console.log(adjacentTiles, 'ADJACENT');
		return adjacentTiles;
	};
	
	/*
	*	getFinalPath(tile)
	*	==================================
	*	Returns an object that contains the final path, which is then handed back to the map object. Starts from the parent
	*	and goes backwards until it reaches
	*/
	this.getFinalPath = function(tile) {
		return tile;
	}
	
	/*
	*	calculateGCost(tile)
	*	==================================
	*	Loops through parent tiles to figure out the G-cost of a tile.
	*	G = the movement cost to move from the starting point to a given square on the grid, following the path generated to get there.
	*/
	this.calculateGCost = function(tile, parentTile) {		
		var gCost = 0;
		(this.isDiagonal(tile,parentTile)) ? gCost = 14 : gCost = 10;
		if(Y.Object.hasKey(this.openTiles[parentTile.tileId], 'g')) {
			gCost = gCost + this.openTiles[parentTile.tileId]['g'];
			// console.log(this.openTiles[parentTile.tileId], 'parentTile');
			// console.log('ADD THE G!!!!!!!','addtheg');
		}
		// console.log(parentTile.tileId,'CALCULATE');
		return gCost;
	};
	
	/*
	*	addToOpen(tile)
	*	==================================
	*	Adds a tile to the this.openTiles object if it is not already a member. Removes it from this.closedTiles if needed. 
	*	Returns the added tile.
	*/
	this.addToOpen = function(tile) {
		if(Y.Object.hasKey(this.openTiles, tile.tileId)) {
			return tile;
		}else{
			this.openTiles[tile.tileId] = {init: true};
			return tile;
		}
		if(Y.Object.hasKey(this.closedTiles, tile.tileId)) {
			delete this.closedTiles[tile.tileId];
		}
	};
	
	/*
	*	addToClosed(tile)
	*	==================================
	*	Adds a tile to the this.closedTiles object if it is not already a member. Returns the added tile and also
	*	removes it from the this.openTiles object if present.
	*/
	this.addToClosed = function(tile) {
		if(Y.Object.hasKey(this.closedTiles, tile.tileId)) {
			return tile;
		}else{
			this.closedTiles[tile.tileId] = tile;
			return tile;
		}
		if(Y.Object.hasKey(this.openTiles, tile.tileId)) {
			delete this.openTiles[tile.tileId];
		}
	};
	
	/*
	*	isDiagonal(pointA, pointB)
	*	==================================
	*	Returns true if two points are diagional, returns false otherwise
	*/
	this.isDiagonal = function(pointA, pointB) {
		if(pointA['x'] != pointB['x'] && pointA['y'] != pointB['y']) {
			return true;	
		}
		return false;
	}
	
	/*
	*	isClosed(tile)
	*	==================================
	*	Returns true if a given tile is already closed. Otherwise returns false.
	*/
	this.isClosed = function(tile) {
		if(Y.Object.hasKey(this.closedTiles, tile.tileId)) {
			return true;
		}else{
			return false;
		}
	}
	
	/*
	*	estimateDistanceCost(pointA,pointB)
	*	==================================
	*	Gives a rough distance cost estimate between two points and tries to consider terrain.
	*/
	this.estimateDistanceCost = function(pointA,pointB) {
		var xDistance = Math.abs(pointA['x'] - pointB['x']);
		var yDistance = Math.abs(pointA['y'] - pointB['y']);
		var estimatedCost = (xDistance + yDistance) * this.squareCost;
		// console.log('estimating distance between: '+pointA['x']+','+pointA['y']+' and '+pointB['x']+','+pointB['y']+' at: '+estimatedCost);	
		return estimatedCost;
	}
	
}