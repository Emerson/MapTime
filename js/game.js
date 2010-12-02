// Get your game on...
YUI().use('event', 'event-key', 'node', function(Y) {
			
	var MAP = function() {
		
		// Game Variables	
		var turn = 0;
		var point = {};
				
		// Map Initilization
		var map = new Map(10,8);
		map.buildMap();
		map.printMap('map','div');
		
		// Initialize Pathfinder
		var pathFinder = new PathFinder(map);
		
		// Map Data
		var terrain = {			
			mountain: {
				name: 'mountain',	
				gold: 0,
				production: 0,
				movementCost: 0,
				passable: false,
				rendered: false
			},			
			swamp: {
				name: 'swamp',	
				gold: 1,
				production: 1,
				movementCost: 0,
				passable: true,
				rendered: false
			},		
			plains: {
				name: 'plains',	
				gold: 3,
				production: 1,
				movementCost: 0,
				passable: true,
				rendered: false
			}
		};
		
		// Unit Data
		var infantry = {
			name: 'Infantry',
			type: 'infantry',	
			strength: 10,
			hitpoints: 10,
			movement: 2,
			cost: 40,
			passable: false,
			rendered: false
		};
		
		// Player Data
		var playerEmerson = {
			name: 'Emerson',
			gold: 100,			
			id: 1
		};
		var playerJack = {
			name: 'Jack',
			gold: 100,
			id: 2
		};
		
		// Add players to the game
		var emerson = new Player(map, playerEmerson);
		var jack = new Player(map, playerJack);
		
		/*
		*	Main Controls - Click Handler
		*	=============================
		*	Specifically controls the click states that occur on the top menu bar
		*/
		Y.on('click', function(e) {
			e.preventDefault();
			var className = e.currentTarget.get('parentNode.className');
			updateClickstates(className);
			
			// Update our control menu
			updateControls();
			
		}, '#topControls a');
		
		// Various Clickstates
		var clickStates = {
			'default': true,
			'buyUnit': false,
			'placeTerrain': false,
			'endTurn': false
		};
		
		/*
		*	function updateControls()
		*	=========================
		*	Repaints the control panel as required by looping through the clickstates and
		*	taking the proper action.
		*/
		var updateControls = function() {			
			console.log(clickStates, 'updateControls');
			Y.each(clickStates, function(value, key) {				
				
				// if this clickstate is active
				if(value == true) {
					
					switch(key) {
						
						case 'endTurn':
							endTurn();
							break;
							
						case 'buyUnit':
							console.log('buyUnit');
							break;
							
						case 'placeTerrain':
							console.log('placeTerrain');
							break;						
					}			
				}
									
			}, this);
		};
		
		/*
		*	function updateClickstates(clickstateKey)
		*	=========================================
		*	Updates the current clickstates. Sets all clickstates to false except the
		*	one passed in.
		*/		
		var updateClickstates = function(clickstateKey) {
			Y.each(clickStates, function(value,key) {
				if(clickstateKey == key) {
					clickStates[clickstateKey] = true;
				}else{
					clickStates[key] = false;
				}
			}, this);
		};
		
	};
	MAP();
	
});