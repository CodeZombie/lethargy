var Lethargy = Lethargy||{};

Lethargy.SpriteSheet = function(id_, resource_, spriteWidth_, spriteHeight_) {
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