(function() {

    TestCase("Should provide for registering event handlers", {
        "test should provide registrartion for an event": function() {
            var hub = eventHub.create();
            assertNotUndefined("Should have an on method", hub.subscribe);
            hub.subscribe("someEvent", function() {});
            assertTrue("Should have registered callback function", hub.hasSubscribers("someEvent"));
        },
        "test should allow for multiple callbacks for an event": function() {
            var hub = eventHub.create();
            hub.subscribe("ploppic", function() {});
            hub.subscribe("ploppic", function() {});
            hub.subscribe("ploppic", function() {});
            assertEquals("Should have correct number of registered subscribers", 3, hub.numSubscribers("ploppic"));
        },
        "test should provide for un-registering listeners": function() {
            var hub = eventHub.create();
            assertEquals(0, hub.numSubscribers("anUniqueEventOfSomeKinde"));

            function f() {}
            hub.subscribe("anUniqueEventOfSomeKinde", f);
            assertEquals(1, hub.numSubscribers("anUniqueEventOfSomeKinde"));
            hub.unsubscribe("anUniqueEventOfSomeKinde", f);
            assertEquals("Should have removed subscription",
                0, hub.numSubscribers("anUniqueEventOfSomeKinde"));
            assertFalse("Should remove the topic when there are no more subscribers", hub.hasSubscribers());
        },
        "test should provide for un-registering when multiple listeners": function() {
            var hub = eventHub.create();
            assertEquals(0, hub.numSubscribers("anUniqueEventOfSomeKinde"));

            function f1() {}
            function f2() {}
            hub.subscribe("anUniqueEventOfSomeKinde", f1);
            hub.subscribe("anUniqueEventOfSomeKinde", f2);
            assertEquals(2, hub.numSubscribers("anUniqueEventOfSomeKinde"));
            hub.unsubscribe("anUniqueEventOfSomeKinde", f1);
            assertEquals("Should have removed subscription",
                1, hub.numSubscribers("anUniqueEventOfSomeKinde"));
        },
        "test should handle unsubscribing in callback": function() {
            var hub = eventHub.create();
            assertEquals(0, hub.numSubscribers("anUniqueEventOfSomeKinde"));

            function f1() {
                hub.unsubscribe("anUniqueEventOfSomeKinde", f1);
            }
            function f2() {}
            hub.subscribe("anUniqueEventOfSomeKinde", f1);
            hub.subscribe("anUniqueEventOfSomeKinde", f2);
            hub.publish("anUniqueEventOfSomeKinde", {});
            assertEquals("Should have removed subscription",
                1, hub.numSubscribers("anUniqueEventOfSomeKinde"));
        },
        "test should remove subscribers with subtopic set": function(){
            var hub = eventHub.create();
            var callback = sinon.spy();
            hub.subscribe("xxx/yyy", callback);
            hub.unsubscribe("xxx/yyy", callback);
            assertEquals(0, hub.numSubscribers("xxx/yyy"));
            hub.publish("xxx/yyy", "");
            assertEquals(0, callback.callCount);
        },
        "test should provide for having an error callback handler": function() {
            var hub = eventHub.create();
            var errorCallback = sinon.spy();
            hub.subscribe("xxx-xxx", function() {
                throw new Error("plopp")
            }, errorCallback);
            hub.publish("xxx-xxx", "");
            assertTrue(errorCallback.calledOnce);
        }
    });
    TestCase("Should behave as a separate instance", {
        "test should only respond for the instance where the event is registered": function() {
            var hub = eventHub.create(),
                hub2 = eventHub.create();
            var hubSpy = sinon.spy(),
                hub2Spy = sinon.spy();
            hub.subscribe("Eventen", hubSpy);
            hub2.subscribe("Eventen", hub2Spy);
            hub.publish("Eventen", {
                msg: "hola"
            });
            assertTrue(hubSpy.calledOnce);
            assertFalse(hub2Spy.calledOnce);
            assertEquals(1, hub.numSubscribers("Eventen"));
            assertEquals(1, hub2.numSubscribers("Eventen"));
        },
        "test should allow new hubs to be created without specifying options": function() {
            var hub = eventHub.create(),
                hub2 = eventHub.create();
            var hubSpy = sinon.spy(),
                hub2Spy = sinon.spy();
            hub.subscribe("Eventen", hubSpy);
            hub2.subscribe("Eventen", hub2Spy);
            hub.publish("Eventen", {
                msg: "hola"
            });
            assertTrue(hubSpy.calledOnce);
            assertFalse(hub2Spy.calledOnce);
            assertEquals(1, hub.numSubscribers("Eventen"));
            assertEquals(1, hub2.numSubscribers("Eventen"));

        }
    });
    TestCase("Should provide for sub topic filtering", {
        "test should publish only to subscribers with sub topic when one is specyfied":function(){
            var hub = eventHub.create();
            var subtopicCallback = sinon.spy();
            var topicCallback = sinon.spy();
            hub.subscribe("event", topicCallback);
            hub.subscribe("event/inhouse", subtopicCallback);

            hub.publish("event/inhouse", {});
            hub.publish("event/analytics", {});
            hub.publish("event", {});

            assertEquals(1, subtopicCallback.callCount);
            assertEquals(3, topicCallback.callCount);
        }
    });
    TestCase("Should provide for dispatching events", {
        "test should append the topic as a last argument when publishing events": function() {
            var spy1 = sinon.spy();
            var spy2 = sinon.spy();
            var hub = eventHub.create({
                subscribers: []
            });
            hub.subscribe("ploppic", spy1);
            hub.subscribe("ploppic", spy2);
            hub.publish("ploppic", {});
            assertEquals("Should initiate callback with two arguments", 2, spy1.getCall(0).args.length);
            assertEquals("Should add the topic as the last argument for callback function", "ploppic", spy1.getCall(0).args[1]);
            assertEquals("Should initiate callback with two arguments", 2, spy2.getCall(0).args.length);
            assertEquals("Should add the topic as the last argument for callback function", "ploppic", spy2.getCall(0).args[1]);
        },
        "test should call callback function when dispatching event": function() {
            var hub = eventHub.create();
            var spy = sinon.spy();
            hub.subscribe("ploppic", spy);
            hub.publish("ploppic", {});
            assertTrue("Should call callback function when dispatching event", spy.called);
        },
        "test should call all registered function when an event is dispatched": function() {
            var hub = eventHub.create();
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
        "test should allow for unlimited number of data to be passed with an event": function() {
            var hub = eventHub.create();
            var callback = sinon.spy();
            hub.subscribe("ploppic", callback);
            hub.publish("ploppic", "a", "b", "c");
            assertEquals(4, callback.getCall(0).args.length);
        }
    });

})();