// Pseudo-code A* from http://wiki.gamegardens.com/Path_Finding_Tutorial
//
//     create the open list of nodes, initially containing only our starting node
//    create the closed list of nodes, initially empty
//    while (we have not reached our goal) {
//        consider the best node in the open list (the node with the lowest f value)
//        if (this node is the goal) {
//            then we're done
//        }
//        else {
//            move the current node to the closed list and consider all of its neighbors
//            for (each neighbor) {
//                if (this neighbor is in the closed list and our current g value is lower) {
//                    update the neighbor with the new, lower, g value 
//                    change the neighbor's parent to our current node
//                }
//                else if (this neighbor is in the open list and our current g value is lower) {
//                    update the neighbor with the new, lower, g value 
//                    change the neighbor's parent to our current node
//                }
//                else this neighbor is not in either the open or closed list {
//                    add the neighbor to the open list and set its g value
//                }
//            }
//        }
//    }

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
		
		// return false if we have more tries than there are tiles (avoids infinate loops)
		if(this.tries > (map.width * map.height)) {
			return false;
		}
		this.tries++;
		
		// Add our starting node
		this.addToOpen(pointA);
				
		// Get adjacent tiles that are not impassible
		var adjacentTiles = this.getAdjacentTiles(pointA);		
		
		if(Y.Object.size(adjacentTiles)==0) {
			console.log('no adjacentTiles, looking for nearest open');
			var nearestOpen = this.findNearestOpenTile();			
			if(nearestOpen) {
				console.log('checking if '+nearestOpen['tileId']+' has any open tiles', 'findPath');
				this.findPath(nearestOpen,pointB);
			}else{
				console.log('Path not found, hit dead end at '+pointA['tileId'], 'findPath');
				return false;
			}
		}	
		
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
		if(this.isClosed(pointB)) {
			console.log('Path found! Checking closed tiles for optimal path!', 'complete');
			var bestPath = this.getBestPath(pointB);			
			return bestPath;
		}else{
			console.log('Running function again', 'processing...');
			this.findPath(lowestCostTile,pointB);
		}
	};
	
	/*
	*	findNearestOpenTile()
	*	==================================
	*	Follows back through parent tiles looking for open tiles. If an option tile is found the
	*	method simply returns the current tile (point), otherwise, it returns false and recursivly calls itself.
	*	It will	also return false if the current tile does not have a parent (and is thus the original starting point)
	*/
	this.findNearestOpenTile = function() {
		console.log('starting open tile find','findNearestOpenTile');
		var lowestCost = false;	
		Y.each(this.openTiles, function(tile,key) {
			if(Y.Object.hasKey(lowestCost,'g')) {
				if(tile.g < lowestCost.g) {
					lowestCost = tile;
				}
			}else{
				lowestCost = tile;
			}			
		}, this);
		console.log(lowestCost, 'findNearestOpenTile returning '+lowestCost.tileId);
		return lowestCost;
	};
	
	
	/*
	*	getBestPath(endpoint)
	*	==================================
	*	Used if the endpoint is now closed, meaning a path has been found. This function starts
	*	at the last tile and traces back an optimal path by comparing adjacent closed tiles.
	*/
	this.getBestPath = function(endpoint) {
		// We need to return an array of objects rather than just an object of objects. Although most
		// browsers will loop through an object of objects in the order you added them,
		// it is not considered 'correct' javascript and actually has some bugs in Chrome. So,
		// to avoid any issues, we need to pass back an array of objects that is ordered correctly.
		// Unlike objects of objects, arrays of objects will maintain their order.
		// Check out: http://stackoverflow.com/questions/648139/is-the-order-of-fields-in-a-javascript-object-predicatble-when-looping-through-th
		console.log('calculating best path', 'getBestPath');		
		var bestPath = [];
		var closedAdjacentTiles = {};
		// Step 1. Lets just get our closed tiles into an array (refactor eventually)
		Y.each(this.closedTiles, function(tile,key) {				
			closedAdjacentTiles[tile.tileId] = this.getClosedAdjacentTiles(tile);			
			bestPath.push(this.closedTiles[key]);
		},this);
		// return bestPath;
		// console.log(bestPath,'bestPath Array');
		// var parentTile;
		// 	if(Y.Object.hasKey(endpoint,'parent')) {
		// 		bestPath[this.closedTiles[endpoint]]
		// 	}else{
		// 		return bestPath;
		// 	}
	};	
	
	
	/*
	*	getClosedAdjacentTiles(tile)
	*	==================================
	*	Returns an object of adjacent, closed tiles. 
	*/
	this.getClosedAdjacentTiles = function(tile) {
		var adjacentTiles = {
			'top_left': {'x': tile['x']-1, 'y': tile['y']-1},
			'top': {'x': tile['x'], 'y': tile['y']-1},
			'top_right': {'x': tile['x']+1, 'y': tile['y']-1},
			'right' : {'x': tile['x']+1, 'y': tile['y']},
			'bottom_right': {'x': tile['x']+1, 'y': tile['y']+1},
			'bottom': {'x': tile['x'], 'y': tile['y']+1},
			'bottom_left': {'x': tile['x']-1, 'y': tile['y']+1},
			'left': {'x': tile['x']-1, 'y': tile['y']}
		};
		var closedAdjacentTiles = {};
		// Remove any tiles that are currently not on a closed list
		Y.each(adjacentTiles, function(adjacentTile,key) {
			var tileId = adjacentTile.x+'-'+adjacentTile.y;
			if(!Y.Object.hasKey(this.closedTiles[tileId])) {
				delete adjacentTiles[key];
			}else{
				adjacentTiles[tileId] = {x: adjacentTile.x, y: adjacentTile.y, tileId: tileId};
				delete adjacentTiles[key];
			}			
		},this);
		console.log(adjacentTiles, 'adjacent closed tiles for '+tile.x+'-'+tile.y);
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
			if(tile.x < 1 || tile.y < 1 || tile.x > map.width || tile.y > map.height) {
				console.log('removing tile: '+key);
				delete adjacentTiles[key];
			}
			// Remove any tiles that have terrain
			if(Y.Object.hasKey(map.tiles[tile.tileId], 'terrain')) {
				delete adjacentTiles[key];
				// console.log('Tile '+key+' has impassable terrain','TERRAIN');
			}
			// Remove any tiles already in the closed list				
			if(Y.Object.hasKey(this.closedTiles, tile.tileId)) {
				console.log('deleting tile '+key+' from adjacentTiles');
				delete adjacentTiles[key];
				console.log('Tile '+key+' is already closed','adjacentTiles');
			}
		}, this);
		console.log(adjacentTiles, 'adjacent post delete');
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