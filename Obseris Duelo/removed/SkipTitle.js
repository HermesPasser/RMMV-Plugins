/*:
 * @plugindesc Skip the title screen.
 * @author Hermes Passer
*/
Scene_Boot.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SoundManager.preloadImportantSounds();
    if (DataManager.isBattleTest()) {
        DataManager.setupBattleTest();
        SceneManager.goto(Scene_Battle);
    } else if (DataManager.isEventTest()) {
        DataManager.setupEventTest();
        // Game_Map._mapId = 0;
		SceneManager.goto(Scene_Map);
    } else {
        this.checkPlayerLocation();
		Scene_Boot.prototype.prepareToReset();
    }
    this.updateDocumentTitle();
}

var Scene_Title_prototype_start = Scene_Title.prototype.start;
Scene_Title.prototype.start = function() {
	Scene_Title_prototype_start.call(this);
    Scene_Boot.prototype.prepareToReset();
}

Scene_Boot.prototype.prepareToReset = function(){
    DataManager.setupNewGame();
	// Game_Map._mapId = 0;
    SceneManager.goto(Scene_Map);
}

Window_TitleCommand.prototype.makeCommandList = function() {};