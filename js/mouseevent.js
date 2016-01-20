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