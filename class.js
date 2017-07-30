(function(root, factory){
  if(typeof define === 'function' && define.amd) {
    define(factory);
  } else if(typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.class = factory();
  }
}(this, function(){
  'use strict';

  function Class() {

  }

  Class.prototype.hasClass = function(){

  }

  Class.prototype.addClass = function(){

  }

  Class.prototype.removeClass = function(){
    
  }

  return new Class();
}));