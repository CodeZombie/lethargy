var Lethargy = Lethargy||{};

Lethargy.Entity = function(id_, x_, y_) {
	this.id = id_;
	this.x = x_;
	this.y = y_;
	this.spriteSheet;
	this.spriteIndex;
};
	
Lethargy.Entity.prototype.setSprite = function(spriteSheet_, spriteIndex_) {
	this.spriteSheet = spriteSheet_;
	this.spriteIndex = spriteIndex_;
	
};

Lethargy.Entity.prototype.draw = function() {
	if(this.spriteSheet !== undefined) {
		this.spriteSheet.drawSprite(this.spriteIndex, this.x, this.y);
	}
};