<?php require_once 'php/map.php'; ?>
<?php require_once 'php/path.php'; ?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="css/basic.css" />
<!-- <script type="text/javascript" src="http://yui.yahooapis.com/combo?3.2.0/build/yui/yui-min.js"></script> -->
<script type="text/javascript" src="http://yui.yahooapis.com/3.2.0pr2/build/simpleyui/simpleyui-min.js"></script>
<title>Map Generator</title>
</head>

<body class="yui3-skin-sam">

	<h1>Map Generator</h1>
    
    <div id="map"></div>

	<div id="debugPanel">
		<ul>
		<li class="findPath"><a href="#">findpath</a></li>
		<li class="start"><a href="#">start</a></li>
		<li class="finish"><a href="#">finish</a></li>
		</ul>
	</div>

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
YUI().use('event', function(Y) {
	
	var MAP = function() {
			
		var point = {};
		var map = new Map(10,8);
		map.buildMap();
		map.printMap('map','div');				
		
		
		// Click States
		var placeStart = false;
		var placeFinish = false;		
		
		// A Type of Landscape
		var mountain = {
			name: 'mountain',	
			gold: 0,
			production: 0,
			movementCost: 0,
			passable: false,
			rendered: false
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
		
		// Click start
		Y.on('click', function(e) {
			placeFinish = true;
			e.preventDefault();			
		}, ".finish");
	
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
			else{
				var clickPoint = map.tileIdToPoint(e.target._node.id);
				map.placeTerrain(clickPoint,mountain);
			}		
		}
	};
	MAP();
	
});
</script> 
</body>
</html>