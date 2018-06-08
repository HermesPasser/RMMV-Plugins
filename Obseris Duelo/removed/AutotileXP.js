//-----------------------------------------------------------------------------
// Autotile XP 0.2
// by Hermes Passer (hermespasser@gmail.com)
// gladiocitrico.blogspot.com
//=============================================================================

/*:
 * @plugindesc Emulate the behavior of Rpg maker xp's autotile.
 * @author Hermes Passer 
 
 * @param Terrain Tag
 * @desc Terrain tag to emulate the RM XP autotile.
 * @default 1
  
 * @param Terrain below Player
 * @desc Allow the autotile to be draw below the player. This feacture have bugs and do not work well.
 * @default false
 
 * @help
 * This plugin file name must be AutotileXP.js
 * Thanks to NineK for the moral support and Daniel M. Neto for the pt-br translation.
 */
 
/*:pt-BR
 * @plugindesc Emula a função de Autotile do RPG Maker XP.
 * @author Hermes Passer 
 *
 * @param Terrain Tag
 * @desc Tag de terreno que servirá para emular o Autotile do RMXP.
 * Padrão: 1
 * @default 1
  
 * @param Terrain below Player
 * @desc Permite que o autotile seja desenhado por cima do jogador. Essa opção tem bugs e não responde bem.
 * @default false
 
 * @help
 * Este arquivo do plugin deve estar nomeado como AutotileXP.js
 * Agradeço a NineK pelo ótimo suporte e ao Daniel M. Neto pela tradução para pt-br.
 */
 
(function() {
	var parameters = PluginManager.parameters('AutotileXP'),
		terrainTag = String(parameters['Terrain Tag'] || 1),
		rePaint	   = String(parameters['Terrain below Player'] || "false");

	var dir = null;
	
	// --- Behavior
	
	var alias_canPass = Game_CharacterBase.prototype.canPass;
	Game_CharacterBase.prototype.canPass = function(x, y, d) {
		var x2 = $gameMap.roundXWithDirection(x, d);
			y2 = $gameMap.roundYWithDirection(y, d),
			
			playerPositionTag = $gameMap.terrainTag($gamePlayer.x, $gamePlayer.y),
			nextPositionTag	  = $gameMap.terrainTag(x2,y2),
			directions 		  = { down: 2,  left: 4, right: 6, up: 8 };
		
		// If my position is a autotile so i can't go below
		if (playerPositionTag == terrainTag){ 
			switch(d){
				case directions.down: break;
				case directions.up: return this.isPassableBelow(x2, y2, d);
				default: return this.isTheFirstAutotileLine(x2, y2);
			}
		} 
		// If the future position is a autotile so i just can walk in x
		else if (nextPositionTag == terrainTag){
			switch(d){
				case directions.left:
				case directions.right:				
				case directions.down:
					if (this.isTheFirstAutotileLine(x2, y2))
						return true;
			}
		}
		
		return true//alias_canPass.call(this, x, y, d);
	};

	Game_CharacterBase.prototype.isPassableBelow = function(x, y, d){
		return this.isMapPassable(x, y, d) && !this.isCollidedWithCharacters(x, y);
	}
	
	/// Check if have a autotile above the position and return true if have.
	Game_CharacterBase.prototype.isTheFirstAutotileLine = function(x, y) {
		if (this.isThrough() || this.isDebugThrough())
			return true;
		
		// Because if the autotile in y is 0 must be not passable. 
		if ($gamePlayer.y == 0)
			return false;
		
		return $gameMap.terrainTag(x, y - 1) === terrainTag ? false : true;
	}
	
	// --- Appearance
	
	ShaderTilemap.prototype.autotileXP = function(x, y){
		var posX = $gameMap.canvasToMapX(x)  - 2
		var posY = $gameMap.canvasToMapY(y)  
		
		// if (dir){
			// directions = { down: 2,  left: 4, right: 6, up: 8 };

			// switch(dir){
				// case directions.down:
					// posY++;
					// break;
				// case directions.left:
					// break;
				// case directions.right:
					// break;
				// case directions.up:
					// posY--;
					// posX--;
			// }
		// }
		
		var tag	= $gameMap.terrainTag(posX, posY);
		
		// o problema é o scrolling, ele acaba pegando a tag do terreno ante de ser redesenhado?
		
		// if (tag == terrainTag && $gamePlayer.x == posX && $gamePlayer.y == posY)
			// return this.upperLayer.children[0]
		
		// not work with ===
		return (tag == terrainTag) ? this.upperLayer.children[0] : this.lowerLayer.children[0];
	}
	
	var alias__paintTiles = ShaderTilemap.prototype._paintTiles;
	ShaderTilemap.prototype._paintTiles = function(startX, startY, x, y) {		
		var mx = startX + x;
		var my = startY + y;
		var dx = x * this._tileWidth, dy = y * this._tileHeight;
		var tileId0 = this._readMapData(mx, my, 0);
		var tileId1 = this._readMapData(mx, my, 1);
		var tileId2 = this._readMapData(mx, my, 2);
		var tileId3 = this._readMapData(mx, my, 3);
		var shadowBits = this._readMapData(mx, my, 4);
		var upperTileId1 = this._readMapData(mx, my - 1, 1);
		var lowerLayer = this.lowerLayer.children[0];
		var upperLayer = this.upperLayer.children[0];
		
		if (this._isHigherTile(tileId0)) {
			this._drawTile(upperLayer, tileId0, dx, dy);
		} else {
			
			// Line changed
			if (rePaint === "true"){
				this._drawTile(this.autotileXP(dy, dy), tileId0,  dx, dy);
			} else {
				this._drawTile(lowerLayer, tileId0,  dx, dy);
			}
			
		}
		if (this._isHigherTile(tileId1)) {
			this._drawTile(upperLayer, tileId1, dx, dy);
		} else {
			this._drawTile(lowerLayer, tileId0, dx, dx);
		}

		this._drawShadow(lowerLayer, shadowBits, dx, dy);
		if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
			if (!Tilemap.isShadowingTile(tileId0)) {
				this._drawTableEdge(lowerLayer, upperTileId1, dx, dy);
			}
		}

		if (this._isOverpassPosition(mx, my)) {
			this._drawTile(upperLayer, tileId2, dx, dy);
			this._drawTile(upperLayer, tileId3, dx, dy);
		} else {
			if (this._isHigherTile(tileId2)) {
				this._drawTile(upperLayer, tileId2, dx, dy);
			} else {
				this._drawTile(lowerLayer, tileId2, dx, dy);
			}
			if (this._isHigherTile(tileId3)) {
				this._drawTile(upperLayer, tileId3, dx, dy);
			} else {
				this._drawTile(lowerLayer, tileId3, dx, dy);
			}
		}
	}
	
})();