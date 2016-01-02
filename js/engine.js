/*
TODO:
LAYER Z-INDEX.
right now, if you click on overlapping windows, they both trigger. Fix this so that only the one on top triggers.
*/


var Engine = Engine||{};
Engine.Map = Engine.Map||{};
Engine.Interface = Engine.Interface||{};

Engine.Mouse = {x : 0, y : 0};

Engine.System = (function() {
	return {
		init : function() {
			var canvas = Engine.Graphics.getCanvas();
			canvas.addEventListener("mousedown", function(event) {
				//add other listener events here
				Engine.System.updateMouseCoords(event);
				Engine.Interface.WindowManager.doMouseDown();
				//console.log("Mouse: x: " + Engine.Mouse.x + " y: " + Engine.Mouse.y);
			});
			canvas.addEventListener("mousemove", function(event) {
				//add other listener events here
				Engine.System.updateMouseCoords(event);
				Engine.Interface.WindowManager.doMouseMove();
				
			});
			canvas.addEventListener("mouseup", function(event) {
				//add other listener events here
				Engine.System.updateMouseCoords(event);
				Engine.Interface.WindowManager.doMouseUp();
			});
		},
		
		updateMouseCoords : function(e_) {

			var canvas_rectangle = Engine.Graphics.getCanvas().getBoundingClientRect();
			//convert mouse screen position into canvas position:
			Engine.Mouse.x = Math.round(((e_.pageX - canvas_rectangle.left)/(canvas_rectangle.right - canvas_rectangle.left)) * Engine.Graphics.getCanvas().width);
			Engine.Mouse.y = Math.round(((e_.pageY - canvas_rectangle.top)/(canvas_rectangle.bottom - canvas_rectangle.top)) * Engine.Graphics.getCanvas().height);			
		}
	}
})();

Engine.Graphics = (function() {
	var _bgColor = "#f0f";
	var _canvas = null;
	var _canvasContext = null;
	var _drawScale = 1;
	var redrawFunction;
	
	return {
		attachCanvas : function(canvas_) { //accepts a getElementByID
			_canvas = canvas_;
			_canvasContext = canvas_.getContext("2d");
			Engine.System.init();
		},
		
		getCanvas : function() {
			return _canvas;
		},
		
		getCanvasContext : function() {
			return _canvasContext;
		},

		disableInterpolation : function () {
			_canvasContext.imageSmoothingEnabled = false;
			_canvasContext.webkitImageSmoothingEnabled = false;
			_canvasContext.mozImageSmoothingEnabled = false;
		},
		
		attachRedrawFunction : function(f_) {
			redrawFunction = f_;
		},
		
		redraw : function() { //gets called when a window moves, or a button is clicked, things of that nature.
			//perhaps clear() in here
			redrawFunction(); //whenever the engine needs to redraw the scene, this gets called.
		},
		
		setScale : function(s_) {
			_drawScale = s_;
		},
		
		getScale : function() {
			return _drawScale;
		},
		
		clear : function() {
			_canvasContext.clearRect(0, 0, _canvas.width, _canvas.height);
		},
		
		fill : function(color_) {
			_canvasContext.fillStyle = color_||"#0f0";
			_canvasContext.fillRect(0,0,_canvas.width,_canvas.height);
		},
		
		drawSprite : function(spriteSheetID_, spriteSheetIndex_, x_, y_) {
			var s = Engine.SpriteManager.getSpriteSheet(spriteSheetID_);
			var i = Engine.ResourceManager.getImage(s.resource);
			_canvasContext.drawImage(i, Math.round(s.sprites[spriteSheetIndex_].x), Math.round(s.sprites[spriteSheetIndex_].y), s.frameSize, s.frameSize, Math.round(x_*_drawScale), Math.round(y_*_drawScale), Math.round(s.frameSize*_drawScale) ,Math.round(s.frameSize*_drawScale));
		},
		
		drawMap : function(spriteSheet_) {
			var tileSize = Engine.SpriteManager.getSpriteSheet(spriteSheet_).frameSize;
			for(y = 0; y < Engine.Map.height; y++) {
				for(x = 0; x < Engine.Map.width; x++) {
					Engine.Graphics.drawSprite(spriteSheet_, Engine.Map.tiles[(y*Engine.Map.width) + x], tileSize*x, tileSize*y);
				}
			}		
		},
		
		drawWindow : function(w_) {
			var s = Engine.SpriteManager.getSpriteSheet(w_.spriteSheet);
			
			//draw inner
			for(y=0;y < (((w_.y + w_.height) - w_.y) - (s.frameSize * 2))/s.frameSize; y++) {
				for(x=0; x < (((w_.x + w_.width) - w_.x) - (s.frameSize * 2)) / s.frameSize; x++) {
					Engine.Graphics.drawSprite(w_.spriteSheet, 4, w_.x + s.frameSize + (x*s.frameSize), w_.y + s.frameSize + (y*s.frameSize));
				}
			}
			for(i=0; i < (((w_.x + w_.width) - w_.x) - (s.frameSize * 2)) / s.frameSize; i++) {
				Engine.Graphics.drawSprite(w_.spriteSheet, 1, w_.x + s.frameSize + (i*s.frameSize), w_.y);
				Engine.Graphics.drawSprite(w_.spriteSheet, 7, w_.x + s.frameSize + (i*s.frameSize), w_.y+w_.height-s.frameSize);
			}
			
			//draw left and right columns
			for(i=0; i < (((w_.y + w_.height) - w_.y) - (s.frameSize * 2))/s.frameSize; i++) {
				Engine.Graphics.drawSprite(w_.spriteSheet, 3, w_.x, w_.y  + s.frameSize + (i*s.frameSize));
				Engine.Graphics.drawSprite(w_.spriteSheet, 5, w_.x + w_.width-s.frameSize, w_.y  + s.frameSize + (i*s.frameSize));
			}
			//draw corners
			Engine.Graphics.drawSprite(w_.spriteSheet, 0, w_.x, w_.y);
			Engine.Graphics.drawSprite(w_.spriteSheet, 2, w_.x + w_.width - s.frameSize, w_.y);
			Engine.Graphics.drawSprite(w_.spriteSheet, 6, w_.x, w_.y + w_.height - s.frameSize);	
			Engine.Graphics.drawSprite(w_.spriteSheet, 8, w_.x + w_.width - s.frameSize, w_.y + w_.height - s.frameSize);

			//now draw interfaces within the window
		}
	}
})();

