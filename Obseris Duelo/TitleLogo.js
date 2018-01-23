//-----------------------------------------------------------------------------
// Title Logo 0.1
// by Hermes Passer (hermespasser@gmail.com)
// gladiocitrico.blogspot.com
//=============================================================================

/*:
 * @plugindesc Shows the logo with 'high' of opacity and name with 'low' opacity. When any key is pressed the opacity of name and logo are reversed.
 * @author Hermes Passer 
 
 * @param Wait Text
 * @desc Text showed when the game is waiting any key to be pressed.
 * @default Press any key
 
 * @param Highest Opacity
 * @desc Highest opacity of logo and name.
 * @default 255
 
 * @param Lowest Opacity
 * @desc Lowest opacity of the logo and name.
 * @default 100
 
 * @param Logo
 * @desc Game logo image. The image must be in titles2 folder.
 
 * @param Name
 * @desc Game title image. The image must be in titles2 folder.
 
 * @help
 * The name of this plugin must be TitleLogo.js
 */
 
var HermesNoShowMenu = true;

(function() {
	
	var parameters = PluginManager.parameters('TitleLogo'),
		highest    = parseInt(parameters['Highest Opacity'] || 255),
		lowest     = parseInt(parameters['Lowest Opacity'] || 100),
		waitText   = String(parameters['Wait Text'] || 'Press any key'),
		logoImage  = String(parameters['Logo'] || ''),
		nameImage  = String(parameters['Name'] || '')
		lowTextOp  = true;
	
	var alias_isBusy = Scene_Title.prototype.isBusy;
	Scene_Title.prototype.isBusy = function() {
		return HermesNoShowMenu || alias_isBusy.call(this);
	};
	
	var alias_update = Scene_Title.prototype.update;
	Scene_Title.prototype.update = function() {
		if((Input.isTriggered('ok') || TouchInput.isTriggered()) && HermesNoShowMenu){
			SoundManager.playOk();
			HermesNoShowMenu = false;
		}
		
		if (!HermesNoShowMenu){
			this.updateNoShowMenu();
		} else {
			this.updateWaitText();
		}
		
		alias_update.call(this);
	};
	
	Scene_Title.prototype.updateNoShowMenu = function(){		
		this._waitTextSprite.opacity -= 20;
		
		if (this._backSpriteLogo.opacity > lowest)
			this._backSpriteLogo.opacity -= 20;
		
		if (this._backSpriteName.opacity <= highest)
			this._backSpriteName.opacity += 20;
	}
	
	Scene_Title.prototype.updateWaitText = function(){		
		if (lowTextOp){		
			if (this._waitTextSprite.opacity > lowest)
				this._waitTextSprite.opacity -= 5;
			else lowTextOp = false;
		}
		else{
			if (this._waitTextSprite.opacity < highest)
				this._waitTextSprite.opacity += 5;
			else lowTextOp = true;
		}
	}
	
	var alias_createBg = Scene_Title.prototype.createBackground;
	Scene_Title.prototype.createBackground = function() {		
		alias_createBg.call(this);	
		this._backSpriteLogo = this._createSprite(logoImage);
		this._backSpriteName = this._createSprite(nameImage);
		this._backSpriteName.opacity = lowest;		
	};
	
	Scene_Title.prototype._createSprite = function(imageName) {
		var sprite = new Sprite(ImageManager.loadTitle2(imageName));
		this.addChild(sprite);
		this.centerSprite(sprite);
		sprite.y = sprite.y / 1.8;
		
		return sprite;
	}
	
	var alias_createFg = Scene_Title.prototype.createForeground;
	Scene_Title.prototype.createForeground = function() {
		alias_createFg.call(this);
		this._waitTextSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
		this.addChild(this._waitTextSprite);
		
		if (HermesNoShowMenu)
			this.drawWaitText();
	};
	
	Scene_Title.prototype.drawWaitText = function() {
		var x = 20;
		var y = Graphics.height - 155;
		var maxWidth = Graphics.width - x * 2;
		
		this._waitTextSprite.opacity = 0;
		this._waitTextSprite.bitmap.fontSize = 24;
		this._waitTextSprite.bitmap.drawText(waitText, x, y, maxWidth, 48, 'center');
	};
})();