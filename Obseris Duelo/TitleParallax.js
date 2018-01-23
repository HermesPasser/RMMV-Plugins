//-----------------------------------------------------------------------------
// Title Parallax 0.1
// by Hermes Passer (hermespasser@gmail.com)
// gladiocitrico.blogspot.com
//=============================================================================

/*:
 * @plugindesc Change title 1 image to a parallax.
 * @author Hermes Passer 
  
 * @param Parallax name
 * @desc Name of the parallax image.
 * @default BlueSky

 * @help
 * The name must be TitleParallax.js
 */
 
(function() {
	
	var parameters 	 = PluginManager.parameters('TitleParallax'),
		parallaxName = String(parameters['Parallax name'] || 'BlueSky');

	Scene_Title.prototype.createBackground = function() {		
		this._backSprite1 = new TilingSprite();
		this._backSprite1.bitmap = ImageManager.loadParallax(parallaxName);
		this._backSprite1.move(0, 0, Graphics.width, Graphics.height);
		
		this._backSprite2 = new Sprite(ImageManager.loadTitle2($dataSystem.title2Name));
		
		this.addChild(this._backSprite1);
		this.addChild(this._backSprite2);
	};

	var alias_update = 	Scene_Title.prototype.update;
	Scene_Title.prototype.update = function() {
		alias_update.call(this);
		this._backSprite1.origin.x += 1;
	};
})();