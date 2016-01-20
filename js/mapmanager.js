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