var Lethargy = Lethargy||{};

Lethargy.Mouse = (function() {
	var mouse_x;
	var mouse_y;
	
	return {
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