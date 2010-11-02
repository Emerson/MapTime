// Javascript Map Class

function Map(width, height) {
		
	this.width = width;
	this.height = height;
	this.tiles = {};
		    		
	/*
	*	buildMap()
	*	==========
	*	Builds our map tiles using a coardinates system of x-y. The tiles are
	*	stored in the map.tiles object and are used throughout the game.
	*/ 
	this.buildMap = function() {												
		for(y=1; y<=this.height; y++) {
			for(x=1; x<=this.width; x++) {
				this.tiles[x+'-'+y] = {init: true};
			}			
		}
	};
	
	/*
	*	printMap(element_id, element_type)
	*	==================================
	*	Appends the initial map tiles inside the referenced element (element_id). The elements
	*	'printed' to the screen can be HTML element (element_type). Usually <div> or <li>.
	*/
	this.printMap = function(element_id,element_type) {		
		var mapContainer = document.getElementById(element_id);		
		for(tile in this.tiles) {
			newTile = document.createElement(element_type);
			newTile.id = tile;
			newTile.innerHTML = '<span class="tileNumber">'+tile+'</span>';
			mapContainer.appendChild(newTile);
		}
	};
	
	/*
	*	generatePoint(x, y)
	*	==================================
	*	A quick and simple way to create point objects, which contain an 'x', 'y', and tileId value.
	*/
	this.generatePoint = function(x,y) {	
		var point = {
			"x": x,
			"y": y,
			"tileId": x+'-'+y
		}
		return point;
	};
	
	/*
	*	tileIdToPoint(tileId)
	*	==================================
	*	Takes a string tile id (eg. 3-5) and returns a point object.
	*/
	this.tileIdToPoint = function(id) {
		var split = id.split('-')
		var tilePoint = {
			x: Number(split[0]),
			y: Number(split[1]),
			tileId: id
		};		
		return tilePoint;
	};
	
	/*
	*	clearPath()
	*	==================================
	*	Clears any paths painted on the map.
	*/
	this.clearPath = function() {		
		Y.each(this.tiles, function(tile, tileId) {
			if(Y.Object.hasKey(tile, 'path')) {
				console.log('detete path');
				delete tile['path'];
			}
		}, this);
		this.updateMap();
		return true;
	};
	
	/*
	*	placeTerrain(point, terrainObject)
	*	==================================
	*	Adds terrain details to the main map.tiles object. Refer to the mountain example below for a better
	*	understanding of how this works. Note: This does not actually render the terrain.
	*		
	*	var mountain = {
	*		name: 'mountain',	
	*		gold: 0,
	*		production: 0,
	*		movementCost: 0,
	*		passable: false,
	*	};
	*/
	this.placeTerrain = function(point,terrain) {		
		this.tiles[point['tileId']]['terrain'] = terrain;
		this.tiles[point['tileId']]['terrain']['rendered'] = false;
		this.updateMap();
	};
	
	/*
	*	placeUnit(point, unitObject)
	*	==================================
	*	Adds unit details to the tiles object. Upon creation, each unit is given a unique ID that can be used to reference the
	*	individual unit through the game.
	*		
	*	var infantry = {
	*		name: 'infantry',	
	*		hitpoints: 10,
	*		strength: 5,
	*		movementPoints: 2
	*		modifiers: {
	*			defense: 100,
	*			attack: 50,
	*			cityAttack: 50,
	*			vsRanged: 50,
	*			vsMounted: -50,
	*			vsMelee: 0
	*		}
	*	};
	*/
	this.placeUnit = function(point,unit) {		
		var newDate = new Date();
		unit['id'] = newDate.getTime();
		unit['rendered'] = false;	
		this.tiles[point['tileId']]['unit'] = unit;		
		this.updateMap();
		return unit;
	};

	/*
	*	addStart(point)
	*	==================================
	*	Adds a visual start point on the map. Primary used for debugging.
	*/
	this.addStart = function(point) {
		console.log(point);
		this.tiles[point.tileId]['start'] = {init: true};
		this.updateMap();
	};
	
	/*
	*	addFinish(point)
	*	==================================
	*	Adds a visual start point on the map. Primary used for debugging.
	*/
	this.addFinish = function(point) {
		console.log(point);
		this.tiles[point.tileId]['finish'] = {init: true};
		this.updateMap();
	};
	
	/*
	*	updateMap()
	*	==================================
	*	When called, this will loop through the central map.tiles object and 'render' (add class) any
	*	unrendered units, terrain, paths, and other objects.
	*/
	this.updateMap = function() {
		console.log('updating map');
		Y.each(this.tiles, function(tile,key) {			
			// console.log(tileId);
			if(Y.Object.hasKey(tile,'terrain')) {
				Y.one('[id='+key+']').addClass(this.tiles[key]['terrain']['name']);
			}
			if(Y.Object.hasKey(tile,'unit') && tile['unit']['rendered'] == false) {
				var newUnit = document.createElement('a');
				newUnit.className = this.tiles[key]['unit']['type'];
				newUnit.href = '#';
				tile['unit']['rendered'] = true;
				document.getElementById(key).appendChild(newUnit);
			}
			if(Y.Object.hasKey(tile,'path')) {
				Y.one('[id='+key+']').addClass('path');				
			}
			if(Y.Object.hasKey(tile,'start')) {
				Y.one('[id='+key+']').addClass('start');		
			}
			if(Y.Object.hasKey(tile,'finish')) {
				Y.one('[id='+key+']').addClass('finish');			
			}
		}, this);
	}
	
	/*
	*	highlightPath()
	*	==================================
	*	A convenience method used to debug path finding. Given a path object, it will highlight
	*/
	this.highlightPath = function(path) {
		console.log(path,'highlighting path tiles');
		Y.each(path, function(tile) {
			console.log(tile,'pathfinding');
			this.tiles[tile.tileId]['path'] = {init: true};
			// console.log(tile,'pathfinding');
		}, this);
		// for(tile in path) {
		// 	document.getElementById(tile).className += " path";
		// 	this.tiles[tile]
		// }
		// for(var i=0; i<path.length; i++) {			
		// 	this.tiles[ path[i]['x'] ][ path[i]['y'] ]['terrain'] = {name: 'path', rendered: false};		
		// }
		this.updateMap();
	}
	
};