//-----------------------------------------------------------------------------
// Put Some Random Tile 0.1
// by Hermes Passer (hermespasser@gmail.com)
// gladiocitrico.blogspot.com
//=============================================================================

/*:
 * @plugindesc Put a random tile in a random spot.
 * @author Hermes Passer
 
 * @help
 * This is quite useless, isn't?
 */

(function() {
	
	var tileId = 3;
	var xToBeChanged = -1;
	var yToBeChanged = -1;

	var __paintTiles = ShaderTilemap.prototype._paintTiles;
	ShaderTilemap.prototype._paintTiles = function(startX, startY, x, y){
		tileId		 = getRandom(10);
		xToBeChanged = getRandom($gameMap.width());
		yToBeChanged = getRandom($gameMap.height());
		
		__paintTiles.call(this, startX, startY, x, y);
	}
	
	Tilemap.prototype._readMapData = function(x, y, z) {
		if (this._mapData) {
			var width = this._mapWidth;
			var height = this._mapHeight;

			if (this.horizontalWrap) {
				x = x.mod(width);
			}
			if (this.verticalWrap) {
				y = y.mod(height);
			}
			if (x >= 0 && x < width && y >= 0 && y < height) {
				
				// This do the magic, baby...
				if (xToBeChanged >= 0 && xToBeChanged < width && yToBeChanged >= 0 && yToBeChanged < height)
					if (x == xToBeChanged && y == yToBeChanged)
						return tileId;
				
				return this._mapData[(z * height + y) * width + x] || 0;
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	};
	
	function getRandom(limit){
		return Math.floor(Math.random() * limit);
	}
})();