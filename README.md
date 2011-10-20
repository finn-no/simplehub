Event Hub 
============

Simple implementation of a publish subscribe module.
Provides you with an easy way to do event based applications without using the DOM.


Example
------------
		// Subscribe to a topic
		var hub = FINN.eventHub.create();
		hub.subscribe("someTopic", function(data){
			console.log(data.text);
			});
			// Publish a topic
			hub.publish("someTopic", {text: "hello world"});

			// You can also use the hub right out of the box, like so
			FINN.eventHub.pubslish("..", {});
			FINN.eventHub.subscribe("..", function(){});

Author
------------
Espen Dalløkken

Bugs or other types of feedback hit me on [http://twitter.com/FINN_tech](@FINN_tech).