function PathFinder(map) {
	
	this.squareCost = 10;
	this.diagonalCost = 14;	
	this.openTiles = {};
	this.closedTiles = {};

	// main function used to set and store a potential path for given object id
	this.findPath = function(start,end) {
		console.log('finding a path from: '+start['x']+','+start['y']+' to: '+end['x']+','+end['y']);
		var nearestNodes = this.adjacentTiles(start);					
		// Dump our results in open tiles and calculate their costs
		Y.each(nearestNodes, function(tile) {            
		    var tileCost = (this.isDiagonal(start,tile)) ? this.diagonalCost : this.squareCost,
		        estCostFromTile = this.estimateDistanceCost(tile ,end),
		        calcCost = tileCost + estCostFromTile;		    
            this.openTiles[tile.x + '-' + tile.y] = {
                init: true,
				'tileId': tile.x + '-' + tile.y,
                'parent': start,
                'g' : tileCost,
                'h': estCostFromTile,
                'f': calcCost
            };		
        }, this);        
		console.log(this.openTiles, 'open');
		
		var lastClosedTile = this.addTileToClosed(); // the tile with the lowest 'f-cost' is added to closed tiles (pass parent)
		console.log(lastClosedTile, 'last');
		// 		lastClosedTile = map.tileIdToPoint(lastClosedTileId);
		// 		console.log('last closed tile ID: '+lastClosedTileId);
		// 		console.log(lastClosedTile);
					
		// end the loop if the end destination is a closed tile		
		if(this.isClosed(end['x']+'-'+end['y'])) {
			console.log('FOUND PATH!');
			console.log(this.closedTiles);
			return this.closedTiles;
		}else{ // run the loop again with the latest closed tile
			console.log('running again');
			var start = map.tileIdToPoint(lastClosedTile['tileId']);			
			console.log(start, 'recursive1');
			console.log(end,'recursive2');
			this.findPath(start,end);
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
		var tileId;
		Y.each(this.openTiles, function(tile,key) {
			if(lowestCost==null) {
				lowestCost = tile;
				lowestCost['tileId'] = key;
				tileId = key;
			}else{
				if(lowestCost['f'] > tile['f']) {
					lowestCost = tile;
					lowestCost['tileId'] = key;
					tileId = key;
				}
			}			
		});
		this.closedTiles[tileId] = lowestCost;		
		this.removeOpenTile(tileId);
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
	
	
	/*
	*	isClosed(tileId)
	*	==================================
	*	Returns true if a given tile (eg. '1-2') already appears in the closed tile object
	*/
	this.isClosed = function(id) {
		console.log('checking if tile '+id+' is closed', 'checking if closed');
		var found = false;
		if(typeof this.closedTiles[id] != 'undefined') {
			found = true;			
			console.log("FOUND TILE");
		}else{
			found = false;			
		}	
		return found;
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
		Y.each(adjacentTiles, function(tile,key) {
			var x = tile['x'];
			var y = tile['y'];
			tile['tileId'] = x+'-'+y;
			if(x < 1 || y < 1) {
				delete adjacentTiles[key];
			}
			//console.log(map.tiles,'MAP TILES');		
			for(tile in map.tiles) {
				if(map.tiles[tile]['terrain']) {
					
				}
			}			
			// if(map.tiles['1-6']['terrain'] !== 'undefined') {
			// 				console.log('not undefined','undefined');
			// 			}			// 
						// if(Y.hasKey(map.tiles['4-6'], 'terrain')) {
						// 	console.log('we have rendered terrain here','terrain');
						// };
			
			// if(map.tiles[tile['tileId']]['terrain'] != 'undefined') {
			// 				
			// 			}
		});			
		
		// todo - make a property set to false if tile is invalid (eg. offmap)
		console.log(adjacentTiles, 'adjacentTiles');
		return adjacentTiles;
	}
	
}