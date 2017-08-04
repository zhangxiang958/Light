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
  var ieVersion = IEVersion(document.documentMode);

  function CSS() {

  }


  CSS.prototype.css = function(element, prop, val){
    if(!element || !prop) {
      return;
    }

    if(typeof prop === 'object') {
      this.setStyle(element, prop, val);
    } else {
      if(!!val) {
        this.setStyle(element, prop, val);
      } else {
        this.getStyle(element, prop);
      }
    }
  }

  CSS.prototype.getStyle = (function(){
    if(!document.documentMode) {
      return function(element, prop){
        return (window.getComputedStyle || document.defaultView.getComputedStyle)(element, null).getPropertyValue(prop);
      }
    } else {
      return function(element, prop){
        prop = camelize(prop);
        if(prop === 'float') {
          ieVersion < 9 ? prop = 'styleFloat' : prop = 'cssFloat'; 
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
      styleName = camelize(styleName);
      if (styleName === 'opacity' && ieVersion < 9) {
        element.style.filter = isNaN(val) ? '' : 'alpha(opacity=' + val * 100 + ')';
      } else {
        element.style[styleName] = val;
      }
    }
  }

  return new CSS();
}));