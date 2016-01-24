var Lethargy = Lethargy||{};

Lethargy.MouseEventTypes = Object.freeze({
	mousedown : 1,
	mouseup : 2,
	mousedownthenup : 3,
	mousemove : 4
});


Lethargy.MouseEventManager = (function() {
	var mouseEvents = []; //2d array
	for(var i = 0; i < 5; i++) {
		mouseEvents[i] = [];
	}
	
	return {
		
		initialize : function() {
			var canvas = Lethargy.Graphics.getCanvas();
			canvas.addEventListener("mousemove", function(event) {
				Lethargy.Mouse.updateMouseCoordinates(event);
				if(event.button === 0) { //2 for right click, 1 for middle. NOTE: DIFF ON IE 8.
					Lethargy.MouseEventManager.checkMouseEvents(Lethargy.MouseEventTypes.mousemove);
				}
			});
			
			canvas.addEventListener("mousedown", function(event) {
				Lethargy.Mouse.updateMouseCoordinates(event);
				if(event.button === 0) {
					Lethargy.MouseEventManager.checkMouseEvents(Lethargy.MouseEventTypes.mousedown);
				}
			});
			
			canvas.addEventListener("mouseup", function(event) {
				Lethargy.Mouse.updateMouseCoordinates(event);
				if(event.button === 0) {
					Lethargy.MouseEventManager.checkMouseEvents(Lethargy.MouseEventTypes.mouseup);
				}
			});
		},
		
		createMouseEvent : function(type_, parent_, offset_x_, offset_y_, width_, height_, event_) {
			if(parent_ === undefined) {
				console.log("Attempting to create mouse event on invalid object");
				return;
			}
			if(parent_.objectType !== "window" && parent_.objectType !== "entity") {
				console.log("Attempting to create mouse event on object of type '" + parent_.objectType + "'");
				return;					
			}
			if( (width_ <= 0 && width_ !== -1)  || (height_ <= 0 && height_ !== -1)) {
				console.log("Attempting to create mouse event with invalid dimensions");
				return;						
			}
			
			mouseEvents[type_].push(new Lethargy.MouseEvent(type_, parent_, offset_x_, offset_y_, width_, height_, event_));
		},
		
		checkMouseEvents : function(type_) {
			for(var i = 0; i < mouseEvents[type_].length; i++) {
				mouseEvents[type_][i].check();
			}
		}
	}
})();
