# Event Hub 

Simple implementation of a publish subscribe module.
Provides you with an easy way to do event based applications without using the DOM.


## Example
	// Subscribe to a topic
	var hub = FINN.eventHub.create();
	hub.subscribe("someTopic", function(data){
		console.log(data.text);
	});
	// Publish a topic
	hub.publish("someTopic", {text: "hello world"});

### Author
Espen Dalløkken
Developer at FINN.no