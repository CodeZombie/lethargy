
/*######### entity.js #########*/

var Lethargy = Lethargy||{};

Lethargy.Entity = function(id_, x_, y_) {
	this.objectType = "entity";
	this.id = id_;
	this.x = x_;
	this.y = y_;
	this.spriteSheet;
	this.spriteIndex;
};
	
Lethargy.Entity.prototype.setSprite = function(spriteSheet_, spriteIndex_) {
	if(spriteSheet_ === undefined) {
		Lethargy.System.printError("Attemping to set undefined sprite to entity with id: " + this.id);
		return;
	}
	this.spriteSheet = spriteSheet_;
	this.spriteIndex = spriteIndex_;
};

Lethargy.Entity.prototype.draw = function() {
	if(this.spriteSheet !== undefined) {
		this.spriteSheet.drawSprite(this.spriteIndex, this.x, this.y);
	}
};

/*######### entitymanager.js #########*/

var Lethargy = Lethargy||{};

Lethargy.EntityManager = (function() {
	var entities = [];
	var IDIterator = 0;
	
	return{
		createEntity : function(x_, y_, width_, height_) {
			if(width_ <= 0 && height_ <= 0) {
				Lethargy.System.printError("Attempted to create entity with invalid dimensions");
			}
			
			entities.push(new Lethargy.Entity(IDIterator, x_, y_));
			IDIterator++;
			return IDIterator-1;
		},
		
		getEntityIndexFromId : function(id_) {
			for(var i = 0 ; i < entities.length; i++) {
				if(entities[i].id === id_) {
					return i;
				}
			}
			return;			
		},
		
		getEntity : function(id_) {
			for(var i = 0 ; i < entities.length; i++) {
				if(entities[i].id === id_) {
					return entities[i];
				}
			}
			return;
		},
		
		deleteEntity : function(id_) {
			var index = this.getEntityIndexFromId(id_);
			if(index == -1) {
				return 0;
			}
			entities.splice(index, 1);
			return 1;
		},
		
		draw : function() {
			for(var i = 0; i < entities.length; i++) {
				if(entities[i] !== undefined) {
					entities[i].draw();
				}
			}
		}
	}
})();

/*######### graphics.js #########*/

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

/*######### mapmanager.js #########*/

var Lethargy = Lethargy||{};

Lethargy.MapManager = (function() {
	var width = 0;
	var height = 0;
	var tiles = [];
	var spriteSheet = undefined;
	return {
		getWidth : function() {
			return width;
		},
		
		getHeight : function() {
			return height;
		},
		
		getTiles : function() {
			return tiles;
		},

		setSpriteSheet : function(s_) {
			spriteSheet = s_;
		},
		
		populate : function(json_) {
			var jsonObject = JSON.parse(json_);
			width = jsonObject.mapwidth;
			height = jsonObject.mapheight;
			tiles = jsonObject.tiles;
		},
		
		draw : function() {
			if(spriteSheet === undefined) {
				console.log("Cannot draw map: no spriteSheet defined");
				Lethargy.Graphics.drawFilledSquare(0, 0, width*32, height*32, "#f0f");	//32 arbitrarily chosen
				return -1;
			}
			
			for(var y = 0; y < height; y++) {
				for(var x = 0; x < width; x++) {
					spriteSheet.drawSprite(tiles[(y*width) + x], spriteSheet.spriteWidth*x, spriteSheet.spriteHeight*y);
				}
			}	
		}
	}
})();

/*######### mouse.js #########*/

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

/*######### mouseevent.js #########*/

var Lethargy = Lethargy||{};

Lethargy.MouseEvent = function(type_, parent_, offset_x_, offset_y_, width_, height_, event_) {
	this.type = type_;
	this.parent = parent_;
	this.offset_x = offset_x_;
	this.offset_y = offset_y_;
	this.width = width_;
	this.height = height_;
	this.event = event_;
};

Lethargy.MouseEvent.prototype.check = function() {
	var scale = Lethargy.Graphics.getScale();
	var tempWidth = this.width;
	var tempHeight = this.height;
	
	if(this.width === -1) {
		tempWidth = this.parent.width;
	}
	
	if(this.height === -1) {
		tempHeight = this.parent.width;
	}			
	
	if(Lethargy.Mouse.getX() >= (this.parent.x + this.offset_x) * scale && Lethargy.Mouse.getX() <= (this.parent.x + this.offset_x + tempWidth) * scale && Lethargy.Mouse.getY() >= (this.parent.y + this.offset_y) * scale && Lethargy.Mouse.getY() <= (this.parent.y + this.offset_y + tempHeight) * scale) {
		this.event();
	}
};

