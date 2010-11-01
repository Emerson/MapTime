// Get your game on...
YUI().use('event', 'event-key', function(Y) {
	
	
	/* Add much needed hover support to YUI */
	Y.Event.define("hover", {
	    on: function (node, sub, notifier) {
	        // To make detaching the associated DOM events easy, use a
	        // detach category, but keep the category unique per subscription
	        // by creating the category with Y.guid()
	        sub._evtGuid = Y.guid() + '|';

	        node.on(sub._evtGuid + "mouseenter", function (e) {
	            // Firing the notifier event executes the hover subscribers
	            // Pass along the mouseenter event, which will renamed "hover"
	            notifier.fire(e);
	        });
	    },

	    detach: function (node, sub, notifier) {
	        // Detach the mouseenter and mouseout subscriptions using the detach
	        // category - node.detach( 'foo|*' ) detaches everything in category foo
	        node.detach(sub._evtGuid + '*');
	    }
	} );
	
	
	var MAP = function() {
			
		var point = {};
		var turn = 0;
		var map = new Map(10,8);
		var selectedUnit = {};
		map.buildMap();
		map.printMap('map','div');
		
		// Add two players
		var playerData = {
			name: "Emerson",
			id: 1
		};
		var player1 = new Player(map, playerData);
		
		
		console.log(map.tiles);		
		
		
		// Click States
		var placeStart = false;
		var placeFinish = false;
		var addUnit = false;		
		
		// A Type of Landscape
		var mountain = {
			name: 'mountain',	
			gold: 0,
			production: 0,
			movementCost: 0,
			passable: false,
			rendered: false
		};
		
		var infantry = {
			name: 'Infantry',
			type: 'infantry',	
			strength: 10,
			hitpoints: 10,
			movement: 3,
			passable: false,
			rendered: false
		};
		
			var nextTurn = function() {
				turn++;				
				Y.one('.turnCounter').set('innerHTML', turn);
				console.log('the current turn is: '+turn);
				map.updateMap();
			};
											
		// Click find path
		Y.on('click', function(e) {
			var path;
			var start = Y.one('.start');
			var finish = Y.one('.finish');						
			console.log(start, 'start');
			console.log(finish, 'finish');
			start = map.tileIdToPoint(start._node.id);
			finish = map.tileIdToPoint(finish._node.id);
			console.log(start, 'point start');
			console.log(finish, 'point finish');
			PathFinder = new PathFinder(map);
			PathFinder.findPath(start, finish); // stores a path object referenced by id		
			// path = PathFinder.closedTiles; // stupid pathfinding
			map.highlightPath(PathFinder.finalPath);
			// alert('clicked find path');
			e.preventDefault();
		}, ".findPath");
		
		// Click start
		Y.on('click', function(e) {
			placeStart = true;
			e.preventDefault();			
		}, ".start");
		
		
		/*
		*	When an infantry unit is clicked...
		*/
		Y.on('click', function(e) {			
			var tileId = e.target.get('parentNode').get('id');
			selectedUnit = map.tiles[tileId]['unit'];
			selectedUnit['tileId'] = tileId;
			console.log(selectedUnit['name']);			
			Y.one('.selectedUnit').set('innerHTML', selectedUnit['name']);
			e.preventDefault(); 
		}, '.infantry');
		
		// Click start
		Y.on('click', function(e) {
			placeFinish = true;
			e.preventDefault();		
		}, ".finish");
		
		Y.on('click', function(e) {
			nextTurn();
			e.preventDefault();	
		}, '.nextTurn');
		
		Y.on('click', function(e) {
			addUnit = true;
			e.preventDefault();	
		}, '.addUnit');
	
		Y.on('click', handleClick, "#map div");
		function handleClick(e) {
			if(placeStart) {
				var clickPoint = map.tileIdToPoint(e.target._node.id);
				map.addStart(clickPoint);
				placeStart = false;
				
			}
			else if(placeFinish) {
				var clickPoint = map.tileIdToPoint(e.target._node.id);
				map.addFinish(clickPoint);
				placeFinish = false;
			}
			else if(addUnit) {
				var clickPoint = map.tileIdToPoint(e.target._node.id);
				player1.addUnit(clickPoint,infantry);
				addUnit = false;
			}
			else{				
				if(Y.Object.size(selectedUnit) == 0) {
					var clickPoint = map.tileIdToPoint(e.target._node.id);
					map.placeTerrain(clickPoint,mountain);
				}
			}		
		};
		
		
		/* Hover Events */
		Y.on('mouseenter', function(e) {
			if(Y.Object.size(selectedUnit) > 0) {							
				Y.all('#map div').removeClass('path');
				map.clearPath();				
				var endTile = map.tileIdToPoint(e.target.get('id'));				
				var startTile = map.tileIdToPoint(selectedUnit.tileId);
				// make sure this is actually passable	
				if(!Y.Object.hasKey(map.tiles[endTile.tileId], 'terrain') ||
					!Y.Object.hasKey(map.tiles[endTile.tileId], 'path')) {
					var unitPathFinder = new PathFinder(map);							
					var unitPath = unitPathFinder.findPath(startTile, endTile);
					if(unitPath!=false) {
						map.highlightPath(unitPathFinder.finalPath);
					}	
				}
			}
		}, '#map div');
		
		
		/* Key events */
		
		Y.one(document).on("keyup", doKey, null, "up"); 
		function doKey(e, param) {
			// keyCode for ESC is 27	    
			if(e.charCode == 27) {
				map.clearPath();
				Y.all('#map div').removeClass('path');
				selectedUnit = {};
			}	
	    // Y.one("#testResults").set("innerHTML", msg);
	  }
		// Y.on('key', function(e) {
		// 	        Y.log(e.type + ": " + e.keyCode);
		// 
		// 	        // stopPropagation() and preventDefault()
		// 	        e.halt();
		// 
		// 	        // unsubscribe so this only happens once
		// 	        handle.detach();
		// 
		// 	    // Attach to 'text1', specify keydown, keyCode 13, make Y the context, add arguments
		// 	    }, '#map', 'down:27', Y);
		
	};
	MAP();
	
});