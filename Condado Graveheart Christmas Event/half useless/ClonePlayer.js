//-----------------------------------------------------------------------------
// Clone Player 0.1
// by Hermes Passer (hermespasser@gmail.com)
// gladiocitrico.blogspot.com
//=============================================================================

/*:
 * @plugindesc Make a clone of the player, the clone walk randomically.
 * @author Hermes Passer
 
 * @help
 * plugin command: Clone <event id>
 * <event id> will turn into a clone
 * The clone just have some basic info of the player.
 */

(function() {

	//------ Entry Point

    var game_Interpreter = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {		
		game_Interpreter.call(this, command, args);
		if (command === 'Clone') {
			createClone(parseInt(args[0]));
        }
    };

	function createClone(id){
		var clone = $gameMap.event(id);
		
		// These are private fields, but who cares?
		clone._characterName  = $gamePlayer._characterName;
		clone._characterIndex = $gamePlayer._characterIndex;
		clone._opacity 		  = $gamePlayer._opacity;
		clone._directionFix   = false;
		clone._locked         = false;
		clone._moveType 	  = 1;
	}
})();