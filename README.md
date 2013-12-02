simplehub
============

[![travis status](https://api.travis-ci.org/finn-no/simplehub.png)](https://travis-ci.org/finn-no/simplehub)

This is a simple implementation of a publish subscribe module in JavaScript. It can be used in the browser (CommonJS, AMD or just vanilla JS is supported) or on the server as a node module.

## Usage

Here is a simple publish subscribe example.

	// Subscribe to a topic
	var hub = simplehub.create();
	hub.subscribe("someTopic", function(data){
		console.log(data.text);
	});
	// Publish a topic
	hub.publish("someTopic", {text: "hello world"});

	// You can also use the hub right out of the box, like so
	simplehub.publish("..", {});
	simplehub.subscribe("..", function(){});

It is possible to have sub topics which provides for a more fine grained approach, below is a sample of how that might look.

	var hub = require('../../lib/simplehub/simplehub.js');

	hub.subscribe('events/subtopic', function(){
		// Fires only when event with subtopic is present
		console.log('A subtopic event fired');
	})
	hub.subscribe('events', function(){
		// Fires for both events
		console.log('Just an event fired');
	});

	hub.publish('events', '');
	hub.publish('events/subtopic', '');
