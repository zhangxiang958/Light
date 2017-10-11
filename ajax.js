/* eslint-disable */
(function(root, factory){

        if(typeof define === 'function' && define.amd) {
            define(factory);
        } else if(typeof exports === 'object'){
            module.exports = factory();
        } else {
            root.request = factory();
        }

    }(this, function(){
        var Util = {
            objectToQuery: function(data){
                var queryArr = [], encode = encodeURIComponent, value, key, i, len;
                for(key in data) {
                    if(data.hasOwnProperty(key)) {
                        value = data[key];
                        if(Object.prototype.toString.call(value) === '[object Array]') {

                            for(i = 0, len = value.length; i < len; i++) {
                                queryArr.push(encode(key) + '=' + encode(value[i]));
                            }
                        } else {
                            queryArr.push(encode(key) + '=' + encode(value));
                        }
                    }
                }
                return queryArr.join('&');
            },
            guid: function(len, radix){
                var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
                var uuid = [], i;
                radix = radix || chars.length;

                if (len) {
                    // Compact form
                    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
                    } else {
                    // rfc4122, version 4 form
                    var r;

                    // rfc4122 requires these characters
                    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                    uuid[14] = '4';

                    // Fill in random data.  At i==19 set the high bits of clock sequence as
                    // per rfc4122, sec. 4.1.5
                    for (i = 0; i < 36; i++) {
                        if (!uuid[i]) {
                        r = 0 | Math.random()*16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                        }
                    }
                }

                return uuid.join('');
            }
        };

        function Request(){

        };

        Request.prototype.createXHR = function(){
            if(typeof XMLHttpRequest !== 'undeined') {

                return new XMLHttpRequest();
            } else if(typeof ActiveXObject !== 'undeined'){

                if(typeof arguments.callee.activeXString != 'string') {

                    var versions = ['MSXML2.XMLHttp', 'MSXML2.XMLHttp.2.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp.4.0', 'MSXML2.XMLHttp.5.0', 'MSXML2.XMLHttp.6.0'];

                    for(var i = 0, len = versions.length; i < len; i++) {

                        try {
                            new ActiveXObject(versions[i]);
                            arguments.callee.activeXString = versions[i];
                        } catch(ex) {

                        }
                    }
                }
                return new ActiveXObject(arguments.callee.activeXString);
            } else {

                console.error('Your bowers is not support XHR!');
            }
        };

        Request.prototype.sendRequest = function(method, url, data, success, fail, isAsync){

            var xhr = this.createXHR();
            xhr.onreadystatechange = function(){
                switch(xhr.readyState) {
                    case 1: // OPENED
                        break;
                    case 2: // HEADERS_RECEIVED
                        break;
                    case 3: // LOADING
                        break;
                    case 4: //DONE
                        if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                            var data = xhr.responseText;
                            if(typeof data == 'string'){
                                data = JSON.parse(data);
                            }
                            success(data);
                        } else {
                            fail(xhr.response);
                        }
                        break;
                }
            }

            xhr.open(method, url, true);
            xhr.overrideMimeType('application/json');
            (method.toLowerCase() === 'post' || method.toLowerCase() === 'put' || method.toLowerCase() === 'delete') && (xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'));
            xhr.send(data);
        }

        Request.prototype.get = function(url, data){
            var that = this;
            data = Util.objectToQuery(data);
            data.length > 0 && (url = url.indexOf('?') >= 0 ? (url + '&' + data) : (url + '?' + data));
            return new Promise(function(resolve, reject) {
                that.sendRequest('get', url, null, resolve, reject, true);
            });
        }

        Request.prototype.post = function(url, data){
            var that = this;
            data = JSON.stringify(data);
            return new Promise(function(resolve, reject){
                that.sendRequest('post', url, data, resolve, reject, true);
            });
        }

        Request.prototype.put = function(url, data){
            var that = this;
            data = JSON.stringify(data);
            return new Promise(function(resolve, reject){
                that.sendRequest('put', url, data, resolve, reject, true);
            });
        }

        Request.prototype.delete = function(url, data){
            var that = this;
            data = JSON.stringify(data);
            return new Prommise(function(resolve, reject){
                that.sendRequest('delete', url, data, resolve, reject, true);
            });
        }

        Request.prototype.jsonp = function(url, data){

            var head = document.getElementsByTagName('head')[0];

            return new Promise(function(resolve, reject){

                var callbackName = 'jsonp_' + Util.guid(8, 16);
                data.callback = callbackName;
                data = Util.objectToQuery(data);

                var scriptNode = document.createElement('script');
                scriptNode.type = 'text/javascript';

                window[callbackName] = function(res){
                    head.removeChild(scriptNode);
                    delete window[callbackName];
                    if(typeof res == 'string'){
                        res = JSON.parse(res);
                    }
                    resolve(res);
                }

                scriptNode.onerror = function(){

                    head.removeChild(scriptNode);
                    delete window[callbackName];
                    reject({ err: 'err' });
                }

                url = url.indexOf('?') > 0 ? (url + '&' + data) : (url + '?' + data);
                scriptNode.src = url;
                head.appendChild(scriptNode);
            });
        }

        return new Request();
    }));
