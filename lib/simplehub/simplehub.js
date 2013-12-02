((typeof define === "function" && define.amd && function (m) {
    define("simplehub", [], m);
}) || (typeof module === "object" && function (m) {
    module.exports = m();
}) || function (m) { this.simplehub = m(); }
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
    function createTopicObject(topic){
        var obj = topic.split("/");
        var subTopic = (obj.length > 1 ) ? obj[1] : "";
        return {"topic": obj[0], "subtopic": subTopic};
    }

    function publishTopic(topicName){
        var topicObj = createTopicObject(topicName);
        var topicSubscribers = this.subscribers[topicObj.topic] || [];
        var args = Array.prototype.slice.call(arguments, 1);

        args.push(topicObj.topic);

        var exceptions = [];
        var index = topicSubscribers.length;
        while(index--){
            var aTopic = topicSubscribers[index];
            if (aTopic.subtopic !== "" && aTopic.subtopic !== topicObj.subtopic){
                continue;
            }
            try {
                aTopic.callback.apply(null, args);
            } catch(e){
                if (typeof aTopic.errorCallback !== "undefined"){
                    aTopic.errorCallback.apply(null, [e]);
                } else {
                    exceptions.push(e);
                }
            }
        }
        if (exceptions.length > 0) {
            var err = new Error("simplehub listener(s) threw unhandled exception while " +
                                "publishing '" + topicName + "'. " +
                                "See error.exceptions for original exceptions " +
                                "and stack traces.");
            throw err;
        }
        return this;
    }
    function subscribe(topicName, callback, errorCallback){
        if (typeof callback != "function") throw new TypeError("Callbacks must be functions");
        var topicObj = createTopicObject(topicName);
        if (!this.subscribers[topicObj.topic]){
            this.subscribers[topicObj.topic] = [];
        }
        this.subscribers[topicObj.topic].push({"subtopic": topicObj.subtopic, "callback": callback, "errorCallback": errorCallback});
        return this;
    }
    function unsubscribe(topicName, callback){
        var topicObj = createTopicObject(topicName);
        if (this.subscribers[topicObj.topic] == undefined){
            return;
        }
        var topicSubscribers = this.subscribers[topicObj.topic];
        var subscriberIndex = topicSubscribers.length;
        while(subscriberIndex--){
            if (topicSubscribers[subscriberIndex].callback == callback){
                topicSubscribers.splice(subscriberIndex,1);
            }
        }
        this.subscribers[topicObj.topic] = topicSubscribers;
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
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        isRegistered: isRegistered,
        hasSubscribers: hasSubscribers,
        numSubscribers: numSubscribers
    };
    return api.create(api, {subscribers:[]});

});