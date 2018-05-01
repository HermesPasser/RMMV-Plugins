//=============================================================================
// Menu Cancel Option.js 0.2
// by Hermes Passer (hermespasser@gmail.com)
// hermespasser.github.io / gladiocitrico.blogspot.com
//=============================================================================

/*:
 * @plugindesc Add cancel option to menus and remove "double touch" to cancel menus.
 * @author Hermes Passer
 
 * @param Cancel Text
 * @desc Cancel option text.
 * @default Back
 
 * @help
 * Written to RMMV 1.3.3
 * The name of the file must be MenuCancelOption.js.
 * This plugin is made to work on devices with touch screen and can not work properly in desktop devices.
 */
 
/*:pt-BR
 * @plugindesc Adiciona a opção de cancelar nos menus e remove o "toque duplo" para cancelar menus.
 * @author Hermes Passer
 
 * @param Cancel Text
 * @desc Texto da opção de cancelar.
 * @default Back
 
 * @help
 * Escrito para o RMMV 1.3.3
 * O nome do arquivo deve ser MenuCancelOption.js
 * Esse plugin foi feito para funcionar em dispositivos com tela de toque e pode não funcionar corretamente em desktops.
 */

(function(){
	var parameters = PluginManager.parameters('MenuCancelOption');
	var	cancelText = String(parameters['Cancel Text'] || 'Back');
	var cancelCmd  = 'back';
	var	canCancel  = true;
	
	// ------- Cancel 'cancel touch' on menu
	
	var alias_InputIsCancelled = TouchInput.isCancelled;
	TouchInput.isCancelled = function() {
		 if (canCancel)
			return alias_InputIsCancelled.call(this);
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
	
	// ------- Menu
	
	
	function Window_StatusCancel(x, y, op) {
		this.initialize.apply(this, arguments);
	}

	Window_StatusCancel.prototype = Object.create(Window_HorzCommand.prototype);
	Window_StatusCancel.prototype.constructor = Window_StatusCancel;

	Window_StatusCancel.prototype.initialize = function() {
		Window_HorzCommand.prototype.initialize.call(this, arguments[0], arguments[1]);
		this.opacity = arguments[2];
		this.open();
	};
	
	Window_StatusCancel.prototype.maxCols = function() {
		return 1;
	};
	
	Window_StatusCancel.prototype.makeCommandList = function() {
		this.addCommand(cancelText, cancelCmd);
	}
	
	Window_StatusCancel.prototype.activate = function() {
		Window_HorzCommand.prototype.activate.call(this);
		this.visible = true;
	}
	
	Window_StatusCancel.prototype.deactivate = function() {
		Window_HorzCommand.prototype.deactivate.call(this);
		this.visible = false;
	}
	
	// ------- Menu
	
	var alias_MenuCommandMakeCommandList = Window_MenuCommand.prototype.makeCommandList;
	Window_MenuCommand.prototype.makeCommandList = function() {
		alias_MenuCommandMakeCommandList.call(this);
		this.addCommand(cancelText, cancelCmd, true);
	};
	
	var alias_MenuCreateCommandWindow = Scene_Menu.prototype.createCommandWindow;
	Scene_Menu.prototype.createCommandWindow = function() {
		alias_MenuCreateCommandWindow.call(this);
		this._commandWindow.setHandler(cancelCmd, this.popScene.bind(this));
		this.addWindow(this._commandWindow);
	};
	
	// ------- Item
	
	Window_ItemCategory.prototype.windowHeight = function() {
		return 100;
	};

	var alias_ItemCategoryMakeCommandList = Window_ItemCategory.prototype.makeCommandList;
	Window_ItemCategory.prototype.makeCommandList = function() {
		alias_ItemCategoryMakeCommandList.call(this);
		this.addCommand(cancelText, cancelCmd);
	};
	
	var alias_ItemCreateCategoryWindow = Scene_Item.prototype.createCategoryWindow;
	Scene_Item.prototype.createCategoryWindow = function() {
		alias_ItemCreateCategoryWindow.call(this);
		this._categoryWindow.setHandler(cancelCmd, this.popScene.bind(this));
		this.addWindow(this._categoryWindow);
	};
	
	// ------- Skill
	
	var alias_SkillTypeMakeCommandList = Window_SkillType.prototype.makeCommandList;
	Window_SkillType.prototype.makeCommandList = function() {
		alias_SkillTypeMakeCommandList.call(this);
		this.addCommand(cancelText, cancelCmd);
	};
	
	var alias_SkillCreateSkillTypeWindow = Scene_Skill.prototype.createSkillTypeWindow;
	Scene_Skill.prototype.createSkillTypeWindow = function() {
		alias_SkillCreateSkillTypeWindow.call(this);
		this._skillTypeWindow.setHandler(cancelCmd, this.popScene.bind(this));
		this.addWindow(this._skillTypeWindow);
	};
	
	// ------- Equip
	
	Window_EquipCommand.prototype.windowHeight = function() {
		return 100;
	};
	
	var alias_EquipCommandMakeCommandList = Window_EquipCommand.prototype.makeCommandList;
	Window_EquipCommand.prototype.makeCommandList = function() {
		alias_EquipCommandMakeCommandList.call(this);
		this.addCommand(cancelText, cancelCmd, true);
	};

	var alias_EquipCreateCommandWindow = Scene_Equip.prototype.createCommandWindow;
	Scene_Equip.prototype.createCommandWindow = function() {
		alias_EquipCreateCommandWindow.call(this);
		this._commandWindow.setHandler(cancelCmd, this.popScene.bind(this));
		this.addWindow(this._commandWindow);
	};
	
	// ------- Status

	var alias_StatusCreate = Scene_Status.prototype.create;
	Scene_Status.prototype.create = function() {
		alias_StatusCreate.call(this);		
		this.windowCancel = new Window_StatusCancel(Graphics.boxWidth - 244, 0, 0);
		this.windowCancel.setHandler(cancelCmd, this.popScene.bind(this));
		this.addChild(this.windowCancel);
	};
	
	// ------- Formation

	var alias_MenuCreate = Scene_Menu.prototype.create;
	Scene_Menu.prototype.create = function() {
		alias_MenuCreate.call(this);
		this.createWindowCancel();
	};
	
	Scene_Menu.prototype.createWindowCancel = function() {
		this.windowCancel = new Window_StatusCancel(0, 360, 255);
		this.windowCancel.setHandler(cancelCmd, this.onPersonalCancel.bind(this));
		this.windowCancel.deactivate();		
		this.addChild(this.windowCancel);
	}
	
	var alias_MenuCommandPersonal = Scene_Menu.prototype.commandPersonal;
	Scene_Menu.prototype.commandPersonal = function() {
		alias_MenuCommandPersonal.call(this);
		this.windowCancel.activate();
	};

	var alias_MenuCommandFormation = Scene_Menu.prototype.commandFormation;
	Scene_Menu.prototype.commandFormation = function() {
		alias_MenuCommandFormation.call(this);
		this.windowCancel.activate();
	};

	var alias_MenuOnPersonalCancel = Scene_Menu.prototype.onPersonalCancel;
	Scene_Menu.prototype.onPersonalCancel = function() {
		alias_MenuOnPersonalCancel.call(this);
		this.windowCancel.deactivate();
	};

	var alias_MenuOnFormationCancel = Scene_Menu.prototype.onFormationCancel;
	Scene_Menu.prototype.onFormationCancel = function() {
		alias_MenuOnFormationCancel.call(this);
		this.windowCancel.deactivate();
	};

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
		this.windowCancel = new Window_StatusCancel(Graphics.boxWidth - 244, 0, 0);
		this.windowCancel.setHandler(cancelCmd, this.popScene.bind(this));	
		this.addChild(this.windowCancel);
	}
	
	// ------- End Game Already Have
})();