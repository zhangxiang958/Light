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
        // 工具函数
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
            },
            escape: window.escape,
            plainEscape: function(text){
                //将空白与 = 和 \ 符号, 全部转化为 \前缀
                return text.replace(/[\s\=\\]/g, "\\$&");
            }
        };

        if (!XMLHttpRequest.prototype.sendAsBinary) {
            XMLHttpRequest.prototype.sendAsBinary = function(sData) {
                var nBytes = sData.length, ui8Data = new Uint8Array(nBytes);
                for (var nIdx = 0; nIdx < nBytes; nIdx++) {
                    ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
                }
                /* send as ArrayBufferView...: */
                console.log(ui8Data);
                this.send(ui8Data);
                /* ...or as ArrayBuffer (legacy)...: this.send(ui8Data.buffer); */
            };
        }
        
        function Request(){
            this.fileCount = 0;
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

        Request.prototype.loadFile = function(file, idx, result){
            var ctx = this;
            var fileReader = new FileReader();
            fileReader.idx = idx;
            fileReader.owner = this;
            fileReader.onload = function(found){
                result[idx] += found.target.result + "\r\n";
                ctx.fileCount--;
                ctx.sendRequestWithFile(ctx.xhr, result, ctx.boundary);
            }
            fileReader.readAsBinaryString(file);
        }

        Request.prototype.handleFile = function(file){
            return "Content-Disposition: form-data; name=\"" +
                    file.name + "\"; filename=\"" + file.name +
                    "\"\r\nContent-Type: " + file.type + "\r\n\r\n";
        }

        Request.prototype.lego = function(key, value, dataType){
            if(value instanceof File) {
                if(dataType === 'multipart\/form-data') {
                    return this.handleFile(value);
                } else {
                    return dataType === 'text\/plain' ?
                    Util.plainEscape(key) + '=' + Util.plainEscape(value.name)
                    :
                    Util.escape(key) + '=' + Util.escape(value)
                }
            } else {
                return (
                    dataType === 'multipart\/form-data' ?
                    "Content-Disposition: form-data; name=\"" + key + "\"\r\n\r\n" + value + "\r\n"
                    :
                    dataType === 'text\/plain' ?
                    Util.plainEscape(key) + '=' + Util.plainEscape(value.name)
                    :
                    Util.escape(key) + '=' + Util.escape(value)
                    )
            }
        }

        Request.prototype.handleData = function(data, opts){
            var result = [];
            var ctx = this;
            if(data instanceof FormData) {
                for(var line of data.entries()) {
                    var key = line[0];
                    var value = line[1];
                    var idx = result.length;
                    result.push(ctx.lego(key, value, opts.type));
                    if(value instanceof File) {
                        this.fileCount++;
                        this.loadFile(value, idx, result);
                    }
                }
            } else {
                Object.keys(data).forEach(function(item, idx){
                    var key = item;
                    var value = data[key];
                    result.push(ctx.lego(key, value));
                });
            }
            return result;
        }

        Request.prototype.sendRequestWithFile = function(ctx, data, boundary){
            console.log('data', data);
            if(this.fileCount > 0) {
                return;
            }
            ctx.sendAsBinary('--' + boundary + '\r\n' +
                                    data.join("--" + boundary + "\r\n") + "--" + boundary + "--\r\n");
        }

        Request.prototype.sendRequest = function(method, url, opts, success, fail, isAsync){
            var xhr = this.createXHR();
            var data = opts.data;
            var contentType = opts.type;
            var sep;
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
                            var responseHeader = xhr.getResponseHeader('Content-Type');
                            if(typeof data == 'string') {
                                if(responseHeader.indexOf('text/html') >= 0 || responseHeader.indexOf('text/plain') >= 0) {
                                    data = data;
                                } else {
                                    data = JSON.parse(data);
                                }
                            }
                            success(data);
                        } else {
                            fail(xhr.response);
                        }
                        break;
                }
            }

            if(opts.progress && Object.prototype.toString.call(opts.progress) === '[object Function]') {
                xhr.upload.onprogress = opts.process
            }

            if(opts.withCredentials) {
                xhr.withCredentials = true;
            }

            xhr.open(method, url, true);
            if(method.toLowerCase() === 'post') {
                contentType = contentType ||  'application/x-www-form-urlencoded';
                if(opts.type === 'multipart\/form-data') {
                    var boundary = "----------------------------" + Date.now().toString(16);
                    this.boundary = boundary;
                    this.xhr = xhr;
                    xhr.setRequestHeader("Content-Type", "multipart\/form-data; boundary=" + boundary);
                    data = this.handleData(data, opts);
                    this.sendRequestWithFile(xhr, data, boundary);
                    return;
                } else {
                    spt = opts.type === 'text\/plain' ? '\r\n' : '&';
                    data = this.handleData(data, opts).join(spt);
                }
            }
            xhr.setRequestHeader('Content-Type', contentType || 'text/plain');
            xhr.send(data);
        }

        Request.prototype.get = function(url, opts){
            var data = Util.objectToQuery(opts.data);
            data.length > 0 && (url = url.indexOf('?') >= 0 ? (url + '&' + data) : (url + '?' + data));
            return new Promise(function(resolve, reject) {
                var request = new Request();
                request.sendRequest('get', url, opts, resolve, reject, true);
            });
        }

        Request.prototype.post = function(url, opts){
            return new Promise(function(resolve, reject){
                var request = new Request();
                request.sendRequest('post', url, opts, resolve, reject, true);
            });
        }

        Request.prototype.upload = function(url, opts){
            var data = opts.data;
            return new Promise(function(resolve, reject){
                var request = new Request();
                request.sendRequest('post', url, data, resolve, reject, true);
            });
        }

        Request.prototype.put = function(url, opts){
            return new Promise(function(resolve, reject){
                var request = new Request();
                request.sendRequest('put', url, opts, resolve, reject, true);
            });
        }

        Request.prototype.delete = function(url, opts){
            return new Prommise(function(resolve, reject){
                var request = new Request();
                request.sendRequest('delete', url, opts, resolve, reject, true);
            });
        }

        Request.prototype.jsonp = function(url, opts){

            var head = document.getElementsByTagName('head')[0];

            return new Promise(function(resolve, reject){

                var callbackName = 'jsonp_' + Util.guid(8, 16);
                var data = opts.data;
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
