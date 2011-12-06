(function(){

    TestCase("Should provide for registering event handlers", {
        "test should provide registrartion for an event": function(){
            var hub = FINN.eventHub.create({subscribers: []});
            assertNotUndefined("Should have an on method", hub.subscribe);
            hub.subscribe("someEvent", function(){});
            assertTrue("Should have registered callback function", hub.hasSubscribers("someEvent"));
        },
        "test should allow for multiple callbacks for an event": function(){
            var hub = FINN.eventHub.create({subscribers: []});
            hub.subscribe("ploppic", function(){});
            hub.subscribe("ploppic", function(){});
            hub.subscribe("ploppic", function(){});
            assertEquals("Should have correct number of registered subscribers", 3, hub.numSubscribers("ploppic"));
        },
        "test should provide for un-registering listeners": function(){
            var hub = FINN.eventHub.create({subscribers: []});
            assertEquals(0, hub.numSubscribers("anUniqueEventOfSomeKinde"));
            hub.subscribe("anUniqueEventOfSomeKinde", function(){});
            assertEquals(1, hub.numSubscribers("anUniqueEventOfSomeKinde"));
            hub.unsubscribe("anUniqueEventOfSomeKinde");
            assertEquals("Should have removed subscription",
                    1, hub.numSubscribers("anUniqueEventOfSomeKinde"));
            assertFalse("Should remove the topic when there are no more subscribers", hub.hasSubscribers());
        }
    });
	TestCase("Should behave as a separate instance", {
		"test should only respond for the instance where the event is registered":function(){
			var hub	= FINN.eventHub.create({subscribers:[]}),
				hub2 = FINN.eventHub.create({subscribers:[]});
			var hubSpy = sinon.spy(),
				hub2Spy = sinon.spy();
			hub.subscribe("Eventen", hubSpy);
			hub2.subscribe("Eventen", hub2Spy);
			hub.publish("Eventen", {msg: "hola"});
			assertTrue(hubSpy.calledOnce);
			assertFalse(hub2Spy.calledOnce);
			assertEquals(1, hub.numSubscribers("Eventen"));
			assertEquals(1, hub2.numSubscribers("Eventen"));			
		},
		"test should allow new hubs to be created without specifying options":function(){
			var hub = FINN.eventHub.create();
			var hub	= FINN.eventHub.create(),
				hub2 = FINN.eventHub.create();
			var hubSpy = sinon.spy(),
				hub2Spy = sinon.spy();
			hub.subscribe("Eventen", hubSpy);
			hub2.subscribe("Eventen", hub2Spy);
			hub.publish("Eventen", {msg: "hola"});
			assertTrue(hubSpy.calledOnce);
			assertFalse(hub2Spy.calledOnce);
			assertEquals(1, hub.numSubscribers("Eventen"));
			assertEquals(1, hub2.numSubscribers("Eventen"));			
			
		}		
	});
    TestCase("Should provide for dispatching events", {
        "test should append the topic as a last argument when publishing events": function(){
            var spy1 = sinon.spy();
            var spy2 = sinon.spy();
			var hub = FINN.eventHub.create({subscribers: []});
            hub.subscribe("ploppic", spy1);
            hub.subscribe("ploppic", spy2);
            hub.publish("ploppic", {});
            assertEquals("Should initiate callback with two arguments", 2, spy1.getCall(0).args.length);
            assertEquals("Should add the topic as the last argument for callback function", "ploppic", spy1.getCall(0).args[1]);
            assertEquals("Should initiate callback with two arguments", 2, spy2.getCall(0).args.length);
            assertEquals("Should add the topic as the last argument for callback function", "ploppic", spy2.getCall(0).args[1]);
        },
        "test should call callback function when dispatching event": function(){
            var hub = FINN.eventHub.create({subscribers: []});
            var spy = sinon.spy();
            hub.subscribe("ploppic", spy);
            hub.publish("ploppic", {});
            assertTrue("Should call callback function when dispatching event", spy.called);
        },
		"test should provide clients with ability to provide error handler function when errors throwing in callback functions":function(){
			var errorCallback = sinon.spy();
			FINN.eventHub.subscribe("throwError", function(){throw new Error("This is wrong, dead wrong!")}, errorCallback);
			FINN.eventHub.publish("throwError", "");
			assertTrue(errorCallback.calledOnce);
			FINN.eventHub.subscribe("throwError", function(){throw new Error("est should not throw error as no error callback is registered!")});
		},
        "test should call all registered function when an event is dispatched": function(){
            var hub = FINN.eventHub.create({subscribers: []});
            var spy1 = sinon.spy();
            hub.subscribe("ploppic", spy1);
            var spy2 = sinon.spy();
            hub.subscribe("ploppic", spy2);
            var spy3 = sinon.spy();
            hub.subscribe("ploppic", spy3);
            hub.publish("ploppic", {});
            assertTrue("Should call callback function when dispatching event",
                    spy1.called && spy2.called && spy3.called);

        },
        "test should allow for unlimited number of data to be passed with an event": function(){
            var hub = FINN.eventHub.create({subscribers: []});
            var argsOk = false;
            var callback = sinon.spy();
            hub.subscribe("ploppic", callback);
            hub.publish("ploppic", "a", "b", "c");
            assertEquals(4, callback.getCall(0).args.length);
        }
    });
})();