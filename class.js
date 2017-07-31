(function(root, factory){
  if(typeof define === 'function' && define.amd) {
    define([], factory);
  } else if(typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.class = factory();
  }
}(this, function(){
  'use strict';

  function Class() {

  }

  Class.prototype.hasClass = (function(){
    if(document.body.classList) {
      return function(element, className){
        if(!element || !className) {
          return;
        }
        className.trim ? className = className.trim() : className = className.replace(/(^\s*)|(\s*$)/g, '');
        return element.contain(className);
      }
    } else {
      return function(element, className){
        if(!element || !className) {
          return;
        }
        className.trim ? className = className.trim() : className = className.replace(/(^\s*)|(\s*$)/g, '');
        return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
      }
    }
  }());

  Class.prototype.addClass = (function(){
    if(document.body.classList) {
      return function(element, className){
        if(!element || !className) {
          return;
        }
        className = className.split(' ');
        className.forEach(function(name, i){
          element.classList.add(name);
        });
      }
    } else {
      return function(element, className){
        if(!element || !className) {
          return;
        }
        var currentClass = element.className;
        className = className.split(' ');
        className.forEach(function(name, i){
          if(!this.hasClass(element, name)) {
            currentClass += ' ' + 'name';
          }
        });
        element.className = currentClass;
      }
    }
  }());

  Class.prototype.removeClass = (function(){
    if(document.body.classList) {
      return function(element, className){
        if(!element || !className) {
          return;
        }
        className = className.split(' ');
        className.forEach(function(name, i){
          element.classList.remove(name);
        });
      }
    } else {
      return function(element, className){
        if(!element || !className) {
          return;
        }
        var currentClass = element.className;
        className = className.split(' ');
        className.forEach(function(name, i){
          if(this.hasClass(element, name)) {
            currentClass.replace(' ' + name + ' ', '');
          }
        });
        element.className = currentClass.trim ? currentClass.trim() : currentClass.replace(/(^\s*)|(\s*$)/g, '');
      }
    }
  }());

  return new Class();
}));