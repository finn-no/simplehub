((typeof define === "function" && define.amd && function (m) {
    define("eventHub", [], m);
}) || (typeof module === "object" && function (m) {
    module.exports = m();
}) || function (m) { this.eventHub = m(); }
)(function () {
    "use strict";

    var objCreate = Object.create || function (o) {function F() {}F.prototype = o;return new F();};

	function extend(obj, extObj) {
	    if (arguments.length > 2) {
	        for (var a = 1; a < arguments.length; a++) {
	            extend(obj, arguments[a]);
	        }
	    } else {
	        for (var i in extObj) {
	            obj[i] = extObj[i];
	        }
	    }
	    return obj;
	}
    function publishTopic(topic){
        var callbacks = this.subscribers[topic] || [];
        var args = Array.prototype.slice.call(arguments, 1);
		args.push(topic);
        var exceptions = [];
        for (var i=0, l = callbacks.length; i < l; i++){
			var topicCallbacks = callbacks[i];
            try {
                topicCallbacks.callback.apply(null, args);
            } catch(e){
                exceptions.push(e);
				if (typeof topicCallbacks.errorCallback !== "undefined"){
					topicCallbacks.errorCallback(e);
				}
			}
        }
        if (exceptions.length > 0) {
            var err = new Error("eventHub listener(s) threw exception while " +
                                "publishing '" + topic + "'. " +
                                "See error.exceptions for original exceptions " +
                                "and stack traces.");
            throw err;
        }
    }
    function addSubscriber(topic, callback, errorCallback){
        if (typeof callback != "function") throw new TypeError("Callbacks must be functions");
        if (!this.subscribers[topic]){
            this.subscribers[topic] = [];
        }
        this.subscribers[topic].push({"callback": callback, "errorCallback": errorCallback});
    }
    function removeSubscriber(topic, callback){
        if (this.subscribers[topic] == undefined){
            return;
        }
        var topicSubscribers = this.subscribers[topic];
        for (var i=0, l = topicSubscribers.length; i<l; i++){
            if (topicSubscribers[i] == callback){
                topicSubscribers.splice(i,1);
            }
        }
        this.subscribers[topic] = topicSubscribers;
    }
    function isRegistered(topic, callback){
        var allCallbacks = this.subscribers[topic];
        if (allCallbacks !== undefined){
            for (var i=0, l = allCallbacks.length; i<l; i++){
                if (allCallbacks[i] === callback){
                    return true;
                }
            }
        }
        return false;
    }
    function hasSubscribers(eventName){
        return this.numSubscribers(eventName) > 0;
    }
    function numSubscribers(topic){
        if (this.subscribers[topic]){
            return this.subscribers[topic].length;
        } else {
			return 0;
		}
    }
    var api = {
		create: function(options){
			var o = extend(objCreate(this), options, {subscribers: []});
			return o;
		},
        publish: publishTopic,
        subscribe: addSubscriber,
        unsubscribe: removeSubscriber,
        isRegistered: isRegistered,
        hasSubscribers: hasSubscribers,
        numSubscribers: numSubscribers
    };
    return api.create(api, {subscribers:[]});

});