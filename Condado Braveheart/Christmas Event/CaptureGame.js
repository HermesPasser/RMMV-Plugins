//=============================================================================
// CaptureGame.js
// by Hermes Passer
// hermespasser.github.io / hermespasser@gmail.com
//=============================================================================

/*:
 * @plugindesc A capture game.
 * @author Hermes Passer
 
 * @param Score Text
 * @desc Text of score.
 * @default capturadas
 
 * @param Congratualion Text
 * @desc Text before the game ends.
 * @default Parabéns, você capturou %1 renas!
 
 * @param Time
 * @desc Timer in seconds. 60 is one minute.
 * @default 60
 
 * @help
 * The name must be CaptureGame.js
 *
 * Plugin Commands:
 *
 * CaptureGame start - start the game
 * CaptureGame stop - force the game to stop
 * CaptureGame add number - increase 'number' points to score
 * CaptureGame add number - decrease 'number' points to score
 */

(function() {
	// 'use strict';

	var currentScore = 0, started = false, windowText = null;
	
	// Manager
	var parameters = PluginManager.parameters('CaptureGame'),
	   time  	   = parseInt(parameters['Time'] || 60);
	   scoreText   = String(parameters['Score Text'] || 'capturadas'),
	   congratText = String(parameters['Congratualion'] || 'Parabéns, você capturou %1 renas!');
	   
	// ================================================
	// Entry Point 
	// ================================================
 
	var pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {		
		pluginCommand.call(this, command, args);
		if (command.toLowerCase() !== 'capturegame')
			return;
		
		switch (args[0].toLowerCase()){
			case 'start':
				start();
				break;
			case 'stop':
				stop();
				break;
			case 'add':
				addPoints(parseInt(args[1]));
				break;
			case 'remove':
				addPoints(-parseInt(args[1]));
				break;
		} 
    };
	
	function addPoints(points){
		if (points === void(0))
			return; // none or invalid points to add	
		currentScore += points;
	}
	
	function start(){
		started = true;
		windowText.visible = true;
		currentScore = 0;
		$gameTimer.start(time * 60);
	}
	
	function update(){
		windowText.refresh();
		if ($gameTimer.seconds() <= 0 && started)
			stop();
	}
	
	function stop(){
		started = false;
		windowText.visible = false;
		$gameMessage.add(congratText.format(currentScore));
		
		setTimeout(function(){
			SceneManager.goto(Scene_Title);
		}, 3000)	
	}
	
	// ~~~~~~~~~~~~~~~~~~
		
	var sceneMap_start = Scene_Map.prototype.start;
	Scene_Map.prototype.start = function() {
		sceneMap_start.call(this);
		windowText = new Window_Text(1,1);		
		this.addWindow(windowText);
	};

	var sceneMap_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		sceneMap_update.call(this);
		update();
	};
	
	// ~~~~~~~~~~~~~~~~~~
	
	function Window_Text() {
		this.initialize.apply(this, arguments);
	}

	Window_Text.prototype = Object.create(Window_Base.prototype);
	Window_Text.prototype.constructor = Window_Text;

	Window_Text.prototype.initialize = function(args) {
		Window_Base.prototype.initialize.call(this, 1, 1, 200, 120);
		this.contents.fontSize = 15;
		this.visible = false;
		this.opacity = 0;
	};

	Window_Text.prototype.refresh = function() {
		this.contents.clear();
		this.drawText("%1: %2".format(scoreText, currentScore), 5, 5, 200, 2);
	};
})();
