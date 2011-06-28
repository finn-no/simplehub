(function(){

    TestCase("Should provide for registering event handlers", {
        "test should provide registrartion for an event": function(){
            var d = Object.create(FINN.eventHub);
            assertNotUndefined("Should have an on method", d.subscribe);
            d.subscribe("someEvent", function(){});
            assertTrue("Should have registered callback function", d.hasSubscribers("someEvent"));
        },
        "test should allow for multiple callbacks for an event": function(){
            var d = Object.create(FINN.eventHub);
            d.subscribe("ploppic", function(){});
            d.subscribe("ploppic", function(){});
            d.subscribe("ploppic", function(){});
            assertEquals("Should have correct number of callbacks registered", 3, d.numSubscribers("ploppic"));
        },
        "test should provide for un-registering listeners": function(){
            var d = Object.create(FINN.eventHub);
            assertEquals(0, d.numSubscribers("anUniqueEventOfSomeKinde"));
            d.subscribe("anUniqueEventOfSomeKinde", function(){});
            assertEquals(1, d.numSubscribers("anUniqueEventOfSomeKinde"));
            d.unsubscribe("anUniqueEventOfSomeKinde");
            assertEquals("Should have removed subscription",
                    1, d.numSubscribers("anUniqueEventOfSomeKinde"));
            assertFalse("Should remove the topic when there are no more subscribers", d.hasSubscribers());
        }
    });
    TestCase("Should provide for dispatching events", {
        "test should provide dispatch method for events": function(){
            var d = Object.create(FINN.eventHub);
            assertNotUndefined("Should provide dispatch function", d.publish);
        },
        "test should append the topic as a last argument when publishing events": function(){
            var d = Object.create(FINN.eventHub);
            var spy = sinon.spy();
            d.subscribe("ploppic", spy);
            d.publish("ploppic", {});
            assertEquals("Should initiate callback with two arguments", 2, spy.getCall(0).args.length);
            assertEquals("Should add the topic as the last argument for callback function", "ploppic", spy.getCall(0).args[1]);
        },
        "test should call callback function when dispatching event": function(){
            var d = Object.create(FINN.eventHub);
            var spy = sinon.spy();
            d.subscribe("ploppic", spy);
            d.publish("ploppic", {});
            assertTrue("Should call callback function when dispatching event", spy.called);
        },
        "test should call all registered function when an event is dispatched": function(){
            var d = Object.create(FINN.eventHub);
            var spy1 = sinon.spy();
            d.subscribe("ploppic", spy1);
            var spy2 = sinon.spy();
            d.subscribe("ploppic", spy2);
            var spy3 = sinon.spy();
            d.subscribe("ploppic", spy3);
            d.publish("ploppic", {});
            assertTrue("Should call callback function when dispatching event",
                    spy1.called && spy2.called && spy3.called);

        },
        "test should allow for unlimited number of data to be passed with an event": function(){
            var d = Object.create(FINN.eventHub);
            var argsOk = false;
            var callback = sinon.spy();
            d.subscribe("ploppic", callback);
            d.publish("ploppic", "a", "b", "c");
            assertEquals(4, callback.getCall(0).args.length);
        }
    });
})();