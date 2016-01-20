var Lethargy = Lethargy||{};

Lethargy.Window = function(id_, x_, y_, width_, height_, spriteSheet_) {
	this.id = id_;
	this.x = x_;
	this.y = y_;
	this.width = width_;
	this.height = height_;
	this.spriteSheet = spriteSheet_;
	this.mouseEvents = [];	
}

Lethargy.Window.prototype.draw = function() {
	//draw inner
	
	if(this.spriteSheet === undefined) {
		console.log("Attempting to draw window with undefined spritesheet");
		return -1;
	}
	
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