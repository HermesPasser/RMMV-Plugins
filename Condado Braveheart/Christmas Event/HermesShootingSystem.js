//-----------------------------------------------------------------------------
// Hermes Shooting System 0.1
// by Hermes Passer (hermespasser@gmail.com)
// gladiocitrico.blogspot.com
// 
// Nota: Eu acho que se o inimigo for deletado do jeito normal por eventos
// a hub permanece
//=============================================================================

/*:
 * @plugindesc Simple shooting system.
 * @author Hermes Passer 
 
 * @param Key Code
 * @desc Shot key. Default is tab.
 * @default tab
 
 * @param Shot SE
 * @desc Sound when the player shot. Do not put a extension.
 * @default Fire1
 
 * @param Hit SE
 * @desc Sound when an enemy was hit. Do not put a extension.
 * @default Damage1
 
 * @param Miss SE
 * @desc Sound a wall was hit. Do not put a extension.
 * @default Miss  
   
 * @param Animation Shot
 * @desc Id of the animation when the player shot.
 * @default null
 
 * @param Animation Hit
 * @desc Id of the animation when an enemy was hit.
 * @default 1
 
 * @help
 * The name of this plugin must be HermesShootingSystem.js
 */

(function() {
	
	var enemiesHub = [];
	
    var parameters = PluginManager.parameters('HermesShootingSystem'),
	    keyCode   	  = String(parameters['Key Code'] || 'tab'),
	    soundShot 	  = String(parameters['Shot SE'] || 'Fire1'),
	    soundHit  	  = String(parameters['Hit SE']  || 'Damage1'),
	    soundMiss 	  = String(parameters['Miss SE'] || 'Miss'),
	    animationHit  = parseInt(parameters['Animation Hit'] || 1),
	    animationShot = parseInt(parameters['Animation Shot'] || null);
	
	// ================================================
	// Entry Point 
	// ================================================
	
	var sceneMap_start = Scene_Map.prototype.start;
	Scene_Map.prototype.start = function() {
		sceneMap_start.call(this);
		setupEnemies(this);
	};
	
	var sceneMap_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		sceneMap_update.call(this);
		if(Input.isTriggered(keyCode)) shot();
				
		for (var i = 0; i < enemiesHub.length; i++)
			enemiesHub[i].refresh();
	};

	// ================================================
	// Shot 
	// ================================================
	
	function setupEnemies(sceneMapInstance){
		var events = $gameMap.events();
		for (var i = 0; i < events.length; i++){
			var note = events[i].event().note;
			if (note !== "enemy" && note !== "zombie")
				continue;
			
			// Define new fields
			events[i].hermes_life = 100; // total life
			events[i].hermes_applyDamage = function(damage){
				this.hermes_life -= damage;
				if (this.hermes_life <= 0){
					
					// Delete hub
					for (var j = 0; j < enemiesHub.length; j++){
						if (enemiesHub[j].enemyGameEvent === this){ // If the window hub as this instance
							enemiesHub[j].enemyGameEvent = null;
							enemiesHub[j].destroy();
							enemiesHub.splice(j, 1);
							break;
						}
					}
					this.erase(); // Delete the enemy
				}
			}
			
			// Create HUD
			var enemy = new Window_EnemyHUD(events[i]);
			sceneMapInstance.addWindow(enemy);
			enemiesHub.push(enemy);
		}
	}
	
	function shot(){
		var posx 	   = 0,
			posy 	   = 0,
			mapWidth   = $gameMap.width(),
			mapHeight  = $gameMap.height(),
			playerX	   = $gamePlayer.x,
			playerY	   = $gamePlayer.y,
			direction  = $gamePlayer.direction(),
			directions  = { down: 2,  left: 4, right: 6, up: 8 };

		switch(direction){
			case directions.down:  posy += 1;  break;
			case directions.up:    posy += -1; break;
			case directions.left:  posx += -1; break;
			case directions.right: posx += 1;  break;
		}
		
		$gamePlayer.requestAnimation(animationShot);
		playSe(soundShot);
		
		for (var x = playerX, y = playerY; x >= 0 && x <= mapWidth && y >= 0 && y <= mapHeight; x += posx, y += posy)
		{
			var enemyId = $gameMap.eventIdXy(x, y);
			var passable = $gameMap.isPassable(x, y, direction);
			
			// There is a non-passable tile
			if (!passable){
				playSe(soundMiss);
				break;
			}
			
			// There is a event in the current position
			if (enemyId > 0){	
				var enemy = getGameMapEventById(enemyId);
				var note  = enemy.event().note;
				
				// Is a enemy event
				if (note === "enemy" || note === "zombie"){
					enemy.requestAnimation(animationHit);
					enemy.hermes_applyDamage(10);
					enemy.jump(0,0);
					playSe(soundHit);
				}
			}			
		}
	}	
	
	function getGameMapEventById(id){
		var events = $gameMap.events();
		for (var i = 0; i < events.length; i++){
			if (events[i]._eventId == id)
				return events[i];
		}
		return null;
	}
	
	function playSe(sound){
		 AudioManager.playSe({name: sound, volume: 90, pitch: 100, pan: 0});
	}

	// ================================================
	// HUD
	// ================================================
		
	function Window_EnemyHUD(enemyGameEvent) {
		this.initialize.apply(this, arguments);
		this.enemyGameEvent = enemyGameEvent;
	}

	Window_EnemyHUD.prototype = Object.create(Window_Base.prototype);
	Window_EnemyHUD.prototype.constructor = Window_EnemyHUD;

	Window_EnemyHUD.prototype.initialize = function(x, y) {
		Window_Base.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
		this.opacity = 0;
		this.refresh();
	};

	Window_EnemyHUD.prototype.windowWidth = function() {
		return 150;
	};

	Window_EnemyHUD.prototype.windowHeight = function() {
		return 50;
	};

	Window_EnemyHUD.prototype.refresh = function() {
		this.contents.clear();
		
		if (!this.enemyGameEvent) return;
		
		this.x = this.enemyGameEvent.screenX() - $gameMap.tileWidth() - ($gameMap.tileWidth() / 2);
		this.y = this.enemyGameEvent.screenY() - ($gameMap.tileWidth() / 2);
		this.drawGauge(0, 0, 100, this.enemyGameEvent.hermes_life / 100, this.hpGaugeColor1(), this.hpGaugeColor2()); 
	};

	Window_EnemyHUD.prototype.open = function() {
		this.refresh();
		Window_Base.prototype.open.call(this);
	};

	Window_EnemyHUD.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
		var fillW = Math.floor(width * rate);
		this.contents.fillRect(x, 10, width, 20, this.gaugeBackColor());
		this.contents.gradientFillRect(x, 10, fillW, 20, color1, color2);
	};
	
})();