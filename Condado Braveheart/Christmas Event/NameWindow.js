//-----------------------------------------------------------------------------
// Name Window 0.1
// by Hermes Passer (hermespasser@gmail.com)
// gladiocitrico.blogspot.com
//=============================================================================

/*:
 * @plugindesc Show the event name in a window when the player is talking to him.
 * @author Hermes Passer 
 
 * @help
 * Put in the first line of the text #[name/id]. Name is the name to be showed and the id is the event id.
 * Set event id as -1 to se the game player as the event.
 *
 * You also can use plugin command instead:
 * 		NameWindow <name> <event id> => Show a window with the name in the event with the id;
 * 		NameWindow player <name>     => Show a window with the name in the player;
 *		NameWindow off 				 => Disable window.
 */

(function() {
	
	var windowName, closeWhenBusy = true;
	
	// ================================================
	// Entry Point 
	// ================================================
	
	var sceneMap_start = Scene_Map.prototype.start;
	Scene_Map.prototype.start = function() {
		sceneMap_start.call(this);		
		windowName = new Window_Name(null, '');
		windowName.visible = false;
		this.addWindow(windowName);
	};
	
	var sceneMap_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		sceneMap_update.call(this);
		windowName.refresh();
	};

	var __command101 = Game_Interpreter.prototype.command101;
	Game_Interpreter.prototype.command101 = function() {
		var cmdReturn = __command101.call(this),
			lineOne   = $gameMessage._texts[0],
			initIndex = lineOne.indexOf('#['),
			endIndex  = lineOne.indexOf(']');

		// Has a name in the first line of the text
		if (initIndex !== -1 && endIndex !== -1){
			var cmdText = lineOne.substr(initIndex + 2, endIndex - 2),
				index   = cmdText.indexOf('/'),
				name    = cmdText.substr(0, index),
				id      = parseInt(cmdText.substr(index + 1, cmdText.length - 1));
				
			// Remove code from the text
			$gameMessage._texts[0] = lineOne.replace('#[' + cmdText + ']', '');
			
			closeWhenBusy = true;
			setWindow(name, id);
		}
		return cmdReturn;
	};
	
	function setWindow(name, id){
		if (name != '' && !isNaN(id)){
			if (id == -1)
				windowName.gameEvent = $gamePlayer;
			else
				windowName.gameEvent = getGameMapEventById(id);
			
			windowName.name = name;
			windowName.visible = true;
			windowName.refresh();
		}	
	}
	
	function getGameMapEventById(id){
		var events = $gameMap.events();
		for (var i = 0; i < events.length; i++){
			if (events[i]._eventId == id)
				return events[i];
		}
		return null;
	}
    
	var pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {		
		pluginCommand.call(this, command, args);
		
		if (command !== 'NameWindow')
			return;
		
		switch (args[0]){
			case 'off':
				windowName.gameEvent = null;
				windowName.visible = false;
				closeWhenBusy = true;
				break;
			case 'player':
				closeWhenBusy = false;
				setWindow(args[1], -1);
				break;
			default:
				closeWhenBusy = false;
				setWindow(args[0], args[1]);
		} 
    };
	
	// ================================================
	// HUD
	// ================================================
		
	function Window_Name(gameEvent, name) {
		this.initialize.apply(this, arguments);
		this.gameEvent = gameEvent;
		this.name = name;
	}

	Window_Name.prototype = Object.create(Window_Base.prototype);
	Window_Name.prototype.constructor = Window_Name;

	Window_Name.prototype.initialize = function(x, y) {
		Window_Base.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
		this.refresh();
	};

	Window_Name.prototype.windowWidth = function() {
		return 120;
	};

	Window_Name.prototype.windowHeight = function() {
		return 50;
	};

	Window_Name.prototype.refresh = function() {
		this.contents.clear();
		
		if (!this.gameEvent)
			return;
		
		if (!$gameMessage.isBusy() && closeWhenBusy)
			this.visible = false;
				
		this.x = this.gameEvent.screenX() - this.windowWidth() / 2;
		this.y = this.gameEvent.screenY() - $gameMap.tileWidth() * 2;
		
		this.contents.fontSize = 12;
		this.drawText(this.name, 1, -10, this.windowWidth(), 2);
	};

	Window_Name.prototype.open = function() {
		this.refresh();
		Window_Base.prototype.open.call(this);
	};
})();