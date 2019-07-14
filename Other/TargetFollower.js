//-----------------------------------------------------------------------------
// Target Follower 0.1
// by Hermes Passer (hermespasser@gmail.com)
// hermespasser.github.io
//=============================================================================

/*:
 * @plugindesc A tile triggered path follower.
 * @author Hermes Passer
 * @help
 * Plugin commands
 *
 *   settarget <map position x> <map position y> <tileset R id>
 *     Defines a position on the map as a target for the 
 *     character to go when he steps on a tileset with the
 *     specified R tileset id
 *
 *   deletetarget <tileset R id>
 *     Removes a specified target by tileset R id
 *
 *   cleartargets <tileset R id>
 *     Remove all targets
 *
 * NOTE: the path system can bug trying to find a route if 
 * the path is too complex
 *
 * This plugin overrides the following methods:
 *   Game_Interpreter.prototype.pluginCommand 
 *   Game_Player.prototype.update
 *   Game_Player.prototype.getInputDirection
 *   TouchInput.update
 */

(function() {
	"use strict"
	
	class PathFollower {
		constructor() {
			this.currentTarget = null
			this.targets = {}
			this.targetFound = false
		}
		
		update() {
			const id = this.getPlayerTileRId()
			const target = this.targets[id]
		
			if (target != void(0) && !this.targetFound) {
				this.currentTarget = target
				this.targetFound = true
			} else if (this.isTargetReached && this.targetFound) {
				this.targetFound = false
				this.clearCurrentTarget()
			}
			
			this.walkToTarget()
		}
		
		add(x, y, id) {
			this.targets[id] = {x: x, y: y, id: id}
		}
		
		clearCurrentTarget() {
			this.clearTarget(this.currentTarget.id)
			this.currentTarget = null
			this.targetFound = false
		}
		
		clearTarget(id) {
			delete this.targets[id]
		}
		
		clearAll() {
			this.targets = {}
			this.currentTarget = null
			this.targetFound = false
		}
		
		getPlayerTileRId() {
			return $gameMap.tileId($gamePlayer.x, $gamePlayer.y, 5)
		}
		
		get isTargetReached() {
			if (this.currentTarget && this.currentTarget)
				return $gamePlayer.x == this.currentTarget.x && $gamePlayer.y == this.currentTarget.y
			return false
		}
		
		walkToTarget() {
			if (this.targetFound && this.currentTarget)
				$gameTemp.setDestination(this.currentTarget.x, this.currentTarget.y)
		}
	}
	
	const $follower =  new PathFollower();
		
	function setTarget(args) {
		const targetX = parseInt(args[0])
		const targetY = parseInt(args[1])
		const tileId = parseInt(args[2])
		$follower.add(targetX, targetY, tileId)	
	}
	
	function deleteTarget(args) {
		const tileId = parseInt(args[0])
		$follower.clearTarget(tileId)	
	}
	
	// Entry Point & override members
	
	const pluginCommand = Game_Interpreter.prototype.pluginCommand
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		pluginCommand.call(this, command, args);
		command = command.toLowerCase()
		
		switch(command) {
			case 'settarget': setTarget(args); break
			case 'tileId': deleteTarget(args); break
			case 'cleartargets': $follower.clearAll(); break
		}
    }
	
	const GamePlaye_GID = Game_Player.prototype.getInputDirection
	Game_Player.prototype.getInputDirection = function() {
		if (!$follower.targetFound) // disable the input using the arrow keys
			return GamePlaye_GID.call(this)
	}
	
	const TouchInput_Update = TouchInput.update
	TouchInput.update = function(sceneActive) {
		if (!$follower.targetFound) // disable the input using the touch/mouse
			TouchInput_Update.call(this)
	}
	
	const Game_Player_Update = Game_Player.prototype.update
	Game_Player.prototype.update = function(sceneActive) {
		$follower.update()
		Game_Player_Update.call(this, sceneActive)
	}
	
})();