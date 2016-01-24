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