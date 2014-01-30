(function() {

    describe("Should provide for registering event handlers", function(){
        it("should provide registrartion for an event", function() {
            var hub = simplehub.create();
            assert.isFunction(hub.subscribe);
            hub.subscribe("someEvent", function() {});
            assert.isTrue(hub.hasSubscribers("someEvent"));
        });
        it("should allow for multiple callbacks for an event", function() {
            var hub = simplehub.create();
            hub.subscribe("ploppic", function() {});
            hub.subscribe("ploppic", function() {});
            hub.subscribe("ploppic", function() {});
            assert.equals(3, hub.numSubscribers("ploppic"));
        });
        it("should provide for un-registering listeners", function() {
            var hub = simplehub.create();
            assert.equals(0, hub.numSubscribers("anUniqueEventOfSomeKinde"));

            function f() {}
            hub.subscribe("anUniqueEventOfSomeKinde", f);
            assert.equals(1, hub.numSubscribers("anUniqueEventOfSomeKinde"));
            hub.unsubscribe("anUniqueEventOfSomeKinde", f);
            assert.equals(0, hub.numSubscribers("anUniqueEventOfSomeKinde"));
            refute.isTrue(hub.hasSubscribers());
        });
        it("should provide for un-registering when multiple listeners", function() {
            var hub = simplehub.create();
            assert.equals(0, hub.numSubscribers("anUniqueEventOfSomeKinde"));

            function f1() {}
            function f2() {}
            hub.subscribe("anUniqueEventOfSomeKinde", f1);
            hub.subscribe("anUniqueEventOfSomeKinde", f2);
            assert.equals(2, hub.numSubscribers("anUniqueEventOfSomeKinde"));
            hub.unsubscribe("anUniqueEventOfSomeKinde", f1);
            assert.equals(1, hub.numSubscribers("anUniqueEventOfSomeKinde"));
        });
        it("should handle unsubscribing in callback", function() {
            var hub = simplehub.create();
            assert.equals(0, hub.numSubscribers("anUniqueEventOfSomeKinde"));

            function f1() {
                hub.unsubscribe("anUniqueEventOfSomeKinde", f1);
            }
            function f2() {}
            hub.subscribe("anUniqueEventOfSomeKinde", f1);
            hub.subscribe("anUniqueEventOfSomeKinde", f2);
            hub.publish("anUniqueEventOfSomeKinde", {});
            assert.equals(1, hub.numSubscribers("anUniqueEventOfSomeKinde"));
        });
        it("should remove subscribers with subtopic set", function(){
            var hub = simplehub.create();
            var callback = sinon.spy();
            hub.subscribe("xxx/yyy", callback);
            hub.unsubscribe("xxx/yyy", callback);
            assert.equals(0, hub.numSubscribers("xxx/yyy"));
            hub.publish("xxx/yyy", "");
            assert.equals(0, callback.callCount);
        });
        it("should provide for having an error callback handler", function() {
            var hub = simplehub.create();
            var errorCallback = sinon.spy();
            hub.subscribe("xxx-xxx", function() {
                throw new Error("plopp")
            }, errorCallback);
            hub.publish("xxx-xxx", "");
            assert.isTrue(errorCallback.calledOnce);
        });
    });
    describe("Should behave as a separate instance", function(){
        it("should only respond for the instance where the event is registered", function() {
            var hub = simplehub.create(),
                hub2 = simplehub.create();
            var hubSpy = sinon.spy(),
                hub2Spy = sinon.spy();
            hub.subscribe("Eventen", hubSpy);
            hub2.subscribe("Eventen", hub2Spy);
            hub.publish("Eventen", function(){
                msg: "hola"
            });
            assert.isTrue(hubSpy.calledOnce);
            refute.isTrue(hub2Spy.calledOnce);
            assert.equals(1, hub.numSubscribers("Eventen"));
            assert.equals(1, hub2.numSubscribers("Eventen"));
        });
        it("should allow new hubs to be created without specifying options", function() {
            var hub = simplehub.create(),
                hub2 = simplehub.create();
            var hubSpy = sinon.spy(),
                hub2Spy = sinon.spy();
            hub.subscribe("Eventen", hubSpy);
            hub2.subscribe("Eventen", hub2Spy);
            hub.publish("Eventen", function(){
                msg: "hola"
            });
            assert.isTrue(hubSpy.calledOnce);
            refute.isTrue(hub2Spy.calledOnce);
            assert.equals(1, hub.numSubscribers("Eventen"));
            assert.equals(1, hub2.numSubscribers("Eventen"));

        });
    });
    describe("Should provide for sub topic filtering", function(){
        it("should publish only to subscribers with sub topic when one is specyfied", function(){
            var hub = simplehub.create();
            var subtopicCallback = sinon.spy();
            var topicCallback = sinon.spy();
            hub.subscribe("event", topicCallback);
            hub.subscribe("event/inhouse", subtopicCallback);

            hub.publish("event/inhouse", {});
            hub.publish("event/analytics", {});
            hub.publish("event", {});

            assert.equals(1, subtopicCallback.callCount);
            assert.equals(3, topicCallback.callCount);
        });
    });
    describe("Should provide for dispatching events", function(){
        it("should append the topic as a last argument when publishing events", function() {
            var spy1 = sinon.spy();
            var spy2 = sinon.spy();
            var hub = simplehub.create({
                subscribers: []
            });
            hub.subscribe("ploppic", spy1);
            hub.subscribe("ploppic", spy2);
            hub.publish("ploppic", {});
            assert.equals(2, spy1.getCall(0).args.length);
            assert.equals("ploppic", spy1.getCall(0).args[1]);
            assert.equals(2, spy2.getCall(0).args.length);
            assert.equals("ploppic", spy2.getCall(0).args[1]);
        });
        it("should call callback function when dispatching event", function() {
            var hub = simplehub.create();
            var spy = sinon.spy();
            hub.subscribe("ploppic", spy);
            hub.publish("ploppic", {});
            assert.isTrue(spy.called);
        });
        it("should call all registered function when an event is dispatched", function() {
            var hub = simplehub.create();
            var spy1 = sinon.spy();
            hub.subscribe("ploppic", spy1);
            var spy2 = sinon.spy();
            hub.subscribe("ploppic", spy2);
            var spy3 = sinon.spy();
            hub.subscribe("ploppic", spy3);
            hub.publish("ploppic", {});
            assert.isTrue(spy1.called && spy2.called && spy3.called);

        });
        it("should allow for unlimited number of data to be passed with an event", function() {
            var hub = simplehub.create();
            var callback = sinon.spy();
            hub.subscribe("ploppic", callback);
            hub.publish("ploppic", "a", "b", "c");
            assert.equals(4, callback.getCall(0).args.length);
        });
    });


})();