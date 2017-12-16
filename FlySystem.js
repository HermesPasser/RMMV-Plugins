//-----------------------------------------------------------------------------
// Fly System 0.1
// by Hermes Passer (hermespasser@gmail.com)
// gladiocitrico.blogspot.com
//=============================================================================

/*:
 * @plugindesc Allow the player to fly.
 * @author Hermes Passer 
 
 * @help
 * ...
 */

(function() {
	var opacity = 0, show = false;

	// ================================================
	// Entry Point 
	// ================================================
	
	var pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {		
		pluginCommand.call(this, command, args);
		if (command !== 'FlySystem')
			return;
		
		switch (args[0]){
			case 'on':  flyOn();  break;
			case 'off': flyOff(); break;
		} 
    };
	
	function flyOn(){
		$gamePlayer.setWalkAnime(false);
		$gamePlayer.setThrough(true);
		$gamePlayer.setMoveSpeed(5);
		$gamePlayer.setPriorityType(2);
		opacity = $gamePlayer._opacity;
		show = true;
	}
	
	function flyOff(){
		$gamePlayer.setWalkAnime(true);
		$gamePlayer.setThrough(false);
		$gamePlayer.setPriorityType(1);
		$gamePlayer.setMoveSpeed(4);
		opacity = 0;
		show = false;
	}
	
	var __setTransparent = Game_CharacterBase.prototype.setTransparent;
	Game_CharacterBase.prototype.setTransparent = function(transparent) {
		__setTransparent.call(this, transparent);
		if ($gamePlayer && show)
			opacity = transparent ? 0 : $gamePlayer._opacity;
	};	
	
	Spriteset_Map.prototype.updateShadow = function() {
		var airship = $gameMap.airship();
		
		if ($gamePlayer.isInAirship()){
			this._shadowSprite.x = airship.shadowX();
			this._shadowSprite.y = airship.shadowY();
		} else {
			this._shadowSprite.x = $gamePlayer.screenX();
			this._shadowSprite.y = $gamePlayer.screenY() + 15;
		}
		
		this._shadowSprite.opacity = airship.shadowOpacity() || opacity;	
	};

})();