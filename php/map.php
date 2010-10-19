<?php
class Map {
	
	public $map = array(
		'width' => 3,
		'height' => 3
	);
	
	/*
	*	Builds the initial map
	*/
	function __construct() {
		for($x=1; $x <= $this->map['width']; $x++):
			for($y=1; $y <= $this->map['height']; $y++):
				$this->map['tiles'][$x][$y]['init'] = true;
			endfor;
		endfor;		
	}
	
	
}
?>