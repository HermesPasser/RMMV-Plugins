//-----------------------------------------------------------------------------
// Scene Book 0.1
// by Hermes Passer (hermespasser@gmail.com)
// gladiocitrico.blogspot.com
//=============================================================================

/*:
 * @plugindesc A scene for read books.
 * @author Hermes Passer
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
 *
 *	%%: Break the page.
 *	ex: foo %%bar.
 */

(function() {
	
	var nameFile;
	
	//------ Game Interpreter
	
    var parameters = PluginManager.parameters('Book');
	var background = "Book"; 			//String(parameters['background'] || 'none'); 
    var game_Interpreter = Game_Interpreter.prototype.pluginCommand;
    
	Game_Interpreter.prototype.pluginCommand = function(command, args) {		
		game_Interpreter.call(this, command, args);
		if (command === 'Book') {
			nameFile = args[0]
			SceneManager.push(Scene_Book);
        }
    };
	
	//------ Scene
	
	var scene_MenuBase_createBackground = Scene_MenuBase.prototype.createBackground;
	var window_book, window_help, window_command, book_image;
	var pages = [];		// Pages with the content of window
	var index = 0;		// Page index
	
    function Scene_Book() {
        this.initialize.apply(this, arguments);
    }

    Scene_Book.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Book.prototype.constructor = Scene_Book;

    Scene_Book.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
    };
	
	Scene_Book.prototype.createBackground = function() {
		if (background != ""){
			this._backSprite1 = new Sprite(ImageManager.loadPicture("Book"));
			this.setWindows();
		} else {
			scene_MenuBase_createBackground.call(this);
			console.log("Scene_Book: no background found.");
		}
	};
	
    Scene_Book.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
		this.setText();
    };
	
	Scene_Book.prototype.setText = function() {
		var xhr = new XMLHttpRequest();
		xhr.open("GET","data/book/" + nameFile + ".txt", false);
		xhr.send();
		
		if (xhr.responseText === "" || xhr.responseText === null){
			console.log("Scene_Book: no text found.");
			this.cancel();
		}
		
		var p = xhr.responseText.split("%")
		for (var i = 0; i < p.length; i++) 
			if (p[i] != "") pages.push(p[i]);
	}
	
	Scene_Book.prototype.setWindows = function() {		
		window_help = new Window_Book(0, Graphics.boxHeight - 60, Graphics.width, 75);
		window_command = new Window_Cmd();
		window_command.setHandler('prev',   this.priviousPage.bind(this));
		window_command.setHandler('next',   this.nextPage.bind(this));
		window_command.setHandler('cancel', this.cancel.bind(this));	
		window_book = new Window_Book(0, 0, Graphics.boxWidth, Graphics.boxHeight - 75);
		window_book.opacity = 0;
		book_image = new Sprite();

		this.addChild(this._backSprite1);
		this.addChild(window_help);
		this.addChild(window_command);
		this.addChild(window_book);
		this.updatePage();
	}
	
	var menuBase_update = Scene_MenuBase.prototype.update;
	Scene_Book.prototype.update = function() {
		menuBase_update.call(this);
		if(Input.isTriggered("up")) this.nextPage();
        else if(Input.isTriggered("down")) this.priviousPage();
		else if (Input.isTriggered("cancel")) this.cancel();
	}
	
	Scene_Book.prototype.updatePage = function() {
		window_command.activate();
		window_help.contents.clear();
		window_book.contents.clear();
		if(book_image.parent != null)
			book_image.parent.removeChild(book_image);
		
		var str = pages[index];  
		if(str[0] === "#"){
			book_image = new Sprite(ImageManager.loadPicture(str.substring(1, str.length)));
			window_book.addChild(book_image);
		} else  window_book.drawTextEx("\\}" + str, 0, 0);
		
		window_help.drawText("Página: " + (index + 1) + "/" + pages.length, 0, 0, Graphics.width, 'center');
	}
	
	Scene_Book.prototype.cancel = function() {
		SceneManager.push(Scene_Map);
	}
	
	Scene_Book.prototype.priviousPage = function() {		
		if(index - 1 >= 0) index--; 
		else SoundManager.playCancel;
		this.updatePage();
	}
	
	Scene_Book.prototype.nextPage = function() {
		if(index + 1 < pages.length) index++; 
		else SoundManager.playCancel;
		this.updatePage();		
	}
	
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
	}
	
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

		if(book_image.width != 0 && book_image.height != 0){
			book_image.x = (Graphics.width / 2) - (book_image.width / 2);
			book_image.y = (Graphics.height / 2) - (book_image.height / 2);
		}
    };
})();