<?php require_once 'php/map.php'; ?>
<?php require_once 'php/path.php'; ?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<style type="text/css">
	body {font-family: Arial; color: #cccccc; font-size: 12px; background: url(images/space_background.jpg) center center no-repeat fixed; width: 1600px; height: 1200px;}
	#map {position: absolute; top: 200px; left: 350px; -webkit-perspective: 1000; width: 1010px; height: 808px; border-top: 1px solid #ccc;  border-left: 1px solid #efefef;  -webkit-transform: rotate(-45deg) skew(15deg, 15deg);}
	#map div {width: 100px; height: 100px; border-right: 1px solid #ccc; border-bottom: 1px solid #ccc; float: left; position: relative; background: url(images/earth.jpg);}
	.tileNumber {position: absolute; bottom: 3px; right: 3px;}
	
	/* UNITS */
	#map .infantry {background: green; background-image:none;}
	
	
	/* TERRAIN */	
	#map .mountain {background: #333;}
	
	#map .path {opacity: 0.7;}
	
</style>
<!-- <script type="text/javascript" src="http://yui.yahooapis.com/combo?3.2.0/build/yui/yui-min.js"></script> -->
<script type="text/javascript" src="http://yui.yahooapis.com/3.2.0pr2/build/simpleyui/simpleyui-min.js"></script>
<title>Map Generator</title>
</head>

<body class="yui3-skin-sam">

	<h1>Map Generator</h1>
    
    <div id="map"></div>

<script type="text/javascript" charset="utf-8">
</script>
    
	<!-- JS -->	
<script type="text/javascript" src="js/map.js"></script>
<script type="text/javascript" src="js/path.js"></script>
	<script type="text/javascript">

(function() {

var mappy = Y.namespace('MapTime', 'MapTime.bb', 'MapTime.yy');
//     bb = Y.namespace('MapTime.bb');
// mappy.foo();

  
})();


// Y.use('console','console-filters','dump', function(Y) {
// 
// 
// 
// 
// 
// 	new Y.Console({plugins: [ Y.Plugin.ConsoleFilters ], logSource: Y.Global}).render();
// 	
// 	var newAr = ['foor', 'baaarrr'];
// 	var newO = {'foo': 'bar', 'z': 'y'};
// 	
// 	Y.log('foo', 'bar', 'Map');
// 	
// 	Y.each(newAr, function(a) {
// 		Y.log(a,'zz', 'Map');
// 	});
// 
// 	Y.each(newO, function(v,k,o) {
// 		Y.log(v,'object', 'Map');
// 		Y.log(k,'object', 'Map');
// 		Y.log(o,'object', 'Map');
// 		console.log(o,'object', 'Map');
// 	});
// 	
// });

	var MAP = function() {
			
		var point = {};
		var map = new Map(10,8);
		map.buildMap();
		map.printMap('map','div');
		
		// A Type of Landscape
		var mountain = {
			name: 'mountain',	
			gold: 0,
			production: 0,
			movementCost: 0,
			passable: false,
			rendered: false
		};		
		
		point = map.generatePoint(4,6);
		map.placeTerrain(point,mountain);
		point = map.generatePoint(5,6);
		map.placeTerrain(point,mountain);
		point = map.generatePoint(6,6);
		map.placeTerrain(point,mountain);
		
		
		var infantry = {
			name: 'infantry',	
			hitpoints: 15,
			strength: 5,
			movementCost: 2
		};		
		
		
		point = map.generatePoint(1,2);
		var endpoint = map.generatePoint(7,5);
		var emerson = map.placeUnit(point,infantry);
		
		
		PathFinder = new PathFinder(map);
		PathFinder.findPath(point, endpoint, emerson); // stores a path object referenced by id	
		var emersonPath = PathFinder.closedTiles;
		
		map.highlightPath(emersonPath);
		console.log('moving emerson along the path: ');
		console.log(emersonPath);
	
		
	};
	MAP();
	
	// Create and intialize a new game map
	// map = new Map(10,8);
	// map.buildMap();
	// map.printMap('map','div');
	
	// Generate some impassable terrain
	// var point = map.generatePoint(4,6);
	// map.placeTerrain('mountain',0,0,0,point,false);
	// point = map.generatePoint(5,6);
	// map.placeTerrain('mountain',0,0,0,point,false);
	// point = map.generatePoint(6,6);
	// map.placeTerrain('mountain',0,0,0,point,false);
	
	// Place a unit on the map
	// var point = map.generatePoint(1,2);
	// var endpoint = map.generatePoint(7,5);
	// var emerson = map.placeUnit('emerson',10,10,2,point,true);
	// 
	// Create a pathfinder object
	// PathFinder = new PathFinder();
	// PathFinder.findPath(point, endpoint, emerson); // stores a path object referenced by id	
	// var emersonPath = PathFinder.closedTiles;
	
	// Highlight the path
	// map.highlightPath(emersonPath);
	// console.log('moving emerson along the path: ');
	// console.log(emersonPath);
	
	
</script> 
</body>
</html>