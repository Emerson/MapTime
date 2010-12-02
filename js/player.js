// 	var init = {
// 		playerName: 'Emerson',
// 		ai: false,
//		id: q04687408670846u430
// 	}


function Player(map, init) {

	// Player Meta Data
	this.playerId = 0;
	this.playerName = '';
	
	// Player Assets
	this.cities = {};
	this.units = {};
	this.gold = 0;
	
	/*
	*	addUnit(unit)
	*	==================================
	*	Adds a unit for this player and (optinally) updates the map
	*/
	this.addUnit = function(tile, unit) {
		var uniqueId = this.generateId();		
		this.units[unit['type']+'_'+uniqueId] = unit;
		map.tiles[tile.tileId]['unit'] = unit;
		console.log(this.units, 'players units');
		map.updateMap();		
	};
	
	/*
	*	generateId()
	*	==================================
	*	Generates a unique ID used when naming units.
	*/
	this.generateId = function() {
	    var newDate = new Date;
		return newDate.getTime();
	};
				
};


var tile = {
	x: 5,
	y: 3,
	tileId: '5-3'
}