/*######### mouseeventmanager.js #########*/

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


/*######### resourcemanager.js #########*/

var Lethargy = Lethargy||{};

Lethargy.ResourceManager = (function() {
	var images = [];
	var IDIterator = 0;
	
	return {
		loadImage : function(path_, callback_) {
			Lethargy.System.increaseNumberOfNeededResources();
			var reservedID = IDIterator;//this way, elements are always placed in the array in the exact order that loadImage() is called.
			IDIterator++;
			var img = new Image();
			img.onerror = function(){
				Lethargy.System.printError("Failed to load image: " + path_);
				callback_(undefined);
			};
			img.onload = function() {
				Lethargy.System.increaseNumberOfLoadedResources();
				images[reservedID] = img;
				callback_(reservedID);
			}
			img.src = path_;
		},
		
		getImage : function(id_) {
			if(images[id_] === undefined) {
				Lethargy.System.printError("Attempted to fetch image with unknown id: " + id_);
			}
			return images[id_];
		}
	};
})();

/*######### spritesheet.js #########*/

var Lethargy = Lethargy||{};

Lethargy.SpriteSheet = function(id_, resource_, spriteWidth_, spriteHeight_) {
	this.objectType = "spritesheet";
	this.resource = resource_; //reference to actual resource
	this.spriteWidth = spriteWidth_;
	this.spriteHeight = spriteHeight_;
	this.spritePositions = []; //idk how i feel about the name of this variable, but whatever.
	this.id = id_;
	
	if(this.resource === undefined) {
		console.log("Attempted to create SpriteSheet with undefined resource!");
	}
	if(this.resource.width === undefined) {
		console.log("Attempted to create SpriteSheet with non-image resource!");
	}
	
	for(var y = 0; y < this.resource.height / this.spriteHeight; y++){
		for(var x = 0; x < this.resource.width / this.spriteWidth; x++){
			this.spritePositions.push({x : (x * this.spriteWidth), y : (y * this.spriteHeight)});
		}
	}	
};

Lethargy.SpriteSheet.prototype.drawSprite = function(index_, x_, y_) {
	var canvasContext = Lethargy.Graphics.getCanvasContext();
	var scale = Lethargy.Graphics.getScale();
	
	if(this.resource === undefined) {
		//replace this with the drawSquare func
		canvasContext.beginPath();
		canvasContext.fillStyle = "#f0f";
		canvasContext.fillRect(Math.round(x_*scale),Math.round(y_*scale),Math.round(spriteWidth*scale),Math.round(spriteHeight*scale));
		canvasContext.stroke();
		console.log("Failed to draw sprite! (spriteSheet : " + spriteSheetID_ + ", spriteIndex : " + spriteIndex_ + ")");
		return -1;
	}
	//draw sprite...
	if(this.spritePositions[index_] === undefined) {
		console.log("Could not find sprite index");
		return -1;
	}
	canvasContext.drawImage(this.resource, this.spritePositions[index_].x, this.spritePositions[index_].y, this.spriteWidth, this.spriteHeight, Math.round(x_*scale), Math.round(y_*scale), Math.round(this.spriteWidth*scale) ,Math.round(this.spriteHeight*scale));		
};

/*######### spritesheetmanager.js #########*/

var Lethargy = Lethargy||{};

Lethargy.SpriteSheetManager = (function() {
	var spriteSheets = [];
	
	return {
		createSpriteSheet : function(resource_, spriteWidth_, spriteHeight_) {
			var id = spriteSheets.length;
			
			//check if resource_ is valid
			if(resource_ === undefined) {
				console.log("Attempted to create SpriteSheet with undefined resource!");
				return -1;
			}
			if(resource_.width === undefined) {
				console.log("Attempted to create SpriteSheet with non-image resource!");
				return -1;
			}			
					
			spriteSheets.push(new Lethargy.SpriteSheet(id, resource_, spriteWidth_, spriteHeight_));
			return id;
		},
		getSpriteSheet : function(id_) {
			if(spriteSheets[id_] == undefined) {
				console.log("Could not find spriteSheet (" + id_ + ")");
			}
			return spriteSheets[id_];
		}
	}
})();

