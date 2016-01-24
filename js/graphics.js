var Lethargy = Lethargy||{};

Lethargy.Graphics = (function() {
	var canvas;
	var canvasContext;
	var backgroundColor = "#0f0";
	var scale = 1;
	
	return {
		attachCanvas : function(canvas_) {
			if(canvas_ === null || canvas_.tagName.toLowerCase() !== "canvas") {
				Lethargy.System.fatalError("Attempted to attach invalid canvas");
				return;
			}
			canvas = canvas_;
			canvasContext = canvas.getContext("2d");
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
			/////////////////////////
			// Does not work on IE //
			/////////////////////////
			canvasContext.mozImageSmoothingEnabled = false;			
		},
		
		clear : function() {
			canvasContext.clearRect(0, 0, canvas.width, canvas.height);
		},
		
		drawSquare : function(x_, y_, w_, h_, color_) {
			if(w_ <= 0 || h_ <= 0) {
				Lethargy.System.printError("Attempted to draw square with invalid dimensions");
				return;
			}
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