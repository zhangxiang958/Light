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




