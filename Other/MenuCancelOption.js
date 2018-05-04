//=============================================================================
// Menu Button Cancel.js 0.3
// by Hermes Passer (hermespasser@gmail.com)
// hermespasser.github.io / gladiocitrico.blogspot.com
//=============================================================================

/*:
 * @plugindesc Add a cancel button to menus and remove "double touch" to cancel menus.
 * @author Hermes Passer
 
 * @param Image
 * @desc Image (75x75) name of button, if is none then will not use a image. The image must be in system folder and should not contains the extension.
 * @default none
 
 * @help
 * Written to RMMV 1.5
 * This plugin is made to work on devices with touch screen and not work in desktop devices.
 * The name of this file must be MenuButtonCancel.js
 */
 
/*:pt-BR
 * @plugindesc Adiciona um botão de cancelar nos menus e remove o "toque duplo" para cancelar menus.
 * @author Hermes Passer
 
 * @param Image
 * @desc Nome da imagem (75x75) para servir de botão,se permanecer none então ele não usará uma. Precisa estar na pasta system e não deve conter uma extensão.
 * @default none
 
 * @help
 * Escrito para o RMMV 1.5
 * Esse plugin foi feito para funcionar em dispositivos com tela de toque e  não funciona em desktops.
 * O nome desse arquivo precisa ser MenuButtonCancel.js
 */

