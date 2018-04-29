//-----------------------------------------------------------------------------
// Simple Time System 0.1
// by Hermes Passer (hermespasser@gmail.com)
// gladiocitrico.blogspot.com
//=============================================================================

/*:
 * @plugindesc A very simple time system. After 'n' times the time change of day to night and vice versa.
 * @author Hermes Passer 
  
 * @param Day Duration
 * @desc Time (in frames) to the time be changed.
 * @default 12000
 
 * @help
 * Add #day# or #night# in the map note to lock in a specify time.
 * The name of this plugin must be SimpleTimeSystem.js
 */

(function() {
	
	var parameters 		 = PluginManager.parameters('SimpleTimeSystem');
		isDay 		 	 = true,
		timeLocked		 = false,
		dayDuration  	 = parseInt(parameters['Day Duration'] || 12000);
		currentDuration  = 0,
		tintDuration 	 = 60,
		nightTint	 	 = [-68, -68, 0, 68];
		dayTint	 	 	 = [17, 0, 17, 0];
	
	// ================================================
	// Entry Point 
	// ================================================
	
	var sceneMap_start = Scene_Map.prototype.start;
	Scene_Map.prototype.start = function() {
		sceneMap_start.call(this);			
		onMapEnter();
	};
	
	var sceneMap_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		sceneMap_update.call(this); 
		 onMapStay();
	};

	function onMapEnter(){
		currentDuration = 0;
		isLocked();
	}

	function onMapStay(){
		if (timeLocked)
			return;
		
		currentDuration += 1;		
		if (currentDuration >= dayDuration){
			startTint(isDay ? nightTint : dayTint);
			currentDuration = 0;
			isDay = !isDay;
		}	
	}
	
	function isLocked(){
		var includeDay   = $dataMap.note.indexOf('#day#');
		var includeNight = $dataMap.note.indexOf('#night#');
		
		if (includeDay != -1 || includeNight != -1){
			timeLocked = true;
			
			if (includeDay != -1) 
				isDay = true;
			else if (includeNight != -1)
				isDay = false;
			
			startTint(isDay ? dayTint : nightTint);
		} else timeLocked = false;
	}
	
	function startTint(tint){
		$gameScreen.startTint(tint, tintDuration);
	}
})();