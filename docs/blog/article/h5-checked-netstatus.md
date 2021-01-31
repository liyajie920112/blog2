---
author: LiYajie
tags:
  - h5
  - js
---

# h5判断网络状态

## h5获取在线/离线状态

```js
if (navigator.onLine) {
  alert('有网了')
} else {
  alert('断网了')
}
```
<!-- more -->

## h5添加监听网络变化

```js
function checkedNet () {
  const el = document.body
  if (el.addEventListener) {
    window.addEventListener('online', function () {
      alert('来网了')
    }, true)
    window.addEventListener('offline', function () {
      alert('没网了')
    }, true)
  }
  else if (el.attachEvent) {
    window.attachEvent('ononline', function () {
      alert('来网了')
    })
    window.attachEvent("onoffline", function () {
      alert('没网了')
    })
  }
  else {
    window.ononline = function () {
      alert('来网了')
    };
    window.onoffline = function () {
      alert('没网了')
    }
  }
}
```

## h5获取网络类型

:::warning 警告
该方法只是实验性功能
:::

```js
const netWorkInformation = navigator.connection // readonly
```
### netWorkInformation.type的取值
- bluetooth
- cellular
- ethernet
- none
- wifi
- wimax
- other
- unknown

## 参考

- [参考1](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/connection)
- [参考2](https://developer.mozilla.org/zh-CN/docs/Web/API/NetworkInformation)
