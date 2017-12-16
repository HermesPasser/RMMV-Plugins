//-----------------------------------------------------------------------------
// Player Shadow 0.2
// by Hermes Passer (hermespasser@gmail.com)
// gladiocitrico.blogspot.com
//=============================================================================

/*:
 * @plugindesc A shadow system for the character.
 * @author Hermes Passer 
 * @help
 * ...
 */

(function() {
	var opacity = 255;
	
	var __setTransparent = Game_CharacterBase.prototype.setTransparent;
	Game_CharacterBase.prototype.setTransparent = function(transparent) {
		__setTransparent.call(this, transparent);
		if ($gamePlayer)
			opacity = transparent ? 0 : $gamePlayer._opacity;
	};	
	
	Spriteset_Map.prototype.updateShadow = function() {
		var airship = $gameMap.airship();
		
		if ($gamePlayer.isInAirship()){
			this._shadowSprite.x = airship.shadowX();
			this._shadowSprite.y = airship.shadowY();
		} else {
			this._shadowSprite.x = $gamePlayer.screenX();
			this._shadowSprite.y = $gamePlayer.screenY() + 10;
		}
		
		this._shadowSprite.opacity = airship.shadowOpacity() || opacity;	
	};
})();