/*######### system.js #########*/

var Lethargy = Lethargy||{};

Lethargy.System = (function() {
	var initializeFunction;
	var redrawFunction;
	
	var resourcesNeeded = 0;
	var resourcesLoaded = 0;
	
	return {
		start : function(loadResourceFunc_, initializeFunc_, redrawFunc_) {
			initializeFunction = initializeFunc_;
			redrawFunction = redrawFunc_;
			
			loadResourceFunc_();
			this.checkResourceLoop();
		},
		
		checkResourceLoop : function() {
			if(resourcesLoaded === resourcesNeeded) {
				initializeFunction();
				redrawFunction();
				
			}else {
				requestAnimationFrame(Lethargy.System.checkResourceLoop);
			}
			//////////////////////////////////////////////////
			//// perhaps a timeout in here would be nice /////
			//////////////////////////////////////////////////
		},
		 
		printError : function(text_) {
			console.log("ERROR: " + text_);
		},
		
		printMessage : function(text_) {
			console.log("MESSAGE: " + text_);
		},
		
		fatalError : function(text_) {
			alert("Fatal Error: " + text_);
			running = false;
		},
		
		increaseNumberOfNeededResources : function() {
			resourcesNeeded++;
		},
		
		increaseNumberOfLoadedResources : function() {
			resourcesLoaded++;
		},
		
		redraw : function() {
			redrawFunction();
		}
	}
})();

/*######### window.js #########*/

var Lethargy = Lethargy||{};

Lethargy.Window = function(id_, x_, y_, width_, height_, spriteSheet_) {
	this.objectType = "window";
	this.id = id_;
	this.x = x_;
	this.y = y_;
	this.width = width_;
	this.height = height_;
	this.spriteSheet = spriteSheet_;
	this.mouseEvents = [];	
}

Lethargy.Window.prototype.draw = function() {
	for(var yi = 0; yi < (((this.y + this.height) - this.y) - (this.spriteSheet.spriteHeight * 2)) / this.spriteSheet.spriteHeight; yi++) {
		for(var xi = 0; xi < (((this.x + this.width) - this.x) - (this.spriteSheet.spriteWidth * 2)) / this.spriteSheet.spriteHeight; xi++) {
			this.spriteSheet.drawSprite(4, this.x + this.spriteSheet.spriteWidth + (xi * this.spriteSheet.spriteWidth), this.y + this.spriteSheet.spriteHeight + (yi * this.spriteSheet.spriteHeight));
		}
	}
	//draw top and bottom
	for(var i=0; i < (((this.x + this.width) - this.x) - (this.spriteSheet.spriteWidth * 2)) / this.spriteSheet.spriteHeight; i++) {
		this.spriteSheet.drawSprite(1, this.x + this.spriteSheet.spriteWidth + (i * this.spriteSheet.spriteWidth), this.y);
		this.spriteSheet.drawSprite(7, this.x + this.spriteSheet.spriteWidth + (i * this.spriteSheet.spriteWidth), this.y + this.height - this.spriteSheet.spriteHeight);
	}
	
	//draw left and right columns
	for(var i = 0; i < (((this.y + this.height) - this.y) - (this.spriteSheet.spriteHeight * 2)) / this.spriteSheet.spriteHeight; i++) {
		this.spriteSheet.drawSprite(3, this.x, this.y  + this.spriteSheet.spriteHeight + (i * this.spriteSheet.spriteHeight));
		this.spriteSheet.drawSprite(5, this.x + this.width - this.spriteSheet.spriteWidth, this.y + this.spriteSheet.spriteHeight + (i * this.spriteSheet.spriteHeight));
	}
	//draw corners
	this.spriteSheet.drawSprite(0, this.x, this.y);
	this.spriteSheet.drawSprite(2, this.x + this.width - this.spriteSheet.spriteWidth, this.y);
	this.spriteSheet.drawSprite(6, this.x, this.y + this.height - this.spriteSheet.spriteHeight);
	this.spriteSheet.drawSprite(8, this.x + this.width - this.spriteSheet.spriteWidth, this.y + this.height - this.spriteSheet.spriteHeight);

	//now draw interfaces within the window				
};

/*######### windowmanager.js #########*/

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
