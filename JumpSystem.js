//-----------------------------------------------------------------------------
// Jump System 0.2
// by Hermes Passer (hermespasser@gmail.com)
// gladiocitrico.blogspot.com
//=============================================================================

/*:
 * @plugindesc A jump system plugin.
 * @author Hermes Passer
 
 * @param Key Code
 * @desc Jump key. Default is tab.
 * @default tab
 
 * @param SE Jump
 * @desc Sound when jump key. Default is 'Jump1'. Do not put a extension.
 * @default Jump1
 
 * @param SE Cannot Jump
 * @desc Sound when cannot jump. Default is 'Jump2'. Do not put a extension.
 * @default Jump2
 
 * @help
 * ...
 */

(function() {

    var parameters = PluginManager.parameters('jumpsystem');
	var keyCode    = String(parameters['Key Code'] || 'tab');
	var jumpSound  = String(parameters['SE Jump'] || 'Jump1');
	var jumpError  = String(parameters['SE Cannot Jump'] || 'Jump2');
		
	var Scene_Map_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		Scene_Map_update.call(this);
		
		if(Input.isTriggered(keyCode)) jump();
	};
	
	function jump(){
		var posx 	  = $gamePlayer.x, 
			posy 	  = $gamePlayer.y, 
			direction = $gamePlayer.direction(),
			movex = 0, movey = 0,
			directions = { down: 2,  left: 4, right: 6, up: 8 };

		switch(direction){
			case directions.down:
				posx += 0, posy += 2;
				movex = 0, movey = 2;
				break;
			case directions.left:
				posx += -2, posy += 0;
				movex = -2, movey = 0;
				break;
			case directions.right:
				posx += 2, posy += 0;
				movex = 2, movey = 0;
				break;
			case directions.up:
				posx += 0, posy -= 2;
				movex = 0, movey = 2;
		}
		
		if ($gameMap.isPassable(posx, posy, direction)){
			$gamePlayer.jump(movex, movey, direction);
			playSe(jumpSound);
		} else
			playSe(jumpError);
	}
	
	function playSe(sound){
		 AudioManager.playSe({name: sound, volume: 90, pitch: 100, pan: 0});
	}
})();