---
title: vm.$mount的执行
tags:
  - vue
---

## vm.$mount的执行流程

1. 在`_init()`后面最终执行了`vm.$mount(vm.$options.el)`

```js
if (vm.$options.el) {
  vm.$mount(vm.$options.el)
}
```

2. 查找`$mount`声明位置

两个地方: 1. runtime/index.js中, 2. entry-runtime-with-compiler.js中

// entry-runtime-with-compiler.js
```js
const mount = Vue.prototype.$mount // 缓存了runtime/index.js中的Vue.prototype.$mount方法

// 执行$mount的时候是执行的这个方法, 因为我们看的是compiler版本
// 这个方法是给runtime-compiler用的, 最终生成render函数
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el) // document.querySelector 只是兼容了选择器和dom元素
  ...
  // 这里执行的就是runtime/index.js中的方法
  return mount.call(this, el, hydrating)
}
```

3. `runtime/index.js`的`$mount`

```js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}

```
`mountComponent`在`lifecycle.js`中定义了


→ 判断是否有render


→ 声明`updateComponent`

```js
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
```

→ 执行`new Watcher()`

```js
new Watcher(vm, updateComponent, noop, { // 渲染Watcher, 观察者模式
  before () {
    if (vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'beforeUpdate')
    }
  }
}, true /* isRenderWatcher */)
```

→ new Watcher()的构造函数中执行了一次this.get, 最终执行了`updateComponent`, 里面执行了`vm._update()`和`vm._render()`, 实现了dom的挂载

→ 最终返回了vm
