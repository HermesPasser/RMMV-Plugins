//-----------------------------------------------------------------------------
// Title Exit Option 0.1
// by Hermes Passer (hermespasser@gmail.com)
// gladiocitrico.blogspot.com
//=============================================================================

/*:
 * @plugindesc Create a exit option in title screen.
 * @author Hermes Passer 
 
 * @param Exit text
 * @desc Text of the exit button.
 * @default tab

 * @help
 * The name of the file must be TitleExitOption.js
 */
 
(function() {
	
	var parameters = PluginManager.parameters('TitleExitOption'),
		textExit   = String(parameters['Exit text'] || 'Sair');
	
	var alias_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
	Window_TitleCommand.prototype.makeCommandList = function() {
		alias_makeCommandList.call(this);
		this.addCommand(textExit, 'exit');
	};
	
	Scene_Title.prototype.createCommandWindow = function() {
		this._commandWindow = new Window_TitleCommand();
		this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
		this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
		this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
		this._commandWindow.setHandler('exit',     this.commandExit.bind(this));
		
		// To math the y with the image menu space (only is need in Obseris Duelo version)
		// this._commandWindow.y += 50;
		this._commandWindow.opacity = 0;
		this.addWindow(this._commandWindow);
	};
	
	Scene_Title.prototype.commandExit = function() {
		SceneManager.exit();
	};
})();