Engine.ResourceManager = (function() {
	var _images = {};
	var _imageIndexMarker = 0;
	
	var _sounds = {};
	var _soundIndexMarker = 0;
	return {
		loadImage : function(path_) { //returns index int
			_images[_imageIndexMarker] = new Image();
			_images[_imageIndexMarker].src = path_;
			_imageIndexMarker++;
			return _imageIndexMarker-1;
		},
		getImage : function(id_) {
			return _images[id_];
		}
	};
})();

Engine.SpriteManager = (function() {
	var _spriteSheets = {};//TODO rename to spritesheet
	var _indexMarker = 0;
	return {
		createSpriteSheet : function (resource_, frameSize_) {
			_spriteSheets[_indexMarker] = { resource : resource_, frameSize : frameSize_, sprites : new Array()};
			var img = Engine.ResourceManager.getImage(resource_);
			var iterator = 0;
			//calculate positions of each sprite in the spritesheet
			for(y = 0; y < img.height/frameSize_; y++){
				for(x = 0; x < img.width/frameSize_; x++){
					_spriteSheets[_indexMarker].sprites[iterator] = {x : (x*frameSize_), y : (y*frameSize_) };
					iterator++;
				}
			}
			_indexMarker++;
			return _indexMarker-1;
		},
		getSpriteSheet : function (id_) {
			return _spriteSheets[id_];
		}
	};
})();

//**** MAP ****

Engine.Map.fillMap = function(json_) {
	var jsonObject = JSON.parse(json_);
	Engine.Map.width = jsonObject.mapwidth;//# of tiles, not pixels
	Engine.Map.height = jsonObject.mapheight;//# of tiles, not pixels
	Engine.Map.tiles = jsonObject.tiles;
}

//**** INTERFACE *****
	
	//**** WINDOW MANAGER ****
