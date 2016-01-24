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