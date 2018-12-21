//=============================================================================
// CookSystem.js
// by Hermes Passer
// hermespasser.github.io / hermespasser@gmail.com
//=============================================================================

/*:
 * @plugindesc Cook system.
 * @author Hermes Passer
 *
 * @help
 *    Plugin Commands:
 * cook book itemId - to open the recipe in the cookbook
 *
 * cook itemId - to try cook the recipe, nothing will happen if
 * no sufficient ingredients are in inventory.
 *
 *    Instructions:
 * Add the follow template in the "note" of the item you want
 * to be the crafted with.
 *
 *[  
 *   { "id": 01, "qnt": 1 , "txt": "%qnt tablespoons of %item"},
 *   { "id": 02, "qnt": 99, "name": "sugar" }
 *]
 *
 * - Id is the item id that will be the ingredient, 
 *
 * - Qnt is the quantity required, you can add as 
 * much ingredients as you want.
 *
 * - Txt is the text that will be add in the recipe, %qnt will be
 * replaced by the quantity and %item by the item name. Is optional.
 *
 * - Name is the name that will be shown in the recipe, if not given, 
 * the name of the item on database will be used instead. Is optional.
 *
 * DO NOT add nothing more in notes.
 */

(function() {
	'use strict';

	// ================================================
	// Entry Point 
	// ================================================
	
	var currentRecipe = null;
	var recipes = [];
	
	var pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {		
		pluginCommand.call(this, command, args);
		if (command.toLowerCase() !== 'cook')
			return;
		
		if (args.length < 1)
			throw new Error('CookSystem: Argument not given, try "cook book itemId" to open the cookboock or "cook itemId" to try cook the recipe.');
		
		switch (args[0].toLowerCase()){
			// Open cook book
			case 'book':
				if (args.length < 2)
					throw new Error('CookSystem: Recipe id not given.');		
				
				currentRecipe = Recipe.getRecipe(parseInt(args[1]));
				SceneManager.push(Scene_Cook);
				break;

			// Cook something
			default: 
				currentRecipe = Recipe.getRecipe(parseInt(args[0]));
				currentRecipe.cook();
		} 
    };
	
	var sceneMap_create = Scene_Map.prototype.create;
	Scene_Map.prototype.create = function() {
		sceneMap_create.call(this);
		generateRecipes();
	};
	
	// - Utils Functions
	
	function ParseJSON(json) {
		try{			
			return JSON.parse(json);
		} catch(e) {
			return null;
		}
	}
	
	function getItemName(id) {
		let item = $dataItems[id];
		if (item === void(0))
			throw new Error('CookSystem: Index %1 is out of itens range.'.format(id));
		return item.name;
	}
	
	function generateRecipes() {
		recipes = [];
		for (let i in $dataItems) {
			let item = $dataItems[i];
			if (item === null)
				continue;
			
			let data = ParseJSON(item.note);
			if (data === null)
				continue;
			
			let ingredients = [];	
			for (let j in data) {
				let recipe = data[j];	
				let ingredient_name = recipe.name || getItemName(recipe.id);
				let ingredient_txt = recipe.txt || "%qnt of %item";
				
				ingredients.push(new Ingredient(recipe.id, recipe.qnt, ingredient_name, ingredient_txt));
			}
			
			let recipe_obj = new Recipe(item.id, ingredients);
			recipes.push(recipe_obj);
		}
	}
	
	// - Class Ingredient
	
	function Ingredient(id, qnt, name, txt) {
		this.id = id;
		this.qnt = qnt;
		this.name = name;
		this.txt = txt;
	}
	
	// - Class Recipe
	
	function Recipe(id, ingredients) {
		this.id = id;
		this.ingredients = ingredients;
	}

	Recipe.getRecipe = function(id){
		for (let i in recipes) {
			if (recipes[i].id === id)
				return recipes[i];
		}
		throw new Error('CookSystem: The id %1 is not a recipe, verify if the text in database/note is correct.'.format(id));
	}
	
	Recipe.prototype.canCook = function() {
		let ingredients = this.ingredients;

		for (let i in ingredients) {
			const ingredient = ingredients[i];
			let item = $dataItems[ingredient.id];

			if ($gameParty.numItems(item) < ingredient.qnt)
				return false;
		}
		return true;	
	};
	
	Recipe.prototype.cook = function() {
		if (!this.canCook())
			return;
		
		const recipeItem = $dataItems[this.id];
		let ingredients = this.ingredients;

		for (let i in ingredients) {
			const ingredient = ingredients[i];
			const item = $dataItems[ingredient.id];

			$gameParty.gainItem(item, -ingredient.qnt);
		}
		$gameParty.gainItem(recipeItem, 1);
	};
	
	Recipe.prototype.toString = function() {
		let ingredients = this.ingredients;
		let text = '';
		for (let i in ingredients) {
			let instruction = ingredients[i].txt;
			text += instruction.replace('%qnt', ingredients[i].qnt).replace('%item', ingredients[i].name);
			
			if (i < ingredients.length - 1)
				text += '\n';
		}		
		return text;
	};

	// - Class Scene_Cook
	
    function Scene_Cook() {
        this.initialize.apply(this, arguments);
    }

    Scene_Cook.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Cook.prototype.constructor = Scene_Cook;

    Scene_Cook.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
		this.createWindows();
    };
	
	Scene_Cook.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };
	
	Scene_Cook.prototype.createWindows = function() {		
		this.createWindowHelp();
		this.createCommand();
	};
	
	Scene_Cook.prototype.createCommand = function() {		
		this.window_command = new Window_Command(-100,-100);
		this.window_command.setHandler('cancel', this.cancel.bind(this));
		this.window_command.addCommand('', 'cancel', true);
		this.addChild(this.window_command);
	};
	
	Scene_Cook.prototype.createWindowHelp = function() {
		this.window_help = new Window_Recipe(currentRecipe);
		this.addChild(this.window_help);
	};
		
	Scene_Cook.prototype.cancel = function() {
		SceneManager.pop();
	};
	
	// - Class Window_Recipe
	
	function Window_Recipe() {
		this.initialize.apply(this, arguments);
	}

	Window_Recipe.prototype = Object.create(Window_Base.prototype);
	Window_Recipe.prototype.constructor = Window_Recipe;

	Window_Recipe.prototype.initialize = function(recipe) {
		Window_Base.prototype.initialize.call(this, Graphics.width / 2 - 200, Graphics.height / 2 - 200);
		this.width = 400;
		this.height = 400;
		this._recipe = recipe;
	};
	
	Window_Recipe.prototype.update = function() {
		Window_Base.prototype.update.call(this);
		this.contents.clear();
		
		let text = this._recipe.toString().split('\n');
		let recipeName = $dataItems[this._recipe.id].name;
		let y = 30;
		
		this.drawTextEx('\\c[2]' + recipeName, 0, 0);
		for (let i in text){
			this.drawTextEx(text[i], 15, y);
			y += 30;
		}
	};
})();
