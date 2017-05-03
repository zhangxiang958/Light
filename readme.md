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
import Util form './Blade.js';

Util.getBrowerInfor();

//是否是移动端
Util.isMobile();
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
```
Util.addHandler('click', ele, callback, true);
```

移除事件
```
Util.removeHandler('click', ele, callback);
```

函数节流
```
import Util form './Blade.js';

Util.throttle(this, callback, [arg1, arg2], 500, 2000);
```
函数去抖
```
import Util form './Blade.js';

Util.debounce(this, callback, [arg1, arg2, agr3], 500, false);
```



