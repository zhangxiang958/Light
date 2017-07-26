(function(root ,factory){
    if(typeof define === 'function' && define.amd) {
        define(factory);
    } else if(typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.event = factory();
    }
}(this, function(){

    function Event() {

    }

    Event.prototype.on = (function(){
        if(window.addEventListener) {
            return function(element, type, callback){
                if(element && type) {
                    element.addEventListener(type, callback, false);
                }
            };
        } else if(window.attachEvent){
            return function(element, type, callback){
                if(element && type) {
                    element.attachEvent('on' + type, callback);
                }
            }
        } else {
            return function(element, type, callback){
                if(element && type) {
                    element['on' + type] = callback;
                }
            }
        }
    }());

    Event.prototype.off = (function(){
        if(window.addEventListener) {
            return function(element, type, callback){
                if(element && type) {
                    element.removeEventListener(type, callback, false);
                }
            }
        } else if(window.detachEvent) {
            return function(element, type ,callback){
                if(element && type) {
                    element.detachEvent('on' + type, callback);
                }
            }
        } else {
            return function(element, type, callback){
                if(element && type) {
                    element['on' + type] = null;
                }
            }
        }
    }());

    Event.prototype.once = function(element, type, callback){
        this.on(element, type, function(){
            
            callback && callback();
            this.off(element, type, callback);
        });
    }

    return new Event();
}));