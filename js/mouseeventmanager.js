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
		createMouseEvent : function(type_, parent_, offset_x_, offset_y_, width_, height_, event_) {
			mouseEvents[type_].push(new Lethargy.MouseEvent(type_, parent_, offset_x_, offset_y_, width_, height_, event_));
		},
		
		checkMouseEvents : function(type_) {
			for(var i = 0; i < mouseEvents[type_].length; i++) {
				mouseEvents[type_][i].check();
			}
		}
	}
})();
