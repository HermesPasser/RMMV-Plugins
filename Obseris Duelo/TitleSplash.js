//-----------------------------------------------------------------------------
// Title Splash 0.1
// by Hermes Passer (hermespasser@gmail.com)
// gladiocitrico.blogspot.com
//=============================================================================

/*:
 * @plugindesc Show a splash screen before the title screen.
 * @author Hermes Passer 
  
 * @param Splash Images
 * @desc Add the images here separated by ','. All images must be in pictures folder.
 * @default 

 * @help
 * The name must be TitleSplash.js
 */
 
(function() {
	
	var parameters 	 = PluginManager.parameters('TitleSplash'),
		splashImages = String(parameters['Splash Images'] || '');

	Scene_Boot.prototype.start = function() {
		Scene_Base.prototype.start.call(this);
		SoundManager.preloadImportantSounds();
		if (DataManager.isBattleTest()) {
			DataManager.setupBattleTest();
			SceneManager.goto(Scene_Battle);
		} else if (DataManager.isEventTest()) {
			DataManager.setupEventTest();
			SceneManager.goto(Scene_Map);
		} else {
			this.checkPlayerLocation();
			DataManager.setupNewGame();
			SceneManager.goto(Scene_Splash);
			Window_TitleCommand.initCommandPosition();
		}
		this.updateDocumentTitle();
	};
	

	function Scene_Splash() {
		this.initialize.apply(this, arguments);
	}

	Scene_Splash.prototype = Object.create(Scene_Base.prototype);
	Scene_Splash.prototype.constructor = Scene_Splash;

	Scene_Splash.prototype.initialize = function() {
		Scene_Base.prototype.initialize.call(this);
	};

	Scene_Splash.prototype.create = function() {
		Scene_Base.prototype.create.call(this);
		this.lessOpacity = false;
		this.index = 0;
		this.createSplash();
	};

	Scene_Splash.prototype.createSplash = function() {
		var imgs = splashImages.split(',');

		this.sprites = [];
		for (var i = 0; i < imgs.length; i++){
			var sprite = new Sprite(ImageManager.loadPicture(imgs[i]));
			sprite.opacity = 0;
			
			this.sprites.push(sprite);
			this.addChild(this.sprites[i]);
			this.centerSprite(this.sprites[i]);
		}		
	};
	
	Scene_Splash.prototype.update = function() {
		if (!this.isBusy()) {
			this.updateSplash();	
		}
		Scene_Base.prototype.update.call(this);
	};

	var lessOp = false;
	Scene_Splash.prototype.updateSplash = function() {	
		this.sprites[this.index].opacity += !this.lessOpacity ? 1 : -1;
			
		if (this.sprites[this.index].opacity >= 255){
			this.sprites[this.index].opacity = 255;
			this.lessOpacity = true;
			return;
		}
		
		if (this.lessOpacity && this.sprites[this.index].opacity <= 0){
			this.sprites[this.index].opacity = 0;
			this.index++;
			this.lessOpacity = false;
			
			if (this.index >= this.sprites.length)
				SceneManager.goto(Scene_Title);
		}
	}
	
	Scene_Splash.prototype.isBusy = function() {
		return Scene_Base.prototype.isBusy.call(this);
	};

	Scene_Splash.prototype.terminate = function() {
		Scene_Base.prototype.terminate.call(this);
		SceneManager.snapForBackground();
	};

	Scene_Splash.prototype.centerSprite = function(sprite) {
		sprite.x = Graphics.width / 2;
		sprite.y = Graphics.height / 2;
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;
	};
})();