Engine.Interface.WindowManager = (function() {
	//windows are created in the array, and are given a specific ID based on an iterating numbers.
	//when a window is destroyed, it is spliced from the array, which shifts the position of all other windows
	//however, windows are always selected from their baked in ID, not their index in the array.
	//this is because the array will be mashed around a lot, but each element needs a consistent identifier.
	var _windows = []; //z-sorted
	var _IDIterator = 0;
	//this two identifier system is an optimization technique:
	//the onMouseMove function will use the _draggedWindowIndex to move the mouse around without having to search
	//through the _windows array for the correctly ID'd item ever step.
	//however, it is possible that the _windows array will re-order in this time, and so the _draggedWindowIndex 
	//will point to the wrong window. To get around this, we ensure that _draggedWindowID matches _draggedWindowIndex
	//with a function that is called only called when the array is re-ordered.
	_draggedWindowID = -1;
	_draggedWindowIndex = -1;
	_draggedWindowOffsetX = 0;
	_draggedWindowOffsetY = 0;
	
	return {
		createWindow : function(x_, y_, w_, h_, spriteSheet_, contains_) { //accepts tile ints, not x, y
			var c = Engine.Graphics.getCanvas();
			var s = Engine.SpriteManager.getSpriteSheet(spriteSheet_);
			_windows[_IDIterator] = { x : x_, y : y_, width : w_, height : h_, id : _IDIterator, spriteSheet : spriteSheet_};
			_IDIterator++;
			return _IDIterator-1;
		},
		
		deleteWindow : function(id_) {
			_windows.splice(Engine.Interface.WindowManager.getIndexFromID(id_),1);
			if(_draggedWindowID === id_)  {//if we were dragging the deleted window
				_draggedWindowID = -1;
				_draggedWindowIndex = -1;
			}
			Engine.Graphics.redraw();
		},
		
		getIndexFromID : function(id_) {
			//very expensive. Do not call from inf loops
			for(i=0;i<_windows.length;i++) {
				if(parseInt(_windows[i].id) === parseInt(id_)) {
					return i;
				}
			}
			return -1;//err
		},
		
		getWindow : function(id_) {
			return _windows[Engine.Interface.WindowManager.getIndexFromID(id_)];
			//returns undefined if err
		},
		
		setMouseDownEvent : function(id_, function_) {
			_windows[Engine.Interface.WindowManager.getIndexFromID(id_)].mouseDownEvent = function_;
		},
		
		draw : function() {
			//call drawWindow in z-Index order.
			for(ii=0;ii<_windows.length;ii++){
				if(_windows[ii] !== undefined) {
					Engine.Graphics.drawWindow(_windows[ii]);
				}
			}
		},
		
		doMouseDown : function() {
			//check if any windows have been clicked
			var scale = Engine.Graphics.getScale();
			for(i=_windows.length;i>=0;i--){//traverse the list of windows backwards
				if(_windows[i] !== undefined) {
					if(_windows[i].mouseDownEvent !== undefined) {
						if(Engine.Mouse.x >= _windows[i].x*scale && Engine.Mouse.x <= _windows[i].x*scale + _windows[i].width*scale && Engine.Mouse.y >= _windows[i].y*scale && Engine.Mouse.y <= _windows[i].y*scale + _windows[i].height*scale) {
							var s = Engine.SpriteManager.getSpriteSheet(_windows[i].spriteSheet);
							if(Engine.Mouse.x >= _windows[i].x*scale && Engine.Mouse.y >= _windows[i].y*scale && Engine.Mouse.x <= (_windows[i].x + _windows[i].width)*scale && Engine.Mouse.y <= (_windows[i].y + s.frameSize)*scale) {
								_draggedWindowID = _windows[i].id;
								_draggedWindowIndex = i;
								_draggedWindowOffsetX = Engine.Mouse.x/scale - _windows[i].x;
								_draggedWindowOffsetY = Engine.Mouse.y/scale - _windows[i].y;
							}			
							_windows[i].mouseDownEvent(_windows[i].id);
							console.log("Touch!");
							return;
						}
					}
				}
			}
		},
		
		fixDragIndex : function() {
			//we call this every time the _windows array is re-ordered.
			//This is so we don't have to run getIndexFromID every single doMouseMove,
			//which can be incredibly expensive.
			if(_draggedWindowIndex !== -1 && _draggedWindowID !== -1) {
				if(_windows[_draggedWindowIndex].id !== _draggedWindowID) {
					//mismatch detected!
					_draggedWindowIndex = Engine.Interface.WindowManager.getIndexFromID(_draggedWindowID);
				}
			}
		},
		
		doMouseMove : function() {
			if(_draggedWindowIndex !== -1) {
				if(_windows[_draggedWindowIndex] !== undefined) {
					var scale = Engine.Graphics.getScale();
					_windows[_draggedWindowIndex].x = Engine.Mouse.x/scale - _draggedWindowOffsetX;
					_windows[_draggedWindowIndex].y = Engine.Mouse.y/scale - _draggedWindowOffsetY;
					Engine.Graphics.redraw();
				}
			}
		},
		
		doMouseUp : function() {
			_draggedWindowID = -1;
			_draggedWindowIndex = -1;
	
		},
		
		bringToFront : function(id_) {
			var index = Engine.Interface.WindowManager.getIndexFromID(id_);
			var temp = _windows[index];
			_windows.splice(index,1);
			_windows.push(temp);
			//since we re-ordered the _windows array, run this:
			Engine.Interface.WindowManager.fixDragIndex();
			Engine.Graphics.redraw();
		}
	};
})();
