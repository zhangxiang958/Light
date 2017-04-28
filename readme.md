# Blade --- a little Util library for mobile FE developer

---

## Usage
Blade is based on navie Javscript, so you can use it in two way:
```
<script src="./Blade.js"></script>

or

import Util form './Blade.js';
```

## Method
获取数据类型
```
import Util form './Blade.js';

var data = {}; // [], 123, 'test'....

console.log(Util.getDataType(data));  //Object, Array, String, Number, null, undefinded
```
检测浏览器，脚本运行环境
```

```
获取元素大小
```
import Util form './Blade.js';

console.log(Util.getDOMSize(ele));
```
获取元素位置
```
import Util form './Blade.js';

console.log(Util.getDOMPosition(ele));
```

绑定事件
···
Util.addHandler('click', ele, callback, true);
···

移除事件
···
Util.removeHandler('click', ele, callback);
···

函数节流
```

```
函数去抖
```
import Util form './Blade.js';

Util.debounce(fn, 100, true);
```




构建功能：
html 压缩
css：
使用 less、sass
autoprefixer
pxtorem
css 压缩
图片：
base64（限制多大以下使用 base64）

js:
webpack
ESLint
Babel

rev:(使用 gulp-rev-all)
md5 hash


对于 vue， react 等这些库使用 vendor


前端性能指标Q2计划

Q2最低目标暂定为完善性能数据统计，能够根据数据分析出性能瓶颈点

指标：


白屏时间；
首屏时间；
用户可操作时间(即dom ready)；
资源总下载时间；
DNS解析时间；
TCP连接时间；
HTTP请求时间；
HTTP响应时间；
css渲染时间；
Javascript执行时间;


主要关注指标为：白屏时间、首屏时间、用户可操作时间、总下载时间

需要做的工作：



Navigation Timing API
Resource Timing API
Performance API
以上三个api的研究使用；
既有监控平台的利用以及分析。
前端页面打点
首屏时间的计算代码


监控方式：




类型
优点
缺点




非侵入式
指标齐全、客户端主动监测、竞品监控
无法知道性能影响用户数、采样少容易失真、无法监控复杂应用与细分功能


侵入式
真实海量用户数据、能监控复杂应用与业务功能、用户点击与区域渲染
需插入脚本统计、网络指标不全、无法监控竞品




现有统计来源有两个：



web质量管理平台 （侵入式）

海度统计（侵入式）

海猫查询数据（主要用于海度统计后的数据查询）


其中质量管理平台的数据统计比较全面，不过部分统计的具体统计方式未可知，需调研，确定统计方式是否合适，且缺乏浏览器版本统计。


其他检测平台：


 oneapm （收费，侵入式）
 性能魔方（收费，非侵入式，感觉免费版够用了）
 webpagetest（免费，非侵入式）



性能分析工具 (可作为性能点瓶颈分析工具，本地环境)


 Page Speed

 Yslow

 chrome调试器
 webwatch

 httpwatch 适用于分析IE浏览器的性能
 fiddler


