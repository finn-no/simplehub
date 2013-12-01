Event Hub 
============

[![travis status](https://api.travis-ci.org/finn-no/eventhub.png)](https://travis-ci.org/finn-no/eventhub)

Simple implementation of a publish subscribe module in the browser. It is dead simple and has no dependencies. It can be used in the browser or on the server


## Example

	// Subscribe to a topic
	var hub = eventHub.create();
	hub.subscribe("someTopic", function(data){
		console.log(data.text);
	});
	// Publish a topic
	hub.publish("someTopic", {text: "hello world"});

	// You can also use the hub right out of the box, like so
	eventHub.publish("..", {});
	eventHub.subscribe("..", function(){});
