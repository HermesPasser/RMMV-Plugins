//-----------------------------------------------------------------------------
// (Poor) Zombie System 0.1
// by Hermes Passer (hermespasser@gmail.com)
// gladiocitrico.blogspot.com
//
// Obs (pt-br): Na primeira tentativa tentei fazer o zumbi iniciar ao tocar no
// player (e consegui) e adicionar o evento de game over para que o jogador
// fosse morto quando tocasse, mas dos jeitos que tentei adicionar esse comando
// ao zumbi ele chamava de imediato fazendo o game over ocorrer ao iniciar.
//
// Então troquei a parte do sistema que adiciona o evento por uma checagem
// no update do gameMap que verifica a distancia do player para cada zumbi
// na cena. Ele não verifica se o zumbi está olhando para a direção do player.
//=============================================================================

/*:
 * @plugindesc Zombies follow the player and kill him.
 * @author Hermes Passer 
 * @help
 * Put a "zombie" in a event note to make that event in a zombie.
 */

(function() {
	var zombies = [];
	
	var __start = Scene_Map.prototype.start;
	Scene_Map.prototype.start = function() {
		__start.call(this);
		searchForZombies();
	};
	
	var __update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		__update.call(this);
		
		for (var i = 0; i < zombies.length; i++){			
			if ($gameMap.distance($gamePlayer._x, $gamePlayer._y, zombies[i]._x, zombies[i]._y) <= 1)
				SceneManager.goto(Scene_Gameover);
		}
	};
						
	function searchForZombies(){
		var data = $dataMap.events;
		// var gameOverCommand = {code: 353, indent: 0, parameters: []};

		for (var i = 0; i < data.length; i++){
			if (data[i] != null && data[i].note === "zombie"){

				var gameMapEvent = getGameMapEventById(data[i].id);
				gameMapEvent._moveType = 2; // Follow the player
				// gameMapEvent._trigger  = 3; // When the event touch the player
				
				// Add game over command to when the event trigger	// Does not work, the game over is called when the line is processed			
				// data[i].pages[gameMapEvent._pageIndex].list.unshift(gameOverCommand);
				
				zombies.push(gameMapEvent);
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
})();