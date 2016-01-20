var Lethargy = Lethargy||{};

Lethargy.WindowManager = (function() {
	var windows = [];
	var IDIterator = 0;
	return {
		createWindow : function(x_, y_, width_, height_, spriteSheet_) {
			if(spriteSheet_ === undefined) {
				console.log("Attempting to create window with undefined spriteSheet");
				return -1;
			}
			
			windows.push(new Lethargy.Window(IDIterator, x_, y_, width_, height_, spriteSheet_));
			IDIterator++;
			console.log("window created with id: " + (IDIterator-1));
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
		}
	}
})();