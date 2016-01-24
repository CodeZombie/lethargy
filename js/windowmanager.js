var Lethargy = Lethargy||{};

Lethargy.WindowManager = (function() {
	var windows = [];
	var IDIterator = 0;
	
	return {	
		createWindow : function(x_, y_, width_, height_, spriteSheet_) {
			if(spriteSheet_ === undefined || spriteSheet_.objectType !== "spritesheet") {
				Lethargy.System.printError("Attempting to create window with invalid spritesheet");
				return;
			}
			if(width_ <= 0 || height_ <= 0) {
				Lethargy.System.printError("Attempting to create window with invalid dimensions");
				return;
			}
			windows.push(new Lethargy.Window(IDIterator, x_, y_, width_, height_, spriteSheet_));
			IDIterator++;
			return IDIterator-1;
		},
		
		draw : function() {
			for(var i = 0; i < windows.length; i++) {
				if(windows[i] !== undefined) {
					windows[i].draw();
				}
			}
		},
		
		getWindow : function(id_) {
			for(var i = 0; i < windows.length; i++) {
				if(windows[i].id === id_) {
					return windows[i];
				}
			}
			return;
		}
	}
})();