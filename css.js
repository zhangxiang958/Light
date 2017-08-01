(function(root, factory){
  if(typeof define === 'function' && define.amd) {
    define([], factory);
  } else if(typeof module === 'object' && module.exports){
    module.exports = factory();
  }else {
    root.css = factory();
  }
}(this, function(){
  'use strict';

  function camelize(str){
    return attr.replace(/-(w)/g, function(all, letter){
      return letter.toUpperCase();
    });
  }

  function IEVersion(mode){
    return Number(mode);
  }

  function CSS() {

  }

  CSS.prototype.css = function(element, prop, val){

  }

  CSS.prototype.getStyle = (function(){
    if(!document.documentMode) {
      return function(element, prop){
        return (window.getComputedStyle || document.defaultView.getComputedStyle)(element, null).getPropertyValue(prop);
      }
    } else {
      if(IEVersion(document.documentMode) < 9) {
        return function(element, prop){
          prop = camelize(prop);
          if(prop === 'float') {
           prop = 'styleFloat'; 
          }
          switch(prop) {
            case 'opacity':
              try {
                return element.filters.item('alpha').opacity / 100;
              }
              catch (e) {
                return 1.0;
              }
            default:
              return element.style[prop] || element.currentStyle ? element.currentStyle.getAttribute(prop) : null;
          }
        }
      } else {
        return function(element, prop){
          return function(element, prop){
            prop = camelize(prop);
            if(prop === 'float') {
              prop = 'cssFloat'; 
            }
            switch(prop) {
              case 'opacity':
                try {
                  return element.filters.item('alpha').opacity / 100;
                }
                catch (e) {
                  return 1.0;
                }
              default:
                return element.style[prop] || element.currentStyle ? element.currentStyle.getAttribute(prop) : null;
            }
        }
        }
      }
    }
  }());

  CSS.prototype.setStyle = function(element, styleName, val){
    if(!element || !styleName) {
      return;
    }

    if(typeof styleName === 'object') {
      for(var key in styleName) {
        if(styleName.hasOwnProperty(key)) {
          this.setStyle(element, key, styleName[key]);
        }
      }
    } else {
      // styleName = 

    }
  }

  return new CSS();
}));