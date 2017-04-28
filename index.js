(function(){
   
    var util = {

        /**
        *  获取数据类型

        *  @param  {*}  检测数据
        *  @return {string} 数据类型
        */
        getDataType: function(data){

            if(typeof data !== 'object') {

                return (typeof data);
            } else {

                var type = Object.prototype.toString.call(data);
                return type.match(/\[object (.*?)\]/)[1];
            }
        },

        /**
        *  获取浏览器信息 
        */
        getBrowerInfor: function(){
            var userAgent = navigator.userAgent, app = navigator.appVersion;

            return {
                trident: userAgent.indexOf('Trident') > -1,  //IE 内核
                presto: userAgent.indexOf('Presto') > -1,
                webkit: userAgent.indexOf('AppleWebkit') > -1, // chrome 内核
                gecko: userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('KHTML') == -1,
                mobile: !!userAgent.match(/AppleWebkit.*Mobile.*/),
                ios: !!userAgent.match(/\(i[^;]+;( U;) ? CPU.+Mac OS X/),
                andorid: userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1,
                iPhone: userAgent.indexOf('iPhone') > -1,
                IPad: userAgent.indexOf('iPad') > -1,
                webApp: userAgent.indexOf('Safari') == -1
            }
        },
        
        /**
         * 是否是移动端
         */
        isMobile: function(){
            var browerInfo = this.getBrowerInfor();

            if(browerInfo.mobile || browerInfo.ios || browerInfo.andorid || browerInfo.iPhone || browerInfo.iPad) {
                return true;
            } else {
                return false;
            }

        },
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
        /** 
         *   添加事件监听器
         *   @param {string} type
         *   @param {DOMNode} ele
         *   @param {Function} callback
         *   @param {Boolean} bubble
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
        /**
         *   移除事件监听器
         *   @param {string} type
         *   @param {DOMNode} ele
         *   @param {Function} callback
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
        /**
         *   函数节流
         *   应用场景：避免函数频繁地执行， 比如 resize，scroll 等
         *   @param {Function} callback
         *   @param {number} 
        */
        throttle: function(callback, number){

        },
        /** 
         *   函数抖动
         *   应用场景：等待一段事件之后执行某个函数，只希望执行一次，比如重复提交或者实时查询
         *   @param {Function} callback
         *   @param {number} time
         *   @param {boolean} immediate
         *   @return 
         */
        bebounce: function(callback, time, immediate){
            
        }
    }


})();