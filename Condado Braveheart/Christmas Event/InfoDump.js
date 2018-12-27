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
 * infodump position x y - set the window position
 * infodump size width height - set the window size

 */

(function() {
	'use strict';
	
	var infoDump = null, visible = false;
	
	var pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {		
		pluginCommand.call(this, command, args);
		if (command.toLowerCase() !== 'infodump')
			return;
		
		const arg0 = args.shift();
		switch(arg0){
			case 'enable':
				enabled(true);
				break;
			case 'disable':
				enabled(false);
				break;
			case 'text':
				infoDump.text = args.join(' ');
				break;
			case 'position':
				infoDump.setPosition(args);
				break;
			case 'size':
				infoDump.setSize(args);
		}
    };

	function enabled(b_enabled) {
		visible = b_enabled; // needed when the scene changes and changes back
		infoDump.visible = b_enabled;
	}
	
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
		this.visible = visible;
		this.text = '';
	};
	
	Window_InfoDump.prototype.setSize = function(args) {
		infoDump.width = args[0] || infoDump.width;
		infoDump.height = args[1] || infoDump.height;
		infoDump.contents = new Bitmap(infoDump.width, infoDump.height);
	};
	
	Window_InfoDump.prototype.setPosition = function(args) {
		infoDump.x = args[0] || infoDump.x;
		infoDump.y = args[1] || infoDump.y;
	};
	
	Window_InfoDump.prototype.update = function() {
		Window_Base.prototype.update.call(this);
		this.contents.clear();
		const lines = this.text.split('\\n');
		for (let i = 0, y = 0; i < lines.length; i++, y += 25)
			this.drawTextEx(lines[i], 0, y);
	};
})();
