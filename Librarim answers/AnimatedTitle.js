//-----------------------------------------------------------------------------
// Animated Title 0.1
// by Hermes Passer (hermespasser@gmail.com)
// gladiocitrico.blogspot.com
//=============================================================================

/*:
 * @plugindesc ...
 * @author Hermes Passer 
 
 * @param Animation Frames
 * @desc Split with ',' and do not add the file type, e.g: frame1,frame2,...
 * @default none
 
 * @param Start Position X
 * @desc Start position of animation.
 * @default 10
 
 * @param Start Position Y
 * @desc Start position of animation.
 * @default 10
 
 * @param Move X Velocity
 * @desc Move velocity in x.
 * @default 1
 
 * @param Move Y Velocity
 * @desc Move velocity in y.
 * @default 1

 * @param Delay
 * @desc Frames to wait.
 * @default 10
 
 * @help
 * The plugin name must be AnimatedTitle.js
 */

(function() {
	
	var parameters  = PluginManager.parameters('AnimatedTitle');
	var animFrames  = parameters['Animation Frames'] || null;
	var positionX   = parseInt(parameters['Start Position X'] || 10);
	var positionY	= parseInt(parameters['Start Position Y'] || 10);
	var velocityX   = parseInt(parameters['Move X Velocity'] || 1);
	var velocityY	= parseInt(parameters['Move Y Velocity'] || 1);
	var delay		= parseInt(parameters['delay'] || 10);
	
	var currentTimeToDelay = 0;
	
	// Initialize the array with name of frame files
	var alias_createBg = Scene_Title.prototype.createBackground;
	Scene_Title.prototype.createBackground = function() {
		alias_createBg.call(this);
		
		if (animFrames === null)
			throw Error("Cannot find the frames at 'Animation Frames', make sure that the plugin name is " + 
						"AnimatedTitle.");
		
		var imgs = animFrames.split(',');
		this.charSprites = [];
		this.charIndex = 0;
		
		for (var i = 0; i < imgs.length; i++){
			var sprite = new Sprite(ImageManager.loadPicture(imgs[i]));
			sprite.opacity = 0;
			sprite.x = positionX;
			sprite.y = positionY;
			
			this.charSprites.push(sprite);
			this.addChild(this.charSprites[i]);
		}	
	};
	
	var alias_update = Scene_Title.prototype.update;
	Scene_Title.prototype.update = function() {
		alias_update.call(this);
		this.updateAnimation();
		this.moveAnimation();
	}
	
	// Update the animation
	Scene_Title.prototype.updateAnimation = function() {
		currentTimeToDelay++;
		
		if (currentTimeToDelay >= delay){
			this.charSprites[this.charIndex].opacity = 0;
			this.charIndex = (this.charIndex + 1) % this.charSprites.length;
			this.charSprites[this.charIndex].opacity = 255;

			currentTimeToDelay = 0;
		}
	}
	
	// Move the animation
	Scene_Title.prototype.moveAnimation = function() {		
		if (this.charSprites[this.charIndex].x > Graphics.width)
			for (var i = 0; i < this.charSprites.length; i++)
				this.charSprites[this.charIndex].x = -this.charSprites[this.charIndex].width;
			
		if (this.charSprites[this.charIndex].y > Graphics.height)
			for (var i = 0; i < this.charSprites.length; i++)
				this.charSprites[this.charIndex].y = -this.charSprites[this.charIndex].height;

		for (var i = 0; i < this.charSprites.length; i++){
			this.charSprites[this.charIndex].x += velocityX;
			this.charSprites[this.charIndex].y += velocityY;
		}
	}
		
})();