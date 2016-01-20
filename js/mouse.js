var Lethargy = Lethargy||{};

Lethargy.Mouse = (function() {
	var mouse_x;
	var mouse_y;
	
	return {
		
		////////////////////////////////////////////////////////////////////
		//// CONSIDER MOVING THIS INIT STUFF INTO MOUSEEVENTMANAGER.JS. ////
		//// 			IT MAKES MORE SENSE FOR IT TO BE THERE.			////
		////////////////////////////////////////////////////////////////////
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
		
		updateMouseCoordinates : function(mouseEvent_) {
			var canvas_rectangle = Lethargy.Graphics.getCanvas().getBoundingClientRect();
			//convert mouse screen position into canvas position:
			mouse_x = Math.round(((mouseEvent_.clientX - canvas_rectangle.left)/(canvas_rectangle.right - canvas_rectangle.left)) * Lethargy.Graphics.getCanvas().width);
			mouse_y = Math.round(((mouseEvent_.clientY - canvas_rectangle.top)/(canvas_rectangle.bottom - canvas_rectangle.top)) * Lethargy.Graphics.getCanvas().height);			
						
		},

		getX : function() {
			return mouse_x;
		},
		
		getY : function() {
			return mouse_y;
		}
	}
})();