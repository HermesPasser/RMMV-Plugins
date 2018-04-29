//=============================================================================
// AnimationState.js 0.1
// by Hermes Passer (hermespasser@gmail.com)
// hermespasser.github.io / gladiocitrico.blogspot.com
//=============================================================================

/*:
 * @plugindesc Run a animation on player corresponding to current player state (on map).
 * @author Hermes Passer 
 *
 * @help
 * Written to RMMV 1.3.3
 * In database/states select the state and add in the note:
 * [StateAnimation:AnimationIndex], e.g: [StateAnimation:02]
 */
 
/*:pt-BR
 * @plugindesc Executa uma animação no personagem correspondente ao estado atual do jogador (no mapa).
 * @author Hermes Passer 
 *
 * @help
 * Escrito para o RMMV 1.3.3
 * Em "banco de dados/estados" selecione o estado e adicione nas notas:
 * [StateAnimation:IndiceDaAnimação], exemplo: [StateAnimation:02]
 */

(function(){
	
	// --------- Scene_Map aliases
	
	var alias_sceneMap_uinitialize = Scene_Map.prototype.initialize;
	Scene_Map.prototype.initialize = function() {
		alias_sceneMap_uinitialize.call(this);
		this.animaionState = new AnimationState();
	};
	
	var alias_sceneMap_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function(){
		alias_sceneMap_update.call(this);
		this.animaionState.update();
	}

	// --------- AnimationState
	
	function AnimationState(){
		this.initialize.apply(this, arguments);
	};

	AnimationState.prototype.initialize = function(){
		this.framesToWait = 60;
		this.currentFrame = this.framesToWait;
	};
	
	AnimationState.prototype.update = function(){
		this.currentFrame++;
		if (this.currentFrame > this.framesToWait){
			this.updateStateAnimation();
			this.currentFrame = 0;
		}
	};
	
	AnimationState.prototype.updateStateAnimation = function(){
		var stateId = this.getFirstState();
		if (stateId === 0)
			return;
		
		var animationId = this.getAnimationByState(stateId);
		if (animationId === 0)
			return;
		
		$gamePlayer.requestAnimation(animationId);
		$gameTroop._interpreter.setWaitMode('animation');
	};
	
	AnimationState.prototype.getFirstState = function(){
		var actorsId = $gameParty._actors;
		
		for (var i = 0; i < actorsId.length; i++) {
			var charID = actorsId[i];
			var states = $gameActors.actor(charID).states();
			
			if (states.length < 1)
				continue;
			
			return states[0].id
		}
		return 0;
	};
	
	AnimationState.prototype.getAnimationByState = function(stateId){
		var note = this.getStateNoteById(stateId);
		if (note === "")
			return 0;
		
		// init: "[stateanimation:" id: "number" end: "]"
		var matchArray = note.match("(\\[StateAnimation:)(.*)(?=\\])");
		if (matchArray === null)
			return 0;
		
		note = matchArray[0];
		var animationId = parseInt(note.substring(note.indexOf(":") + 1));
		if (isNaN(animationId))
			return 0;
		
		return animationId;
	};
	
	AnimationState.prototype.getStateNoteById = function(stateId){
		for(var i = 0; i < $dataStates.length; i++) {
			if($dataStates[i] === null) 
				continue;
			
			if($dataStates[i].id === stateId)
				return $dataStates[i].note.trim();
		}
		return "";
	};
})();