//-----------------------------------------------------------------------------
// SaveName 0.1
// by Hermes Passer (hermespasser@gmail.com)
// gladiocitrico.blogspot.com
//=============================================================================

/*:
 * @plugindesc Change save file names.
 * @author Hermes Passer
 * 
 * @param config text
 * @desc new name to config.rpgsave.
 * @default config
 * 
 * @param global text
 * @desc new name to global.rpgsave.
 * @default global
 * 
 * @param file text
 * @desc new name to file<number>.rpgsave.
 * @default file
 *
 * @help
 * Thanks to Kazzter for the idea.
 *
 * The plugin name must be SaveName.js
 */

(function() {
	//------ Game Interpreter
	
    var parameters = PluginManager.parameters('SceneBook');
	var configText = String(parameters['config text'] || 'config'); 
	var globalText = String(parameters['global text'] || 'global'); 
	var fileText   = String(parameters['file text']   || 'file'); 
    
	StorageManager.localFilePath = function(savefileId) {
		var name;
		if (savefileId < 0) {
			name = fileText !== '' ? '%1.rpgsave'.format(configText) : 'config.rpgsave'
		} else if (savefileId === 0) {
			name = fileText !== '' ? '%1.rpgsave'.format(globalText) : 'global.rpgsave'
		} else {
			name = fileText !== '' ? '%1%2.rpgsave'.format(fileText, savefileId) : 'file%1.rpgsave'.format(savefileId);
		}
		return this.localFileDirectoryPath() + name;
	};
})();