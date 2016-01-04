/*
todo:
setup a draw-queue so that sub-window level primitives and images are always drawn below windows.
(eg: borders drawn around entities on their hover events can overlap windows. This is bad.

take a look at the current mouse system. It can probably be optimized. maybe try some quad-treeing or re-organize the onMouseMove loop.

add the hover returns to entities too.

add the MouseHoverOff event to the window system

test deleting windows and deleting entities. Im not 100% confident the systems work under weird circumstances. (maybe they do though)
*/

var Lethargy = Lethargy||{};
Lethargy.Interface = Lethargy.Interface||{};
Lethargy.Mouse = {x : 0, y : 0};

Lethargy.System = (function() {
	return {
		init : function() {
			var canvas = Lethargy.Graphics.getCanvas();
			canvas.addEventListener("mousedown", function(event) {
				//add other listener events here
				Lethargy.System.updateMouseCoords(event);
				
				//we check clicks in order of z-index.
				//windows appear on top, so they are checked first. If no window is clicked, then we check entities, etc.
				//this is so that you cannot click through windows.
				
				if(Lethargy.Interface.WindowManager.doMouseDown() == 0) { // if no window is clicked...
					Lethargy.EntityManager.doMouseDown();
				}
				//console.log("Mouse: x: " + Lethargy.Mouse.x + " y: " + Lethargy.Mouse.y);
			});
			canvas.addEventListener("mousemove", function(event) {
				//add other listener events here
				Lethargy.System.updateMouseCoords(event);
				
				if(Lethargy.Interface.WindowManager.doMouseHover() == 0) {
					Lethargy.EntityManager.doMouseHover();
				}
				
			});
			canvas.addEventListener("mouseup", function(event) {
				//add other listener events here
				Lethargy.System.updateMouseCoords(event);
				Lethargy.Interface.WindowManager.doMouseUp();
			});
		},
		
		updateMouseCoords : function(e_) {
			var canvas_rectangle = Lethargy.Graphics.getCanvas().getBoundingClientRect();
			//convert mouse screen position into canvas position:
			Lethargy.Mouse.x = Math.round(((e_.pageX - canvas_rectangle.left)/(canvas_rectangle.right - canvas_rectangle.left)) * Lethargy.Graphics.getCanvas().width);
			Lethargy.Mouse.y = Math.round(((e_.pageY - canvas_rectangle.top)/(canvas_rectangle.bottom - canvas_rectangle.top)) * Lethargy.Graphics.getCanvas().height);			
		},
		
		logError : function(msg_) {
			console.log("ERROR: " + msg_);
		}
	}
})();

