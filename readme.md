# web安全之XSS

---

## 1. XSS原理简介

XSS（Cross Site Scripting）跨站脚本漏洞是一种将恶意 JavaScript 代码插入到其他Web用户页面里执行以达到攻击目的的漏洞。Web应用软件将用户的交互信息没有作有效验证和过滤就输出给了其他用户，攻击者插入的可执行脚本就可能形成跨站脚本攻击。

**根本原因**：数据与代码未做分离；

**危害**：

* 盗取cookie
* 账户劫持
* 读取、篡改、添加或删除敏感数据
* DDos攻击
* 引发页面布局错乱
* ...

## 2. 产生场景

肉眼看得到，看不到的用户输入（如某些Flash XSS需要抓包才可以看到接口）都有可能成为XSS漏洞的切入点。

1. 在用户可控的输入点（例如写评论、发布文章）等，数据入库前没有做验证和相关的安全过滤；
2. 在未检验包含数据的动态内容是否存在恶意代码的情况下，便将其传送给用户；

![xss-example](https://cloud.githubusercontent.com/assets/1295348/9469494/f0c7a24e-4b79-11e5-8a68-36ab3db50a43.png)

## 3. XSS类型

常见的，XSS攻击会被分为反射型XSS（Reflected）、储存型XSS（Stored）和DOM-based XSS。

**反射型XSS**

输入→输出。大部分**通过url传入参数或DOM的某些属性控制页面的输出**，常见出现在GET请求上；


**储存型XSS**

输入→进入数据库→取出数据库→输出。用户产生的带有恶意代码的数据存入数据库后，再取出来使用，导致XSS；所以这种恶意攻击可以在网站任何地方出现，并且如果不及时移除，攻击会一直持续下去；


**DOM-based XSS**

反射与存储型都是服务端接收到用户输入的恶意数据然后嵌入到HTML页面产生的，而我们将不依赖于服务端嵌入的XSS攻击叫做DOM-Based XSS，实质上也是反射型的一种。


## 4. 攻防策略

**原则：永远不要相信用户的输入！**


### 4.1 慎用innerHTML

很多前端工程师很喜欢用`innerHTML`或者某些库类例如jQuery里面的`html()`等方法，因为可以快速构建DOM，但却对其背后隐藏的潜在危险毫无所知。通过`innerHTML`产生的脚本是不会执行的，如果你以为`innerHTML`很安全那就错了，请看下面例子：

```javascript
wrap.innerHTML = '<img src=1 onerror=alert(1)>'
```
注入可运行的脚本，不一定要用`<script>...</script>`插入的方式，在很多标签属性上都是可以被利用的。


### 4.2 慎用eval/setTimeout/Interval/Function

我们经常听到`eval`是魔鬼，他容易引起XSS攻击。`eval`方法接受任意字符串，并当做JavaScript代码来执行。如果你需要读取解析json，请使用浏览器内置`JSON`对象或者来自JSON.org的库。

实际上我们更担心的是`setTimeout()`与`Interval()`，这俩方法使用频率会相对更高。同样，`setTimeout()`与`Interval()`的第一个参数会将字符串作为脚本来执行：

```javascript
var keyword = document.getElementById("keyword"); 
var value = keyword.value;
var jump = "window.location.href ='http://www.example.com/?" + value + "&buy=1";

setTimeout(jump, 3000);
```

上面例子中，`value`是来自于url中的参数，构造一下：

```
a'.replace(/.%2B/,/javascript:alert(1)/.source)//
```

![3409583406](https://cloud.githubusercontent.com/assets/1295348/9561573/4db3a68c-4e7d-11e5-9b05-e4a967d522f3.png)


所以，请避免对`setTimeout()`与`Interval()`直接传入字符串！更好的做法是传入一个function：

```javascript
setTimeout(function(){
    window.location.href ='http://www.example.com/?' + value;
}, 3000);
```

### 4.3 慎用内联

一般情况下，过滤掉尖括号、引号（单、双）、"&"符号是可以防止了大部分XSS漏洞，提高了攻击的门槛，但单独针对HTML进行过滤也是不全面的。

#### 4.3.1 内联脚本

请看例子,假设有个搜索页面，先输入关键词`<google00000000/>`测试一下：

```
http://example.com/search?key=<google00000000/>
```

源码大致如下：

```php

<input id="keyword" type="text" value="&lt;google00000000&#x2F;&gt;" />
<div id="result"></div>

 <script>
var keyword = document.getElementById("keyword"); 
var result = document.getElementById("result");

result.innerHTML = keyword.value;

...

// function filter(){
//     ...
//     
//     console.log(&lt;google00000000&#x2F;&gt;);
//     ...
// }
...

</script>
```

我们可以看到程序已经进行了对html进行了escape过滤，对`<`、`>`、`"`、`'`与`&`进行了转码，这样就安全了吗？显然不是，仔细看源码，发现了有动态的Querystring被注释了，于是对构造稍作修改：

```
http://example.com/search?key=%0a;alert(1);//
```

成功执行`alert(1)`！

![804b363ab629e7](https://cloud.githubusercontent.com/assets/1295348/9541550/f271ff12-4d9b-11e5-804b-363ab629e7cd.png)


其要点在`%0a`，这是经过`encodeURI('\n')`编码之后的换行符。

#### 4.3.2 内联样式

我们再来看看内联样式的情况。

常见的可以被利用的场景都是在脚本之中，不过真的是只有脚本吗？仔细想想，CSS样式中有没有可以被利用的地方...

有两种情况你不能忽略：

1. 有url远程路径的地方（公大多数浏览器，因版本而异）；
2. expression表达式（IE）；

实质上，无论是CSS还是HTML，凡是有url远程路径的地方都可以被加以邪恶的利用：

```html
/************** url远程路径 **************/
<style>
body {background-image:url("javascript:alert('XSS')");}
div {behavior: url(xxx/xxxxx.htc);}
@font-face {
    src: url("../font/xxx.eot");
}
</style>


/************** expression **************/
<div style=width:expression(alert(0))>xss</div>
```

对于内联CSS中的url远程路径，请确保是以`http://`开始的，而不是`javascript`等；

通过过滤`expression`关键字来进行防御确实是一个不错的方法，但也不是绝对安全的，如果你的网页没设置doctype，IE浏览器处于quirks mode模式，悲剧来了：

```html
<div style="font-family:a/**/ression(alert(1))('\')exp\')">xss</div>
```

详见[IE CSS解析问题可致新的XSS Vectors](http://www.wooyun.org/bugs/wooyun-2010-068564)


由此可见，如果我们的脚本或是动态内联的话，代码即使经过escape，即使被注释了也不一定安全！关键还是要认识到XSS破坏的本质是JS构造，而不是HTML构造，例如换行、注释（`//`、`/*/`）、引号等。


### 4.4 注意base64编码

在说base64之前，我们先来了解一下data URIs，它是由[RFC 2397](http://tools.ietf.org/html/rfc2397)定义, 允许将一个小文件进行编码后嵌入到另外一个文档里。其语法结构如下：

```
data:[<mediatype>][;base64],<data>
```

mediatype是一种MIME类型字符串，默认值为`text/plain`，当设置为`text/html`时，表示HTML文档源码，这就意味着可以执行JavaScript代码。我们将`<img src=1 onerror=alert('xxs')>`转成base64，变成`PGltZyBzcmM9MSBvbmVycm9yPWFsZXJ0KCd4c3MnKT4==`，于是：

```javascript
var weiboLink = 'data:text/html;base64, PGltZyBzcmM9MSBvbmVycm9yPWFsZXJ0KCd4c3MnKT4==';
weiboLink = escapeHtml(weiboLink);
console.log(weiboLink);
document.getElementById('weibo').href = weiboLink;
```

![5045](https://cloud.githubusercontent.com/assets/1295348/9540984/9682ce0c-4d96-11e5-9ef0-066652e45438.png)

**解决方案**：过滤斜杠`/`


### 4.5 escape解决方案

由上面的例子我们可以了解到，客户端与服务器端通讯一般通过`Querystring`、`from表单`和`cookie`，这些场景中取到数据，在储存进入数据库以及展示在客户端之前，都应该先对数据进行`escape`或`encode`，最起码需要对以下几个字符进行编码：

`<` → `&lt;`<br>
`>` → `&gt;`<br>
`"` → `&quot;`<br>
`'` → `&#x27;`<br>
`&` → `&amp;`<br>
`/` → `&#x2F;`

HTML escape包含两部分：

1. HTML Element Content escape；对HTML内容进行编码，例如：`<div class="content">...不信任的数据内容...</div>`；
2. HTML Common Attributes escape；对HTML标签属性值进行编码，例如：`<a href="...不信任的数据内容...">链接</a>`；

以下是几种净化解决方案：

#### 4.5.1 escapeHTML


```javascript
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/\//g, "&#x2F;")
}
```
这个escape能正常的匹配返回正确的结果。但我们可以发现每执行一次就对传入的字符串扫描了6次，效率比较低。下面是一个来自于
[Mustache模板](https://github.com/janl/mustache.js/blob/master/mustache.js#L60) 的escape，稍作改动：

```javascript
function escapeHtml(str){
    var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;'
    };
    return String(str).replace(/[&<>"'\/]/g, function(s) {
        return entityMap[s];
    });
}
```

网上还流传着一些利用`element.textContent`或者`element.createTextNode`自身特性去过滤HTML标签的方法，例如这篇：[Foolproof HTML escaping in Javascript](http://shebang.brandonmintern.com/foolproof-html-escaping-in-javascript/)，作者认为这是效率最高的一种方法。实际上这是既粗暴而又不全面的，过滤的规则难以把控，例如斜杠`/`与引号(包括单引号、双引号)都没有进行过滤。

此外，我们需要了解的是，它依赖于所创建的标签，请看下面例子：

```javascript
var tag = document.createElement('script');
var data = 'alert(1)';
tag.appendChild( document.createTextNode(data) );
document.body.appendChild(tag);
```

成功执行了`alert(1)`；所以，不推荐使用！

stackoverflow上针对escapeHtml有比较多的解决方案，有兴趣的童鞋可了解→[Escaping HTML strings with jQuery](http://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery)

#### 4.5.2 开源库

以上两种都只是做或简单或粗暴的escape，如果你希望能更全面、灵活的订制过滤规则，那可以使用一些开源库来解决：

**[XSS.js](http://jsxss.com/zh/index.html)** 是一个根据白名单对用户输入的内容进行过滤，以避免遭受XSS攻击的模块。白名单控制允许的HTML标签及各标签的属性，通过自定义处理函数，可对任意标签及其属性进行处理。提供了node版本和浏览器版本的js；

**[Rickdom.js](https://github.com/hasegawayosuke/rickdom)** is a javascript library to build DOM elements from string using DOMParser API or createHTMLDocument API of modern browsers；

**[OWASP ESAPI](http://www.owasp.org.cn/owasp-project/ESAPI)** (OWASP企业安全应用程序接口)是一个免费、开源的、网页应用程序安全控件库，用于验证用户输入的富文本以防御跨站脚本的API。适用于java编写web项目；

**[PHP AntiXSS](https://github.com/voku/anti-xss)** 一个不错的PHP库，容易上手；

**[AntiXSS Library](http://www.microsoft.com/en-us/download/details.aspx?id=28589)** 微软出的一个防跨站点脚本库。

----

**小结：如果可以，请尽量使用动态创建节点的方法，例如createElment等，请谨慎使用以下DOM构建方法：**

```javascript
element.innerHTML = '';
element.outerHTML = '';
document.write();
document.writeln();
```

----

### 4.6 CSP

CSP是Content Security Policy的简称，可译为内容安全策略，由W3C 的 webappsec ＷＧ(work group)制定的，用于减少或避免XSS及其带来的风险。通过定义`Content-Security-Policy`HTTP Header来创建一个可信来源的白名单（脚本、图片、iframe、style、font等可能远程的资源），让浏览器只执行和渲染白名单中的资源。

CSP可以由两种方式指定：HTTP Header和HTML Meta，如果两种同时存在，则会优先采用HTTP Header中定义的规则；

CSP默认特性：

* 禁止内联代码执行，包括`<script>代码块`、内联事件、内联样式；
* 禁用`eval()`、`newFunction()`、`setTimeout([string],...)`、`setInterval([string],..)`

**相关链接**：

* [http://www.w3.org/TR/2015/CR-CSP2-20150219/](http://www.w3.org/TR/2015/CR-CSP2-20150219/) （2015-02-19，CSP2标准正式发布）
* [https://playsecurity.org/rawfile/csp2_test.html](https://playsecurity.org/rawfile/csp2_test.html) （CSP2演示例子）
* [http://netsecurity.51cto.com/art/201404/436296_all.htm](http://netsecurity.51cto.com/art/201404/436296_all.htm)（浏览器安全策略说之内容安全策略CSP）
* [http://www.cnblogs.com/softlover/articles/2723233.html](http://www.cnblogs.com/softlover/articles/2723233.html)（HTML5安全：内容安全策略（CSP）简介）


### 4.7 JSON数据的Response头部

服务端向客户端发送JSON数据，Response 头部contentType建议设置为`application/json`；避免contentType未设置或者设置为`text/html`；

### 4.8 重要的cookie设置HttpOnly Cookie

cookie大家是常用到了，但HttpOnly可能并不常接触。通常我们有以下几种方式给客户端设置或获取cookie：

* HTTP Response Headers中的Set-Cookie Header；
* HTTP Request Headers中的Cookie Header；
* JavaScript对document.cookie进行赋值或取值；

下面是一个标准的Set-Cookie Header：

```
Set-Cookie: key=value; path=path; domain=domain; max-age=max-age-in-seconds; expires=date-in-GMTString-format; secure; httponly
```

设置了`httponly`为`true`之后，浏览器的document对象就无法读取到到cookie信息。所以针对重要的敏感cookie设置`httponly`能有效的防止黑客通过HTTP协议来读取cookie。但黑客也不是傻的，他们可以跳过HTTP协议，在socket层面写抓包程序进行其他的攻击，这个就不在本文讨论的范围了。

另外，Set-Cookie Header属性中还有个`secure`，这个是什么用呢？防止信息在传递过程中被监听捕获，导致信息泄露。当`secure`设置为`true`时，创建的cookie就只能在HTTPS链接中被客户端传递到服务器端进行会话验证；HTTP链接中则不会传递。
PS：除了httponly，还有个HostOnly Cookie，有兴趣的童鞋可自行了解。

### 4.9 使用带有escape功能的前端模板

很多前端模板都自带有escape功能，例如[Mustache](http://mustache.github.io/)、[Handlebars](http://handlebarsjs.com/)等，如果项目场景合适的话，可以考虑使用一款合适的前端模板。


### 4.10 浏览器中的XSS过滤器

随着XSS逐渐被工程师所注意，很多浏览器厂商对XSS攻击做了防御措施，在浏览器安全机制中过滤XSS。例如：IE8+、chrome、safari、firefox都有针对XSS的安全机制。但每个浏览器版本的过滤机制可能会不一样，在低版本的chrome/safari/firefox中的XSS防御相对薄弱，IE6/IE7甚至没有这方面的安全机制。

所以，如果需要做测试，最好使用低版本浏览器。

---

** 总结**：只要是人为干涉的事情就可能会产生bug，对与XSS漏洞，没有一劳永逸的解决方法，每个场景所需要`escape`的方式不一样，具体场景具体应对。密切关注与服务器端有通讯的地方，多积累经验，谨慎对待通讯。

---


## 5. 其他类型XSS

### 5.1 mXSS

一般的xss只需要一次innerHTML进出即可触发，但我们可以构造一种特殊的代码，在第一次DOM输出时会巧妙的绕过XSS过滤，经过两次DOM输出之后才触发的xss，这种xss叫mXSS（Mutation-based XSS），也叫突变XSS；

![2014022300151189780](https://cloud.githubusercontent.com/assets/1295348/9560711/2d1238d8-4e57-11e5-8679-de282b9403a2.jpg)

图片来源：[wooyun](http://drops.wooyun.org/tips/956)

更详细的解读和例子：

* [mXSS攻击的成因及常见种类](http://drops.wooyun.org/tips/956)
* [QQ空间某功能缺陷导致日志存储型XSS - 15](http://www.wooyun.org/bugs/wooyun-2014-051536)

### 5.2 uXSS

Uxss(Universal Cross-Site Scripting通用型XSS)UXSS是一种利用浏览器或者浏览器扩展漏洞来制造产生XSS的条件并执行代码的一种攻击类型。可以到达浏览器全局远程执行命令、绕过同源策略、窃取用户资料以及劫持用户的严重危害。

更详细的介绍：[通用跨站脚本攻击(UXSS)](https://www.91ri.org/10665.html)


## 6. XSS漏洞测试

### 6.1 代码检测

根据客户端与服务器端通讯的`Querystring`、`from表单`和`cookie`等，查找关键的变量，如PHP中：

```php
<?php

// $key = htmlspecialchars($_GET["key"]);
$key = $_GET["key"];

?>
```

如果变量没经过`htmlspecialchars`处理，那么这个变量就存在xss漏洞。

### 6.2 手动输入

**基本思路**：寻找可能的输入点，发送恶意输入，看程序是否返回异常结果

**可能的输入点**

* url中的参数
* form表单
* cookie
* http头中可控的部分
* 数据库
* 配置文件
* 其他可以被用户控制输入的地方

### 6.3 自动化测试

* [Xenotix XSS](http://xenotix.in/) 是一款用于检测和利用WEB应用程序中的XSS漏洞的渗透测试框架，其中包括xss漏洞挖掘及利用的各种小工具；
* [xssValidator](https://github.com/nVisium/xssValidator) 是一个自动验证 XSS 安全漏洞的工具；
* 阿里云的 [Hitest服务测试](http://sts.aliyun.com/index.html)
* 360的 [网站安全测试](http://webscan.360.cn/)



## 7. 扩展阅读

* [http://html5sec.org/](http://html5sec.org/)（HTML5 Security Cheatsheet）
* [XSS (Cross Site Scripting) Prevention Cheat Sheet](https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet)（XSS防护检查单）
