var Lethargy = Lethargy||{};

Lethargy.ResourceManager = (function() {
	var images = [];
	
	return {
		loadImage : function(path_, callback_) {
			var img = new Image();
			img.onerror = function(){
				console.log("Failed to load image: " + path_);
				callback_(undefined);
			};
			img.onload = function() {
				console.log("Succesfully loaded image: " + path_);
				images.push(img);
				callback_(images.length-1);
			}
			img.src = path_;			
		},
		
		getImage : function(id_) {
			if(images[id_] === undefined) {
				console.log("Attempted to fetch image with unknown id: " + id_);
			}
			return images[id_];
		}
	};
})();