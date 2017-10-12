/* eslint-disable */
import LegoToast from '../lego/lego-toast/0.0.1/legoToast.min.js';
import wechatShare from './wechatshare.js';
import YYAPI from './yyApi.js';
export default {
    toast: new LegoToast({
        msg: "操作成功",
        time: 1200,
        extraclass: "extraclass"
    }),
    windowToast: function(msg) {
        console.log('windowToast', 'msg');
        this.toast.changeText(msg);
        this.toast.open();
    },
    jumpULink: function(type, url, ssid) {
        console.log('jumpULink', type, url);
        switch (type) {
            case 1:
                /**跳视频播放页 */
                if (!url) {
                    this.windowToast('无法获取视频连接');
                    return;
                }
                if (window.edition == 1) {
                    /**调起手Y短视频 */
                    window.location.href = `//ulink.yy.com/duanpai?resid=${window.resid}&url=${encodeURIComponent(url)}&type=shortVideo`;
                } else {
                    /**调起狼人杀短视频 */
                    let schemeLink = `makefriends://Shenqu/TV/D/${window.resid}/${encodeURIComponent(url)}`;
                    let rslink = `//xh.yy.com/linkapp/duanpai?linkId=2&resid=${window.resid}&url=${encodeURIComponent(url)}&type=shortVideo&scheme=${encodeURIComponent(schemeLink)}`;
                    console.log(rslink);
                    window.location.href = rslink;
                }
                break;
            case 2:
                /**跳直播页 */
                if (window.edition == 1) {
                    /**调起手Y直播间 */
                    window.location.href = `//ulink.yy.com/channel/live?sid=${url}&ssid=${ssid}&type=room`;
                } else {
                    /**调起狼人杀直播间 */
                    let schemeLink = `makefriends://Channel/Live/${url}/${ssid}`;
                    window.location.href = `//ulink.yy.com/channel/live?linkId=2&sid=${url}&ssid=${ssid}&type=room&scheme=${encodeURIComponent(schemeLink)}`;
                }
                break;
            case 3:
                /**跳个人信息页H5 */
                if (window.edition == 1) {
                    /**调起手Y */
                    window.location.href = `//wap.yy.com/mobileweb/u/${url}#/duanpai`;
                } else {
                    /**调起狼人杀 */
                    //let schemeLink = `makefriends://PersonalCenter/${url}`;
                    //window.location.href = `//ulink.yy.com/PersonalCenter?linkId=2&uid=${url}&scheme=${encodeURIComponent(schemeLink)}`;
                }
                break;
            case 4:
                /** 调起神曲页面*/
                window.location.href = `http://wap.yy.com/shenqu/`;
                break;
            case 5:
                /**跳个人信息页app */
                if (window.edition == 1) {
                    /**调起手Y/UserInfo/UserInfoPage/ */
                    if(this.is_ios()){
                        window.location.href = `//ulink.yy.com/personalcenter?uid=${url}&type=userInfo&f=0&IOS=1`;
                    }else{
                        window.location.href = `//ulink.yy.com/personalcenter?uid=${url}&type=userInfo&f=0&IOS=0#!/index`;
                    }
                } else {
                    /**调起狼人杀 */
                    //let schemeLink = `makefriends://PersonalCenter/${url}`;
                    //window.location.href = `//ulink.yy.com/PersonalCenter?linkId=2&uid=${url}&scheme=${encodeURIComponent(schemeLink)}`;
                }
                break;
        }
    },
    setPageTitle: function(title) {
        document.setTitle = function(t) {
            document.title = t;
            var i = document.createElement('iframe');
            i.src = '//m.baidu.com/favicon.ico';
            i.style.display = 'none';
            i.onload = function() {
                setTimeout(function() {
                    i.remove();
                }, 9);
            };
            document.body.appendChild(i);
        };
        document.setTitle(title);
    },
    getURLParam: function(name, url) {
        var re = new RegExp("[\\?&#]" + name + "=([^&#]+)", "gi");
        var ma = (url || location.href).match(re);
        var strArr;
        if (ma && ma.length > 0) {
            strArr = (ma[ma.length - 1]);
            var _index = strArr.indexOf("=");
            return strArr.substring(_index + 1);
        }
        return '';
    },
    /**设置分享信息 */
    setShareApi: function(username, videoname, iconurl) {
        if (this.is_weixn()) {
            let shareUrl;
            try {
                let oldreSid = (window.location.href.match(/resid=(\d+)/, 'gi'))[1];
                shareUrl = (window.location.href).replace(oldreSid, window.resid);
            } catch (e) {
                console.error('err', e);
                shareUrl = window.location.href;
            }
            wechatShare({
                title:  `《${videoname}》YY神曲,最赞的音乐视听盛宴`,
                desc:   `${username}正在唱神曲《${videoname}》YY神曲,最赞的音乐视听盛宴` ,
                img: iconurl,
                link: shareUrl,
                success_callback: function(__platform) {

                },
                cancel_callback: function() {

                },
                debug: false
            });
        }
    },
    headerFilter: function(value) {
        let nowUrl = value;
        let dfValue = window.edition == 1 ? 'https://s1.yy.com/guild/header/10001.jpg' : 'https://res.yy.com/libs/dfimg/nobody.jpg';
        if (value && (value.indexOf('yyweb.yystatic.com') > 0 || value.match(/s\d.yy.com/) || value.match(/c\d.web.yy.com/))) {
            nowUrl = dfValue;
        } else if (value === '') {
            nowUrl = dfValue;
        }
        return nowUrl;
    },
    lauchApp: function(lauchData) {

    },
    setCookie: function(c_name, value, expiredays) {
        try {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            var domain = location.hostname;
            var path = location.pathname;
            document.cookie = c_name + "=" + escape(value) +
                ((expiredays === null) ? "" : ";domain=" + domain + ";path=" + path + ";expires=" + exdate.toGMTString());
        } catch (e) {
            console.error('setCookie e', e);
        }
    },
    getCookie: function(c_name) {
        var c_start = null,
            c_end = null;
        try {
            if (document.cookie && document.cookie.length > 0) {
                c_start = document.cookie.indexOf(c_name + "=");
                if (c_start != -1) {
                    c_start = c_start + c_name.length + 1;
                    c_end = document.cookie.indexOf(";", c_start);
                    if (c_end == -1) c_end = document.cookie.length;
                    return unescape(document.cookie.substring(c_start, c_end));
                }
            }
            return "";
        } catch (e) {
            console.error('getCookie e', e)
            return "";
        }
    },
    setHash: function(hashname) {
        console.log(hashname);
        if (history.pushState) {
            history.pushState(null, null, '#' + hashname);
        } else {
            location.hash = '#' + hashname;
        }
    },
    /**海度上报 */
    hiidoReport: function(acttype) {
        var hevent = new hiidoEvent('dwtinyvideo','20017905');
        hevent.setSys(5);
        hevent.setActtype(acttype);
        hevent.setUid(window.myuid);	//上报 uid 的接口，uid 用户标识，不调用则默认取 cookie:yyuid
        hevent.setImei(window.device && window.device.imei);	//imei 设备标识，若是app内嵌web则需调用
        hevent.setMac(window.device && window.device.getMac);	//mac 地址，若是app内嵌web则需调用
        hevent.setHdid(window.device && window.device.hdid);	//海度设备唯一标识，若是app内嵌web则需调用
        hevent.reportJudge();
    },
    /**是否显示页面底部 */
    ifShowFooter: function() {
        let videoMark = document.querySelector('.daycharts-title');
        let calculateBottom = videoMark.offsetTop - window.innerHeight;
        //console.log('ifShowFooter', calculateBottom, window.scrollY);
        if (calculateBottom >= window.scrollY) {
            return false;
        } else {
            return true;
        }
    },
    /**字符串替换插入 */
    replacePos: function(strObj, pos, replacetext) {
        var str = strObj.substr(0, pos - 1) + replacetext + strObj.substring(pos, strObj.length);
        return str;
    },
    /**数字前补0 */
    numberPreFix: function(num, len) {
        return Array(Math.abs(("" + num).length - ((len || 2) + 1))).join(0) + num;
    },
    /**获取0点时间 */
    getYMDate: function(timestamp) {
        var tmpDate = new Date(timestamp);
        return new Date(`${tmpDate.getFullYear()}/${tmpDate.getMonth()*1+1}/${tmpDate.getDate()} 00:00:00`);
    },
    /**数组倒序 */
    arrayReverse: function(arr) {
        var rsarr = [];
        if (arr && arr.length >= 1) {
            for (var n = arr.length - 1; n >= 0; n--) {
                rsarr.push(arr[n]);
            }
            //console.log('arrayReverse', arr, rsarr);
            return rsarr;
        } else {
            return [];
        }
    },
    formatSeconds: function(value) {
        //console.log(value);
        var theTime = parseInt(value); // 秒
        var theTime1 = 0; // 分
        var theTime2 = 0; // 小时
        var rs = {
            d: 0,
            h: 0,
            m: 0,
            s: 0
        }
        if (theTime >= 60) {
            theTime1 = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
            if (theTime1 >= 60) {
                theTime2 = parseInt(theTime1 / 60);
                theTime1 = parseInt(theTime1 % 60);
            }
        }
        rs.s = parseInt(theTime);
        if (theTime1 > 0) {
            rs.m = parseInt(theTime1);
        }
        if (theTime2 > 0) {
            rs.h = parseInt(theTime2);
        } else if (theTime2 > 0 && theTime2 >= 24) {
            //console.log(theTime2);
            rs.d = parseInt(theTime2 / 24);
            rs.h = parseInt(theTime2 % 24);
        }
        return `<span>${this.numberPreFix(rs.h,2)}</span>:<span>${this.numberPreFix(rs.m,2)}</span>:<span>${this.numberPreFix(rs.s,2)}</span>`;
    },
    goTimeout: function(timeOutDate, showObj, cb) {
        clearInterval(window.timer);
        var self = this;
        var timeoutfun = function() {
            var restNow = parseInt((timeOutDate - new Date() * 1) / 1000);
            if (restNow < 0) {
                restNow = 0;
                clearInterval(window.timer);
                cb && cb();
            } else {
                showObj.html(self.formatSeconds(restNow));
            }
        }
        timeoutfun();
        window.timer = setInterval(function() {
            timeoutfun();
        }, 1000)
    },
    contains: function(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    },
    timeStampFormat: function(timestamp, type) {
        let tmp_date = new Date(timestamp * 1000);
        if (!timestamp) {
            return 'timeout';
        }
        if (isNaN(timestamp)) {
            return timestamp;
        }
        if (type == 1) {
            return `${tmp_date.getFullYear()}-${tmp_date.getMonth()*1 +1}-${tmp_date.getDate()} ${tmp_date.getHours()}:${tmp_date.getMinutes()}`;
        }
    },
    format_number: function(num) {
        var result = '',
            counter = 0;
        num += 10000000;
        num = (num || 0).toString();
        for (var i = num.length - 1; i >= 0; i--) {
            counter++;
            result = num.charAt(i) + result;
            if (!(counter % 3) && i != 0) {
                result = ',' + result;
            }
        }
        result = result.substring(1);
        //console.log('result', result);
        return result;
    },
    is_weixn: function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    },
    is_andriod4: function() {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android 4') > -1;
        return isAndroid;
    },
    is_ios: function() {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        return isiOS;
    },
    is_shouY: function() {
        var u = navigator.userAgent;
        var isYY = !!u.match(/YY\/6/);
        if (!isYY) {
            isYY = !!u.match(/YY\(ClientVersion:yymand/);
        }
        return isYY;
    },
    is_tinyVideo: function(){
        var u = navigator.userAgent;
        return !!u.match(/[^a-zA-Z]YY[^a-zA-Z]/);
    },
    /**设置分享信息 */
    setShareApi: function(iconurl) {
        if (this.is_weixn()) {
            let shareUrl;
            shareUrl = window.location.href;
            wechatShare({
                title: '萌新欢迎礼',
                desc: '分享即可抽奖，ipad、iphone8、自拍杆、拍立得，等大奖等你拿',
                img: iconurl,
                link: shareUrl,
                success_callback: function(__platform) {

                },
                cancel_callback: function() {
                },
                debug: false
            });
        }
    },
    /**获取ios版本号 */
    get_ios_version: function(){
        var appVersion = window.navigator.appVersion;
        var rsarr = appVersion.match(/.+OS (\d+)_(\d+)/, 'gi');
        return rsarr[1];
    },
    /**判断是否支持TBS */
    is_TBS: function() {
        var u = navigator.userAgent;
        var tmpArr = u.match(/.+TBS\/(\w+) Safari\/(\w+)/, 'gi');
        if (tmpArr && tmpArr[1] > 36849) {
            return true;
        }
        tmpArr = u.match(/.+MQQBrowser\/(\w+\.\w+)/, 'gi');
        if (tmpArr && tmpArr[1] * 100 >= 710) {
            return true;
        }
        return false;
    },
    /**删除数组中某个元素 */
    arrayRemove: function(arr, val) {
        for (var n in arr) {
            //console.log(arr[n], val);
            if (arr[n] == val) {
                arr.splice(n, 1);
                break;
            }
        }
        return arr;
    },
    /** 添加排名字段 */
    getRankNumber: function(list, myInfo){
        var startIndex = 0;
        list.forEach(function(item, index){
            if(index === 0) {
                item.idx = 1;
                (item.uid == myuid) && (myInfo.idx = item.idx);
                return;
            }
            var prevItem = list[index - 1];
            if(item.score === prevItem.score && item.combo === prevItem.combo) {
                item.idx = prevItem.idx;
                (item.uid == myuid) && (myInfo.idx = item.idx);
            } else {
                item.idx = index + 1;
                (item.uid == myuid) && (myInfo.idx = item.idx);
            }
        });
    },
    /** 对象转数组 */
    ObjectToArray: function(obj){
        var array = [];
        for(var key in obj) {
            if(obj.hasOwnProperty(key)) {
                array.push(obj[key]);
            }
        }
        return array;
    },
    /**polyfill AOP*/
    polyfillAOP: function(){
        if(Function.prototype.after || Function.prototype.before) {
            return;
        }
        Function.prototype.after = function(func){
            var origin = this;
            return function(){
                var res = origin.call(this);
                func.call(this);
                return res;
            }
        }

        Function.prototype.before = function(func){
            var origin = this;
            return function(){
                func.call(this);
                var res = origin.call();
                return res;
            }
        }
    }
}
