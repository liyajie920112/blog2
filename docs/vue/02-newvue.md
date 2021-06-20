---
title: new Vue发生了什么事情
tags:
  - vue
---

:::warning 疑问
为什么`mounted()` 方法中通过`this.属性名`就可以获取到`data`里面的属性, 既然this可以取到这个属性, 说明this上也有这个属性,他是怎么做到的呢
:::

1. `new Vue()`干了哪些事情

Vue的本质就是一个`function`
```js
// instance/index.js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // new Vue的时候执行_init
  this._init(options)
}
```

2. 构造函数中执行了`this._init(options)`, _init()是通过`initMixin()`在`Vue.prototype`上添加了`_init(...)`

3. `_init()`

```js
Vue.prototype._init = function (options) {
  ...
  // expose real self
  vm._self = vm
  initLifecycle(vm) // 初始化生命周期
  initEvents(vm) // 初始化事件
  initRender(vm) // 初始化渲染相关
  callHook(vm, 'beforeCreate') // 执行beforeCreate钩子函数
  initInjections(vm) // resolve injections before data/props
  initState(vm) // initState就是处理data中的数据
  initProvide(vm) // resolve provide after data/props
  callHook(vm, 'created') // 执行created钩子函数

  ...
}
```
4. 针对上面提出的疑问, 那么主要看下`initState(vm)`

主要看下`initData(vm)`
```js
export function initState (vm: Component) {
  ...
  if (opts.data) {
    initData(vm) // 初始化data
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  ...
}
```

5. `initData(vm)`

先获取到data的这个对象, 然后再通过proxy来代理取值和赋值

```js
function initData (vm: Component) {
  ...
  let data = vm.$options.data
  // 先获取到 data, 并且给vm添加一个_data属性
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  const keys = Object.keys(data) // 获取到data对象的属性名称 - 数组
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    ...
    proxy(vm, `_data`, key) // 这句话是关键, 做了一层代理
  }
  ...
}
```

6. `proxy()`, 相当于`this.a = 123`实际取的是`this._data.a = 123`

```js
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}
// 通过proxy来给vm声明一个和data中属性相同的对象, 因为是Object.defineProperty创建的, 所以可以拦截到取值和赋值, 在取值的时候就通过get来间接获取到_data上的属性
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  // target就是vm, 这句话就是把key挂载到vm上, vm.key 则回去调用sharedPropertyDefinition.get, 这样最终执行的就是vm._data.key
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```





