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