(function(){
	var parameters = PluginManager.parameters('MenuButtonCancel');
	var	imageName  = String(parameters['Image'] || 'none');
	var	cancelText = "↵";
	var cancelCmd  = 'back';
	var	canCancel  = true;
	
	// ------- Cancel 'cancel touch' on menu
	
	var alias_SelectableProcessCancel = Window_Selectable.prototype.processCancel;
	Window_Selectable.prototype.processCancel = function() {
		if (canCancel)
			return alias_SelectableProcessCancel.call(this);
	};

	var alias_MenuStart = Scene_Menu.prototype.start;
	Scene_Menu.prototype.start = function() {
		alias_MenuStart.call(this);
		canCancel = false;
	};
	
	var alias_OptionsStart = Scene_Options.prototype.start;
	Scene_Options.prototype.start = function() {
		alias_OptionsStart.call(this);
		canCancel = false;
	};
	
	var alias_TitleStart = Scene_Title.prototype.start;
	Scene_Title.prototype.start = function() {
		alias_TitleStart.call(this);
		canCancel = true;
	};
	
	var alias_MapStart = Scene_Map.prototype.start;
	Scene_Map.prototype.start = function() {
		alias_MapStart.call(this);
		canCancel = true;
	};
	
	// ------- Window Cancel 
	
	function Window_Cancel() {
		this.initialize.apply(this, arguments);
	}

	Window_Cancel.prototype = Object.create(Window_HorzCommand.prototype);
	Window_Cancel.prototype.constructor = Window_Cancel;

	Window_Cancel.prototype.initialize = function() {
		Window_HorzCommand.prototype.initialize.call(this, Graphics.boxWidth - 100, Graphics.boxHeight - 100);
		this.z = 50;
		this.width  = 75;
		this.height = 75;
		this.createButton();
		this.open();
	};
	
	Window_Cancel.prototype.createButton = function(){
		if (imageName !== "none"){
			this.opacity = 0;
			this.buttonBmp = new Sprite(ImageManager.loadSystem(imageName));
			this.buttonBmp.opacity = 150;
			this.addChild(this.buttonBmp);
			return;
		}
		this.opacity = 100;
	};
	
	Window_Cancel.prototype.isCursorVisible = function() {
		return false;
	};
	
	Window_Cancel.prototype.itemTextAlign = function() {
		return 'left';
	};
	
	Window_Cancel.prototype.maxCols = function() {
		return 1;
	};

	Window_Cancel.prototype.makeCommandList = function() {
		this.addCommand(cancelText, cancelCmd);
	};
	
	Window_Cancel.prototype.activate = function() {
		Window_HorzCommand.prototype.activate.call(this);
		this.visible = true;
	};
	
	Window_Cancel.prototype.deactivate = function() {
		Window_HorzCommand.prototype.deactivate.call(this);
		this.visible = false;
	};
	
	Window_Cancel.prototype.update = function() {
		Window_HorzCommand.prototype.update.call(this);
		
	};
	
	Window_Cancel.prototype.drawIcon = function(iconIndex, x, y) {
		this._bitmap_ = new Sprite(ImageManager.loadSystem('back'));
		this.addChild(this._bitmap_);
	};

	// ------- Menu
	
	var alias_MenuCreate = Scene_Menu.prototype.create;
	Scene_Menu.prototype.create = function() {
		alias_MenuCreate.call(this);
		this.createWindowCancel();
	};
	
	Scene_Menu.prototype.createWindowCancel = function() {
		this.windowCancel = new Window_Cancel();
		this.OnCancelPop = true;
		this.windowCancel.setHandler(cancelCmd, this.popScene.bind(this));
		this.addChild(this.windowCancel);
	}

	// ------- Item
	
	var alias_ItemCreateCategoryWindow = Scene_Item.prototype.createCategoryWindow;
	Scene_Item.prototype.createCategoryWindow = function() {
		alias_ItemCreateCategoryWindow.call(this);
		this.createWindowCancel();
	};
	
	Scene_Item.prototype.createWindowCancel = function() {
		this.windowCancel = new Window_Cancel();
		this.windowCancel.setHandler(cancelCmd, this.popScene.bind(this));
		this.addChild(this.windowCancel);
	}
	
	// ------- Skill
	
	var alias_SkillCreate = Scene_Skill.prototype.create;
	Scene_Skill.prototype.create = function() {
		alias_SkillCreate.call(this);
		this.createWindowCancel();
	};
	
	Scene_Skill.prototype.createWindowCancel = function() {
		this.windowCancel = new Window_Cancel();
		this.windowCancel.setHandler(cancelCmd, this.popScene.bind(this));
		this.addChild(this.windowCancel);
	}
	// ------- Equip
	
	var alias_EquipCreate = Scene_Equip.prototype.create;
	Scene_Equip.prototype.create = function() {
		alias_EquipCreate.call(this);
		this.createWindowCancel();
	};
		
	Scene_Equip.prototype.createWindowCancel = function() {
		this.windowCancel = new Window_Cancel();
		this.windowCancel.setHandler(cancelCmd, this.popScene.bind(this));
		this.addChild(this.windowCancel);
	}
	
	// ------- Status

	var alias_StatusCreate = Scene_Status.prototype.create;
	Scene_Status.prototype.create = function() {
		alias_StatusCreate.call(this);
		this.createWindowCancel();
	};
	
	Scene_Status.prototype.createWindowCancel = function() {
		this.windowCancel = new Window_Cancel();
		this.windowCancel.setHandler(cancelCmd, this.popScene.bind(this));
		this.addChild(this.windowCancel);
	}

	// ------- Options
	
	var alias_OptionsMakeCommandList = Window_Options.prototype.makeCommandList;
	Window_Options.prototype.makeCommandList = function() {
		alias_OptionsMakeCommandList.call(this);
		this.addCommand(cancelText, cancelCmd);
	};
	
	Window_Options.prototype.statusText = function(index) {
		var symbol = this.commandSymbol(index);
		
		if (symbol === cancelCmd)
			return;
		
		var value = this.getConfigValue(symbol);
		if (this.isVolumeSymbol(symbol)) {
			return this.volumeStatusText(value);
		} else {
			return this.booleanStatusText(value);
		}
	};

	var alias_OptionsProcessOk = Window_Options.prototype.processOk;
	Window_Options.prototype.processOk = function() {
		if (this.commandSymbol(this.index()) === cancelCmd)
			SceneManager.pop();	
		alias_OptionsProcessOk.call(this);
	};

	// ------- Save
	
	var alias_SaveCreate = Scene_File.prototype.create;
	Scene_File.prototype.create = function() {
		alias_SaveCreate.call(this);
		this.createWindowCancel();
	};
	
	Scene_File.prototype.createWindowCancel = function() {
		this.windowCancel = new Window_Cancel();
		this.windowCancel.setHandler(cancelCmd, this.popScene.bind(this));
		this.addChild(this.windowCancel);
	}

	// ------- End Game Already Have
	
	// ------- Load
	
	var alias_LoadInitialize = Scene_Load.prototype.initialize;
	Scene_Load.prototype.initialize = function() {
		alias_LoadInitialize.call(this);
		this.createWindowCancel();
		canCancel = false;
	};

	Scene_Load.prototype.createWindowCancel = function() {
		this.windowCancel = new Window_Cancel();
		this.windowCancel.setHandler(cancelCmd, this.popScene.bind(this));
		this.addChild(this.windowCancel);
	}
})();