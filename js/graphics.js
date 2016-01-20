var Lethargy = Lethargy||{};

Lethargy.Graphics = (function() {
	var canvas;
	var canvasContext;
	var redrawFunction;
	var backgroundColor = "#0f0";
	var scale = 1;
	
	return {
		attachCanvas : function(canvas_) {
			canvas = canvas_;
			canvasContext = canvas.getContext("2d");
			//Lethargy.system.init(); init mouse event listeners for canvas.
		},
		
		getCanvas : function() {
			return canvas;
		},
		
		getCanvasContext : function() {
			return canvasContext;
		},
		
		getScale : function() {
			return scale;
		},
		
		setScale : function(s_) {
			scale = s_;
		},
		
		disableInterpolation : function() {
			canvasContext.imageSmoothingEnabled = false;
			canvasContext.webkitImageSmoothingEnabled = false;
			canvasContext.mozImageSmoothingEnabled = false;			
		},
		
		attachRedrawFunction : function(f_) {
			redrawFunction = f_;
		},
		
		redraw : function() {
			redrawFunction();
		},
		
		clear : function() {
			canvasContext.clearRect(0, 0, canvas.width, canvas.height);
		},
		
		drawSquare : function(x_, y_, w_, h_, color_) {
			canvasContext.beginPath();
			canvasContext.strokeStyle = color_;
			canvasContext.rect(x_*scale, y_*scale, w_*scale, h_*scale);
			canvasContext.stroke();
		},
		
		drawFilledSquare : function(x_, y_, w_, h_, color_) {
			canvasContext.fillStyle = color_;
			canvasContext.fillRect(x_*scale, y_*scale, w_*scale, h_*scale);
		}
	}
})();