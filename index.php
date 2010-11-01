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
	    
    <div id="map"></div>

	<div id="debugPanel">
		<ul>
			<li class="findPath"><a href="#">findpath</a></li>
			<li class="start"><a href="#">start</a></li>
			<li class="finish"><a href="#">finish</a></li>			
			<li class="nextTurn"><a href="#">next turn</a></li>
			<li class="addUnit"><a href="#">add unit</a></li>
		</ul>
		<p class="turnCounter"></p>
	</div>
	
	<div id="unitPanel">
		<p class="selectedUnit"></p>
	</div>	

<!-- JS -->	
<script type="text/javascript" src="js/map.js"></script>
<script type="text/javascript" src="js/path.js"></script>
<script type="text/javascript" src="js/player.js"></script>
<script type="text/javascript" src="js/game.js"></script>

</body>
</html>