(function(){


    var util = {

        /*
          获取数据类型

          @parameter {*}  检测数据
          @return {string} 数据类型
        */
        getDataType: function(data){

            if(typeof data !== 'object') {

                return (typeof data);
            } else {

                var type = Object.prototype.toString.call(data);
                return type.match(/\[object (.*?)\]/)[1];
            }
        },

        /*
           获取浏览器信息 
        */
        getBrowerInfor: function(){
            
        },

        /*
            是否在微信浏览器
        */
        /**
         *  是否在谷歌浏览器
         */
        /**
         *  是否在 IE 浏览器
         */
        /** 
         *   获取元素大小
         *   @param  {DOMNode} ele
         *   @return {object}  
        */
        getElementSize: function(ele){
            var width, height;

            width = ele.offsetWidth;
            height = ele.offsetHeight;

            return {
                width: width + ele.style.marginLeft + ele.style.marginRight + 'px',
                height: height + ele.style.marginTop + ele.style.marginBottom + 'px'
            }
        },
        /**
         *  获取元素位置
         *  @param {DOMNode} ele
         *  @param {object}
         */
        getElementPosition: function(ele){

            var left, right, top, bottom;

            return {
                left: left,
                right: right,
                top: top,
                bottom: bottom
            }

        },
        /* 
            添加事件监听器
            @parameter {string} type
            @parameter {DOMNode} ele
            @parameter {Function} callback
            @parameter {Boolean} bubble
        */
        addHandler: function(type, ele, callback, bubble){
            if(typeof type !== 'string') {
                console.error('type is not valid');
                return;
            }

            if(!(ele instanceof HTMLElement || ele.nodeType === 1)) {
                console.error('ele is not a valid DOM Element');
                return;
            }

            if(Object.prototype.toString.call(callback) !== '[object Function]') {
                console.error('callback is not a function');
                return;
            }

            if(document.addEventListener) {
                
                ele.addEventListener(type, callback, !bubble);
            } else if(document.attachEvent){
                
                ele.attachEvent('on' + type, callback);
            } else {

                ele['on' + type] = callback;
            }
        },
        /*
            移除事件监听器
            @parameter {string} type
            @parameter {DOMNode} ele
            @parameter {Function} callback
         */
        removeHandler: function(type, ele, callback){
            if(typeof type !== 'string') {
                console.error('type is not valid');
                return;
            }

            if(!(ele instanceof HTMLElement || ele.nodeType === 1)) {
                console.error('ele is not a valid DOM Element');
                return;
            }

            if(Object.prototype.toString.call(callback) !== '[object Function]') {
                console.error('callback is not a function');
                return;
            }

            if(document.removeEventListener) {

                ele.removeEventListener(type, callback);
            } else if(document.detachEvent) {
                
                ele.detachEvent('on' = type, callback);
            } else {

                ele['on' + type] = null;
            }
        },
        /*
            函数节流
            应用场景：避免函数频繁地执行， 比如 resize，scroll 等
            @parameter {Function} callback
            @parameter {number} 
        */
        throttle: function(){
            
        },
        /*
            函数抖动
            应用场景：等待一段事件之后执行某个函数，只希望执行一次，比如重复提交或者实时查询
            @parameter {Function} callback
            @parameter {number} time
            @parameter {boolean} immediate
            @return 
         */
        bebounce: function(){

        }
    }

})();