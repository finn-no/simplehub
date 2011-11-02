var FINN = FINN || {};
FINN.eventHub = (function(){
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
        for (var i=0, l = callbacks.length; i < l; i++){
            try {
				args.push(topic);
                callbacks[i].apply(null, args);
            } catch(e){
				throw e;
			}
        }
    }
    function addSubscriber(topic, callback){
        if (typeof callback != "function") throw new TypeError("Callbacks must be functions");
        if (!this.subscribers[topic]){
            this.subscribers[topic] = [];
        }
        this.subscribers[topic].push(callback);
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
}());