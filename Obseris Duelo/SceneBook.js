//-----------------------------------------------------------------------------
// Scene Book 0.2
// by Hermes Passer (hermespasser@gmail.com)
// gladiocitrico.blogspot.com
//=============================================================================

/*:
 * @plugindesc A scene for read books.
 * @author Hermes Passer
 * 
 * @param background
 * @desc Baground image file name in pictures folder.
 * @default 
 * 
 * @param page text
 * @desc Page text.
 * @default page
 *
 * @help
 * Plugin Command: 
 *	Book <fileText>: Open scene
 *	<fileText>: A file (.txt) in Data/Book to be opened in the scene
 *	ex: Book myText
 *
 * In file Command: 
 *	%#<pictureName%: Open the picture with <pictureName>.
 *	ex: #picture1 (in first line)
 *	ex: %#picture1% (in other lines)
 *	%%: Break the page.
 *	ex: foo %%bar.
 *
 * The plugin name must be SceneBook.js
 */

(function() {
	//------ Game Interpreter
	
	var nameFile;
    var parameters = PluginManager.parameters('SceneBook');
	var background = String(parameters['background'] || ''); 
	var pageText   = String(parameters['page text'] || 'page'); 
    
	var gameInterpreter = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {		
		gameInterpreter.call(this, command, args);
		if (command === 'Book') {
			nameFile = args[0]
			SceneManager.push(Scene_Book);
        }
    };
	
	//------ Scene
	
	var bookImage; 
	
    function Scene_Book() {
        this.initialize.apply(this, arguments);
    }

    Scene_Book.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Book.prototype.constructor = Scene_Book;

    Scene_Book.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
    };
	
	Scene_Book.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
		this.pages = []; // Pages with the content of window
		this.index = 0;
		this.setText();
    };

	var sceneMenuBase_createBackground = Scene_MenuBase.prototype.createBackground;
	Scene_Book.prototype.createBackground = function() {
		if (background !== ""){
			this._backSprite1 = new Sprite(ImageManager.loadPicture(background));
			this.addChild(this._backSprite1);
			this.createWindows();
			return;
		}
		
		sceneMenuBase_createBackground.call(this);
		console.warn("Scene_Book: no background image found.");	
	};
	
	Scene_Book.prototype.setText = function() {
		var xhr = new XMLHttpRequest();
		xhr.open("GET","data/book/" + nameFile + ".txt", false);
		xhr.send();
		
		if (xhr.responseText === "" || xhr.responseText === null){
			console.warn("Scene_Book: no file text found.");
			this.cancel();
		}
		
		var p = xhr.responseText.split("%")
		for (var i = 0; i < p.length; i++) 
			if (p[i] != "") this.pages.push(p[i]);
	};
	
	Scene_Book.prototype.createWindows = function() {		
		bookImage = new Sprite();
		this.createWindowHelp();
		this.createWindowCommand();
		this.createWindowBook();
		this.updatePage();
	};
	
	// Help with page number
	Scene_Book.prototype.createWindowHelp = function() {
		this.window_help = new Window_Book(0, Graphics.boxHeight - 75, Graphics.width, 75);
		this.addChild(this.window_help);
	};
	
	// <, > and X buttons
	Scene_Book.prototype.createWindowCommand = function() {
		this.window_command = new Window_Cmd();
		this.window_command.setHandler('prev',   this.priviousPage.bind(this));
		this.window_command.setHandler('next',   this.nextPage.bind(this));
		this.window_command.setHandler('cancel', this.cancel.bind(this));
		this.addChild(this.window_command);		
	};
	
	// Main window with the text
	Scene_Book.prototype.createWindowBook = function() {
		this.window_book = new Window_Book(0, 0, Graphics.boxWidth, Graphics.boxHeight - 75);
		this.window_book.opacity = 0;
		this.addChild(this.window_book);
	};
	
	var sceneMenuBase_update = Scene_MenuBase.prototype.update;
	Scene_Book.prototype.update = function() {
		sceneMenuBase_update.call(this);
		if(Input.isTriggered('up')) this.nextPage();
        else if(Input.isTriggered('down')) this.priviousPage();
		else if (Input.isTriggered('cancel')) this.cancel();
	};
	
	Scene_Book.prototype.updatePage = function() {
		this.window_command.activate();
		this.window_help.contents.clear();
		this.window_book.contents.clear();
		
		if(bookImage.parent !== null)
			bookImage.parent.removeChild(bookImage);
		
		var str = this.pages[this.index];  
		if(str[0] === "#"){
			bookImage = new Sprite(ImageManager.loadPicture(str.substring(1, str.length)));
			this.window_book.addChild(bookImage);
		} else 
			this.window_book.drawTextEx("\\}" + str, 0, 0);
		
		this.window_help.drawText(pageText + ": " + (this.index + 1) + "/" + this.pages.length, 0, 0, Graphics.width, 'center');
	};
	
	Scene_Book.prototype.cancel = function() {
		SceneManager.push(Scene_Map);
	};
	
	Scene_Book.prototype.priviousPage = function() {		
		if(this.index - 1 >= 0) this.index--; 
		else SoundManager.playCancel;
		this.updatePage();
	};
	
	Scene_Book.prototype.nextPage = function() {
		if(this.index + 1 < this.pages.length) this.index++; 
		else SoundManager.playCancel;
		this.updatePage();		
	};
	
	//------ Window Command

	function Window_Cmd() {
		this.initialize.apply(this, arguments);
	}

	Window_Cmd.prototype = Object.create(Window_HorzCommand.prototype);
	Window_Cmd.prototype.constructor = Window_Cmd;

	Window_Cmd.prototype.initialize = function() {
		Window_HorzCommand.prototype.initialize.call(this, 0, 0);
		this.updatePlacement();
		this.openness = 0;
		this.opacity = 0;
		this.height = 75;
		this.open();
	};

	Window_Cmd.prototype.windowWidth = function() {
		return 200;
	};

	Window_Cmd.prototype.updatePlacement = function() {
		this.y = Graphics.boxHeight - 75;
		this.x = 0;
	};
	
	Window_Cmd.prototype.makeCommandList = function() {
		this.addCommand("<", 'prev');
		this.addCommand(">", 'next');
		this.addCommand("x", 'cancel');
	};
	
	//------ Window Book
	
    function Window_Book(x, y, w, h) {
        this.initialize.apply(this, arguments, x, y, w, h);
    }

    Window_Book.prototype = Object.create(Window_Selectable.prototype);
    Window_Book.prototype.constructor = Window_Book;

    Window_Book.prototype.initialize = function(x, y, w, h) {
        Window_Selectable.prototype.initialize.call(this, x, y, w, h);
    };
	
	Window_Book.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);

		if(bookImage.width != 0 && bookImage.height != 0){
			bookImage.x = (Graphics.width / 2) - (bookImage.width / 2);
			bookImage.y = (Graphics.height / 2) - (bookImage.height / 2);
		}
    };
})();