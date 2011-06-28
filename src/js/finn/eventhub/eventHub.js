var FINN = FINN || {};

FINN.eventHub = (function(){
    var subscribers = [];
    function publishTopic(topic){
        var callbacks = subscribers[topic] || [];
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i=0, l = callbacks.length; i < l; i++){
            try {
				args.push(topic);
                callbacks[i].apply(null, args);
            } catch(e){}
        }
    }
    function addSubscriber(topic, callback){
        if (typeof callback != "function") throw new TypeError("Callbacks must be functions");
        if (!subscribers[topic]){
            subscribers[topic] = [];
        }
        subscribers[topic].push(callback);
    }
    function removeSubscriber(topic, callback){
        if (subscribers[topic] == undefined){
            return;
        }
        var topicSubscribers = subscribers[topic];
        for (var i=0, l = topicSubscribers.length; i<l; i++){
            if (topicSubscribers[i] == callback){
                topicSubscribers.splice(i,1);
            }
        }
        subscribers[topic] = topicSubscribers;
    }
    function isRegistered(topic, callback){
        var allCallbacks = subscribers[topic];
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
        return numSubscribers(eventName) > 0;
    }
    function numSubscribers(topic){
        if (subscribers[topic]){
            return subscribers[topic].length;
        } else {
            return 0;
        }
    }
    var api = {
        publish: publishTopic,
        subscribe: addSubscriber,
        unsubscribe: removeSubscriber,
        isRegistered: isRegistered,
        hasSubscribers: hasSubscribers,
        numSubscribers: numSubscribers
    };
    return api;
})();