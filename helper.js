/* eslint-disable */
import yyApi from './yyApi.js';
export default {
    getParam(key) {
        const result = new RegExp(`${key}=([^&]*)`, 'i').exec(window.location.search);
        return (result && decodeURI(result[1])) || '';
    },
    createLoginIframe(ticket, success, fail) {
        console.log('enter loginframe');
        const apiUrl = 'https://lgn.yy.com/lgn/jump/authentication.do';
        const curPath = location.pathname.substring(0, location.pathname.lastIndexOf('/'));
        const busiUrl = encodeURIComponent(`${location.protocol}//${location.host}${curPath}/loginsuccess.html`);
        const paramObj = {
            action: 'authenticate',
            appid: '5060',
            direct: '1',
            busiUrl,
            src: '1',
            reqDomainList: 'lgn.yy.com',
            ticket,
        };
        const paramArr = [];
        Object.keys(paramObj).forEach((key) => {
            paramArr.push(`${key}=${paramObj[key]}`);
        });
        const paramStr = paramArr.join('&');
        const ifrm = document.createElement('iframe');
        ifrm.style.display = 'none';
        ifrm.frameBorder = 0;
        document.body.appendChild(ifrm);
        window.setTimeout(() => {
            console.log(`${apiUrl}?${paramStr}`);
            ifrm.src = `${apiUrl}?${paramStr}`;
        }, 0);
        console.log('before onload');
        ifrm.onload = function () {
            console.log('enter onload');
        if (typeof success === 'function') {
            console.log('before callback');
            success();
        }
        };
        ifrm.onerror = function () {
        if (typeof fail === 'function') {
            fail();
        }
        };
    },
    login(success, fail) {
        yyApi.webTicket()
            .then((webticket) => {
                const ticket = webticket;
                console.log('ticket' + ticket);
                if (ticket) {
                    this.createLoginIframe(ticket, success, fail);
                } else if (typeof fail === 'function') fail();
            });
    },
};
