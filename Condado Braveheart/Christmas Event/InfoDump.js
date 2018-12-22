//=============================================================================
// InfoDump.js
// by Hermes Passer
// hermespasser.github.io / hermespasser@gmail.com
//=============================================================================

/*:
 * @plugindesc Show text on screen.
 * @author Hermes Passer

 * @help
 *
 * Plugin Commands:
 *
 * infodump enable - show the window
 * infodump disable - hide the window
 * infodump text <text> - set the text to be displayed

 */

(function() {
	'use strict';
	
	var infoDump = null;
	
	var pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {		
		pluginCommand.call(this, command, args);
		if (command.toLowerCase() !== 'infodump')
			return;
		
		const arg0 = args.shift();
		switch(arg0){
			case 'enable':
				infoDump.visible = true;
				break;
			case 'disable':
				infoDump.visible = false;
				break;
			case 'text':
				infoDump.text = (args || []).join(' ');
				break;
		}
    };
	
	// ~~~~~~~~~~~~~~~~~~
		
	var sceneMap_start = Scene_Map.prototype.start;
	Scene_Map.prototype.start = function() {
		sceneMap_start.call(this);
		infoDump = new Window_InfoDump();		
		this.addWindow(infoDump);
	};
	
	// ~~~~~~~~~~~~~~~~~~
	
	function Window_InfoDump() {
		this.initialize.apply(this, arguments);
	}

	Window_InfoDump.prototype = Object.create(Window_Base.prototype);
	Window_InfoDump.prototype.constructor = Window_InfoDump;

	Window_InfoDump.prototype.initialize = function() {
		Window_Base.prototype.initialize.call(this, 1, 1, 250, 70);
		this.visible = false;
		this.text = '';
	};
	
	Window_InfoDump.prototype.update = function() {
		Window_Base.prototype.update.call(this);
		this.contents.clear();
		this.drawTextEx(this.text, 0, 0);
	};
})();