Lethargy.Graphics = (function() {
	var _bgColor = "#f0f";
	var _canvas = null;
	var _canvasContext = null;
	var _drawScale = 1;
	var redrawFunction;
	
	return {
		attachCanvas : function(canvas_) { //accepts a getElementByID
			_canvas = canvas_;
			_canvasContext = canvas_.getContext("2d");
			Lethargy.System.init();
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
		
		getScale : function() {
			return _drawScale
		},
		
		setScale : function(scale_) {
			_drawScale = scale_;
		},
		
		clear : function() {
			_canvasContext.clearRect(0, 0, _canvas.width, _canvas.height);
		},
		
		fill : function(color_) {
			_canvasContext.fillStyle = color_||"#0f0";
			_canvasContext.fillRect(0,0,_canvas.width,_canvas.height);
		},
		
		drawSquare : function(x_, y_, w_, h_, color_) {
			_canvasContext.beginPath();
			_canvasContext.strokeStyle = color_;
			_canvasContext.rect(x_*_drawScale, y_*_drawScale, w_*_drawScale, h_*_drawScale);
			_canvasContext.stroke();
			
		},
		
		drawSprite : function(spriteSheetID_, spriteIndex_, x_, y_) {
			var s = Lethargy.SpriteManager.getSpriteSheet(spriteSheetID_);
			
			if(s !== undefined) {
				var i = Lethargy.ResourceManager.getImage(s.resource);
			}
			
			if( i === undefined || s === undefined) {
				_canvasContext.beginPath();
				_canvasContext.fillStyle = "#f0f";
				_canvasContext.fillRect(Math.round(x_*_drawScale),Math.round(y_*_drawScale),Math.round(32*_drawScale),Math.round(32*_drawScale));
				_canvasContext.stroke();
				Lethargy.System.logError("Failed to draw sprite! (spriteSheet : " + spriteSheetID_ + ", spriteIndex : " + spriteIndex_ + ")");
				return -1;
			}
			
			_canvasContext.drawImage(i, Math.round(s.sprites[spriteIndex_].x), Math.round(s.sprites[spriteIndex_].y), s.frameSize, s.frameSize, Math.round(x_*_drawScale), Math.round(y_*_drawScale), Math.round(s.frameSize*_drawScale) ,Math.round(s.frameSize*_drawScale));
			return 0;//ok
		},
		
		drawMap : function(spriteSheet_) {
			var tileSize = Lethargy.SpriteManager.getSpriteSheet(spriteSheet_).frameSize;
			for(var y = 0; y < Lethargy.Map.getHeight(); y++) {
				for(var x = 0; x < Lethargy.Map.getWidth(); x++) {
					Lethargy.Graphics.drawSprite(spriteSheet_, Lethargy.Map.getTiles()[(y*Lethargy.Map.getWidth()) + x], tileSize*x, tileSize*y);
				}
			}		
		},
		
		drawWindow : function(w_) {
			var s = Lethargy.SpriteManager.getSpriteSheet(w_.spriteSheet);
			
			//draw inner
			for(var y=0;y < (((w_.y + w_.height) - w_.y) - (s.frameSize * 2))/s.frameSize; y++) {
				for(var x=0; x < (((w_.x + w_.width) - w_.x) - (s.frameSize * 2)) / s.frameSize; x++) {
					Lethargy.Graphics.drawSprite(w_.spriteSheet, 4, w_.x + s.frameSize + (x*s.frameSize), w_.y + s.frameSize + (y*s.frameSize));
				}
			}
			for(var i=0; i < (((w_.x + w_.width) - w_.x) - (s.frameSize * 2)) / s.frameSize; i++) {
				Lethargy.Graphics.drawSprite(w_.spriteSheet, 1, w_.x + s.frameSize + (i*s.frameSize), w_.y);
				Lethargy.Graphics.drawSprite(w_.spriteSheet, 7, w_.x + s.frameSize + (i*s.frameSize), w_.y+w_.height-s.frameSize);
			}
			
			//draw left and right columns
			for(var i=0; i < (((w_.y + w_.height) - w_.y) - (s.frameSize * 2))/s.frameSize; i++) {
				Lethargy.Graphics.drawSprite(w_.spriteSheet, 3, w_.x, w_.y  + s.frameSize + (i*s.frameSize));
				Lethargy.Graphics.drawSprite(w_.spriteSheet, 5, w_.x + w_.width-s.frameSize, w_.y  + s.frameSize + (i*s.frameSize));
			}
			//draw corners
			Lethargy.Graphics.drawSprite(w_.spriteSheet, 0, w_.x, w_.y);
			Lethargy.Graphics.drawSprite(w_.spriteSheet, 2, w_.x + w_.width - s.frameSize, w_.y);
			Lethargy.Graphics.drawSprite(w_.spriteSheet, 6, w_.x, w_.y + w_.height - s.frameSize);	
			Lethargy.Graphics.drawSprite(w_.spriteSheet, 8, w_.x + w_.width - s.frameSize, w_.y + w_.height - s.frameSize);

			//now draw interfaces within the window
		}
	}
})();

Lethargy.ResourceManager = (function() {
	var _images = [];
	var _imageIndexMarker = 0;
	
	var _sounds = [];
	var _soundIndexMarker = 0;
	return {
		loadImage : function(path_, callback_) { //callback returns an id if succesful, or undefined if not.
			console.log("Trying to load image... " + path_);
			var img = new Image();
			
			img.onerror = function(){
				Lethargy.System.logError("Failed to load image: " + path_);
				callback_(undefined);
			};
			
			img.onload = function() {
				console.log("Succesfully loaded image: " + path_);
				_images[_imageIndexMarker] = img;
				_imageIndexMarker++;
				callback_(_imageIndexMarker-1);
			}
			
			img.src = path_;
		},
		getImage : function(id_) {
			return _images[id_];
		},
		images : _images
	};
})();

Lethargy.SpriteManager = (function() {
	var _spriteSheets = {};//TODO rename to spritesheet
	var _indexMarker = 0;
	return {
		createSpriteSheet : function (resource_, frameSize_) {
			var img = Lethargy.ResourceManager.getImage(resource_);
			if(img === undefined) {
				Lethargy.System.logError("Failed to create SpriteSheet: Image undefined");
				return undefined;
			}
			_spriteSheets[_indexMarker] = { resource : resource_, frameSize : frameSize_, sprites : new Array()};
			
			var iterator = 0;
			//calculate positions of each sprite in the spritesheet
			for(var y = 0; y < img.height/frameSize_; y++){
				for(var x = 0; x < img.width/frameSize_; x++){
					_spriteSheets[_indexMarker].sprites[iterator] = {x : (x*frameSize_), y : (y*frameSize_) };
					iterator++;
				}
			}
			_indexMarker++;
			return _indexMarker-1;
		},
		getSpriteSheet : function (id_) {
			if(_spriteSheets[id_] === undefined) {
				Lethargy.System.logError("Could not find spriteSheet (" + id_ + ")");
			}
			return _spriteSheets[id_];
		}
	};
})();

Lethargy.EntityManager = (function() {
	//Entity layout:
	//x, y, spriteSheet, spriteIndex, id, onClick, onHover, zInndex
	_entities = [];
	_IDIterator = 0;
	_currentHoverID = -1;
	return {
		createEntity : function(x_, y_, spriteSheet_, spriteIndex_, zIndex_) {
			//insert entity into array next to z-indexes of the same value.
			//start at the left of the array, and search right until we find an entity with a higher zIndex
			//insert right at that spot. (for example, if we want to insert 3 into "01125", it'll go between 2 and 5)
			//this also inserts entities at the END of like z-indexes (so if we're inserting a 3 into "013335", it'll go between the 3 and 5)
			//this is so that entities created latest are drawn on top, as you would intuitively expect.
			//0 = lowest. 99999+ = highest
			var index = 0;
			for(var i=0;i<_entities.length;i++) {
				if(_entities[i] !== undefined) {
					if(zIndex_ < _entities[i].zIndex) {
						index = i;
						break;
					}
				}
			}
			
			_entities.splice(i,0,{x : x_, y : y_, spriteSheet : spriteSheet_, spriteIndex : spriteIndex_, id : _IDIterator, zIndex : zIndex_});
			_IDIterator++;
			return _IDIterator-1;
		},
		
		getEntity : function(id_) {
			var index = Lethargy.EntityManager.getEntityIndex(id_);
			if(index !== -1 && _entities[index] !== undefined) {
				return _entities[index];
			}
			return undefined;
		},
		
		getEntityIndex : function(id_) {
			for(var i=0;i<_entities.length;i++) {
				if(_entities[i] !== undefined) {
					if(_entities[i].id == id_) {
						return i;
					}
				}
			}
			return -1;
		},
		
		removeEntity : function(id_) {
			//splice out the entity. done.
		},

		setMouseDownEvent : function(id_, function_) {
			var e = _entities[Lethargy.EntityManager.getEntityIndex(id_)];
			if(e !== undefined) {
				e.mouseDownEvent = function_;
			}
		},
		
		doMouseDown : function() {
			var scale = Lethargy.Graphics.getScale();
			
			for(var i=_entities.length;i>=0;i--){//traverse the list backwards
				if(_entities[i] !== undefined) {
					if(_entities[i].mouseDownEvent !== undefined) {
						var s = Lethargy.SpriteManager.getSpriteSheet(_entities[i].spriteSheet);
						if(Lethargy.Mouse.x >= _entities[i].x*scale && Lethargy.Mouse.x <= _entities[i].x*scale + s.frameSize*scale && Lethargy.Mouse.y >= _entities[i].y*scale && Lethargy.Mouse.y <= _entities[i].y*scale + s.frameSize*scale) {	
							_entities[i].mouseDownEvent(_entities[i].id);
							break;
						}
					}
				}
			}		
		},
		
		setMouseHoverEvent : function(id_, function_) {
			var e = _entities[Lethargy.EntityManager.getEntityIndex(id_)];
			if(e !== undefined) {
				e.mouseHoverEvent = function_;
			}
		},
		
		doMouseHover : function() {
			var scale = Lethargy.Graphics.getScale();
			for(var i=_entities.length;i>=0;i--){//traverse the list backwards
				if(_entities[i] !== undefined) {
					if(_entities[i].mouseHoverEvent !== undefined) {
						var s = Lethargy.SpriteManager.getSpriteSheet(_entities[i].spriteSheet);
						if(Lethargy.Mouse.x >= _entities[i].x*scale && Lethargy.Mouse.x <= _entities[i].x*scale + s.frameSize*scale && Lethargy.Mouse.y >= _entities[i].y*scale && Lethargy.Mouse.y <= _entities[i].y*scale + s.frameSize*scale) {	
							
							_entities[i].mouseHoverEvent(_entities[i].id);
							
							if(_currentHoverID !== -1 && _currentHoverID !== _entities[i].id) {
								//we need to process a mouseHoverOffEvent event for _currentHoverID
								var index = Lethargy.EntityManager.getEntityIndex(_currentHoverID);
								if(_entities[index] !== undefined && _entities[index].mouseHoverOffEvent !== undefined) {
									_entities[index].mouseHoverOffEvent(_currentHoverID);
								}
							}
							
							_currentHoverID = _entities[i].id;
							return;
						}
					}
				}
			}
			if(_currentHoverID != -1) {
				//we need to process a mouseHoverOffEvent event for _currentHoverID
				var index = Lethargy.EntityManager.getEntityIndex(_currentHoverID);
				if(_entities[index] != undefined && _entities[index].mouseHoverOffEvent != undefined) {
					_entities[index].mouseHoverOffEvent(_currentHoverID);
				}
			}			
			_currentHoverID = -1;
		},
		setMouseHoverOffEvent : function(id_, function_) {
			var e = _entities[Lethargy.EntityManager.getEntityIndex(id_)];
			if(e !== undefined) {
				e.mouseHoverOffEvent = function_;
			}
		},
		
		draw : function() {
			for(var i=0;i<_entities.length;i++) {
				if(_entities[i] !== undefined) {
					Lethargy.Graphics.drawSprite(_entities[i].spriteSheet, _entities[i].spriteIndex, _entities[i].x, _entities[i].y);
				}
			}		
		}
	};
})();

Lethargy.Map = (function() {
	_width = 0; //# of tiles, not pixels
	_height = 0; //# of tiles, not pixels
	_tiles = [];
	return {
		getWidth : function() {
			return _width;
		},
		getHeight : function() {
			return _height;
		},
		getTiles : function() {
			return _tiles;
		},
		fill : function(json_) {
			var jsonObject = JSON.parse(json_);
			_width = jsonObject.mapwidth;
			_height = jsonObject.mapheight;
			_tiles = jsonObject.tiles;
		}
	};
})();

Lethargy.Interface.WindowManager = (function() {
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
			var c = Lethargy.Graphics.getCanvas();
			var s = Lethargy.SpriteManager.getSpriteSheet(spriteSheet_);
			_windows[_IDIterator] = { x : x_, y : y_, width : w_, height : h_, id : _IDIterator, spriteSheet : spriteSheet_};
			_IDIterator++;
			return _IDIterator-1;
		},
		
		deleteWindow : function(id_) {
			_windows.splice(Lethargy.Interface.WindowManager.getIndexFromID(id_),1);
			if(_draggedWindowID === id_)  {//if we were dragging the deleted window
				_draggedWindowID = -1;
				_draggedWindowIndex = -1;
			}
			Lethargy.Graphics.redraw();
		},
		
		getIndexFromID : function(id_) {
			//very expensive. Do not call from inf loops
			for(var i=0;i<_windows.length;i++) {
				if(parseInt(_windows[i].id) === parseInt(id_)) {
					return i;
				}
			}
			return -1;//err
		},
		
		getWindow : function(id_) {
			return _windows[Lethargy.Interface.WindowManager.getIndexFromID(id_)];
			//returns undefined if err
		},
		
		setMouseDownEvent : function(id_, function_) {
			_windows[Lethargy.Interface.WindowManager.getIndexFromID(id_)].mouseDownEvent = function_;
		},
		
		draw : function() {
			//call drawWindow in z-Index order.
			for(var i=0;i<_windows.length;i++){
				if(_windows[i] !== undefined) {
					Lethargy.Graphics.drawWindow(_windows[i]);
				}
			}
		},
		
		doMouseDown : function() {
			var scale = Lethargy.Graphics.getScale();
			for(var i=_windows.length;i>=0;i--){//traverse the list of windows backwards
				if(_windows[i] !== undefined) {
					if(Lethargy.Mouse.x >= _windows[i].x*scale && Lethargy.Mouse.x <= _windows[i].x*scale + _windows[i].width*scale && Lethargy.Mouse.y >= _windows[i].y*scale && Lethargy.Mouse.y <= _windows[i].y*scale + _windows[i].height*scale) {
						
						var s = Lethargy.SpriteManager.getSpriteSheet(_windows[i].spriteSheet);
						if(Lethargy.Mouse.x >= _windows[i].x*scale && Lethargy.Mouse.y >= _windows[i].y*scale && Lethargy.Mouse.x <= (_windows[i].x + _windows[i].width)*scale && Lethargy.Mouse.y <= (_windows[i].y + s.frameSize)*scale) {
							_draggedWindowID = _windows[i].id;
							_draggedWindowIndex = i;
							_draggedWindowOffsetX = Lethargy.Mouse.x/scale - _windows[i].x;
							_draggedWindowOffsetY = Lethargy.Mouse.y/scale - _windows[i].y;
						}	
						if(_windows[i].mouseDownEvent !== undefined) {		
							_windows[i].mouseDownEvent(_windows[i].id);
						}
						this.bringToFront(_windows[i].id);
						return 1;//indicates that a window was clicked.
					}
				}
			}
			return 0;//no window was clicked.
		},
		
		fixDragIndex : function() {
			//we call this every time the _windows array is re-ordered.
			//This is so we don't have to run getIndexFromID every single doMouseHover,
			//which can be incredibly expensive.
			if(_draggedWindowIndex !== -1 && _draggedWindowID !== -1) {
				if(_windows[_draggedWindowIndex].id !== _draggedWindowID) {
					//mismatch detected!
					_draggedWindowIndex = Lethargy.Interface.WindowManager.getIndexFromID(_draggedWindowID);
				}
			}
		},
		
		setMouseHoverEvent : function(id_, function_) {
			var e = _windows[Lethargy.Interface.WindowManager.getIndexFromID(id_)];
			if(e !== undefined) {
				e.mouseHoverEvent = function_;
			}
		},
		
		
		doMouseHover : function() {
			if(_draggedWindowIndex !== -1) { //if a window is being dragged...
				if(_windows[_draggedWindowIndex] !== undefined) {
					var scale = Lethargy.Graphics.getScale();
					_windows[_draggedWindowIndex].x = Lethargy.Mouse.x/scale - _draggedWindowOffsetX;
					_windows[_draggedWindowIndex].y = Lethargy.Mouse.y/scale - _draggedWindowOffsetY;
					Lethargy.Graphics.redraw();
					if(_windows[_draggedWindowIndex].mouseHoverEvent !== undefined) {
						_windows[_draggedWindowIndex].mouseHoverEvent(_windows[_draggedWindowIndex].id);
					}
					return 1;
				}
			}else {
				var scale = Lethargy.Graphics.getScale();
				for(var i=_windows.length;i>=0;i--){//traverse the list of windows backwards
					if(_windows[i] !== undefined) {
						if(Lethargy.Mouse.x >= _windows[i].x*scale && Lethargy.Mouse.x <= _windows[i].x*scale + _windows[i].width*scale && Lethargy.Mouse.y >= _windows[i].y*scale && Lethargy.Mouse.y <= _windows[i].y*scale + _windows[i].height*scale) {
							if(_windows[i].mouseHoverEvent !== undefined) {
								_windows[i].mouseHoverEvent(_windows[i].id);
								
							}
							return 1;//indicates that a window was hovered over.
						}
					}
				}
			return 0;//no window was hovered.
			}
		},
		
		doMouseUp : function() {
			_draggedWindowID = -1;
			_draggedWindowIndex = -1;
	
		},
		
		bringToFront : function(id_) {
			var index = Lethargy.Interface.WindowManager.getIndexFromID(id_);
			var temp = _windows[index];
			_windows.splice(index,1);
			_windows.push(temp);
			//since we re-ordered the _windows array, run this:
			Lethargy.Interface.WindowManager.fixDragIndex();
			Lethargy.Graphics.redraw();
		}
	};
})();
