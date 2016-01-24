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