---
title: 前端自省手册
publish: 1
tags:
  - 面试
---

## 计算机基础


### 基本数据结构
 - 数组
 - 队列和栈
 - 链表
 - 二叉树
 - hash
 - 堆
### 常见的算法
 - DFS
 - BFS
 - 滑动窗口（双指针）
 - 回溯
 - 动态规划
 - 贪心（其实动态规划可以解决）
 - 排序
 - 二分查找

> 相关资料：
> - [JavaScript版 数据结构与算法](https://github.com/trekhleb/javascript-algorithms/blob/master/README.zh-CN.md)，这个适合新人学习，入门基本。
> - 极客时间- 数据结构与算法之美 在有基础上看这个会更好，里面github有js实现方式，自己动手敲一遍
> - 极客时间- 算法面试通关 40 讲这门课真的是好，里面都是高频经典的题目。
> - [leetcode 字节跳动专栏](https://leetcode-cn.com/explore/interview/card/bytedance/)
> - [leetcode 剑指 offer](https://leetcode-cn.com/problemset/lcof/)

> blog：
> - [awesome-coding-js用 JavaScript 实现的算法和数据结构](https://github.com/ConardLi/awesome-coding-js)
> - [labuladong这个动态规范讲得真的好](https://labuladong.gitbook.io/algo/)
> - [YaxeZhang/Just-Code针对面试训练算法题， 目前包括字节跳动面试题、 LeetCode 和剑指 offer](https://github.com/YaxeZhang/Just-Code)

## 网络
对于前端来说，http，http2，https 的握手是高频题，要主要复习。
- 极客时间-透视 HTTP 协议HTTP 作为前端最经常接触而且相对独立，可以先学习这个，再学期其他层。
- 极客时间-趣谈网络协议作者生动用例子解释网络各层的作用和他们之间的关系，在此形成一个整体的架空，方便后面细节的学习
- 极客时间 - Web 协议详解与抓包实战。这门课从高层到底层，讲解每一层的细节，由于里面讲解很详细也有很多理论知识，如 RSA 算法、基于椭圆曲线的 ECDH 算法等等可以考虑跳过


## 前端基础-JS
以下必须十分熟悉
- 类型，涉及以下：
  - 类型种类
  - 判断
  - 转换
  - 深度拷贝
- 闭包：
  - 作用域
  - v8 垃圾回收
  - 变量提升
- 异步：
  - Promise的历史，用法，简单手写Promise实现
  - async await 原理，generator
  - 宏任务与微任务区别
- 原型链：
  - `prototype` 和 `__proto__`
  - 继承
  - oop 编程思想
- 模块化
  - CommonJS 和 ES6 module
- ES6 特性
  - let const
  - 箭头函数
  - Set、Map、WeakSet、WeakMap
  - 之前提及的Promise，async，Class，ES6 module
  
> 书籍：
> - [《JavaScript高级程序(第三版)》](https://zhaohd.gitee.io/pro-js/#/)
> - [《你不知道的JavaScript(上)》](https://github.com/getify/You-Dont-Know-JS)
> - 《JavaScript 忍者秘籍》（一定要买第二版）
> - [《阮一峰 ES6入门》](https://es6.ruanyifeng.com/)

> BLOG:
> - [前端进阶之道](https://www.yuchengkai.cn/)
> - [前端面试与进阶指南](https://zhuanlan.zhihu.com/p/38931354)
> - [ConardLi 的 blog](https://github.com/ConardLi/ConardLi.github.io)
> - [木易杨前端进阶](https://muyiy.cn/)
> - [FE-Interview](https://github.com/haizlin/fe-interview)
> - [冴羽的博客](https://github.com/mqyqingfeng/Blog)

> 掘金好文章：
> - [(1.6w字)浏览器与前端性能灵魂之问，请问你能接得住几个？（上）](https://juejin.im/post/5df5bcea6fb9a016091def69)
> - [(建议收藏)原生JS灵魂之问, 请问你能接得住几个？(上)](https://juejin.im/post/5dac5d82e51d45249850cd20)
> - [(建议精读)原生JS灵魂之问(中)，检验自己是否真的熟悉JavaScript？](https://juejin.im/post/5dbebbfa51882524c507fddb)
> - [(2.4w字,建议收藏)😇原生JS灵魂之问(下), 冲刺🚀进阶最后一公里(附个人成长经验分享)](https://juejin.im/post/5dd8b3a851882572f56b578f)
> - [中高级前端大厂面试秘籍，为你保驾护航金三银四，直通大厂(上)](https://juejin.im/post/5c64d15d6fb9a049d37f9c20)
> - [(中篇)中高级前端大厂面试秘籍，寒冬中为您保驾护航，直通大厂](https://juejin.im/post/5c92f499f265da612647b754)
> - [(下篇)中高级前端大厂面试秘籍，寒冬中为您保驾护航，直通大厂](https://juejin.im/post/5cc26dfef265da037b611738)


## 前端基础-浏览器
经典问题：
- 缓存策略：协商缓存和强缓存
- 页面渲染过程
- 页面性能优化
  
参考资料
- [浏览器工作原理与实践](https://time.geekbang.org/column/intro/216?code=wLzkK4Ecmtj435LqyZ6ecONi5PnKUst4jvEoQKp1yUA%3D)。这个也是个人十分推荐，因为本人看过《webkit技术揭秘》，发现书上很多东西都是讲浏览器一些实现方式，一堆 C++ 十分难受，但是这个专栏却用十分简单生动的方式来讲述浏览器本质，个人收获很多。
- 《webkit技术揭秘》

## 前端基础-css
- css选择器优先度
- `rem`、`em`、`vh`、`vw`和`px`的关系，以及移动端适配方式
- 清除浮动
- 盒子模型
- `flex`
- 层级上下文
- 各种布局
  
## 前端框架-vue
1. 使用
   - `provide` / `inject`
   - `props` `emit`
   - `attr` `listen`
   - `event bus`
   - 自行实现`dispatch`和`broadcase`方法
   - vue的生命周期
   - vue全家桶使用，vuex， vue-router
   - data, computer, watcher使用
   - 组件通信
2. 原理
   - 如何简单实现一个mvvm模型
   - new vue的时候发生什么，每个生命周期对应源码做了什么
   - data，watcher，computer的源码实现
   - nextTick的原理
   - 指令的本质
   - vue的性能优化
   - Diff 本质
3. 组件实现
   - 手写一个toast组件
   - 手写一个confirm组件（支持promise方式调用）

参考资料：
1. 基础使用：
   - jspang的vue教程
   - Vue2.0开发企业级移动端音乐web app
   - 前端成长必经之路 组件化思维与技巧
2. 源码：
  - [Vue.js源码全方位深入解析做补充](https://ustbhuangyi.github.io/vue-analysis/)。电子书：《Vue.js 源码揭秘》对于router，vuex，slot，keep-alive有详细解释。
  - 尤雨溪教你写vue 高级vue教程 源码分析!!!!这个我特意去fronted master冲了几百元，没想到居然有搬运
  - 最后看完就做一下题目，看看自己能达到那种水平吧。12道vue高频原理面试题,你能答出几道?
  - 《深入浅出Vue.js》， 这本书真的好，作者每单介绍一个部分的时候，都会由最简单抽象的一个demo，一步一步变成框架实际的样子，最后拿你写的demo和框架实际的对比，分析双方优缺点。
  - 要先看剖析 Vue.js 内部运行机制把手教你如何写一个最小mvvm模式，mvvm是最核心的思想。当你能懂下面的图时候,那么可以进入下一步了

3. 组件
   - vant
   - View （[掘金小册精讲](https://juejin.im/book/5bc844166fb9a05cd676ebca)）
   - 先看一下别人的写组件的经验 Vue.js 组件精讲。看完之后就开始动手自己模仿别人的组件了。

## 前端工程化-webpack
1. 使用和基本概念
   - 了解loader、plugin, 并且掌握一些基本常用的
   - 了解babel
参考资料： [玩转webpack](https://github.com/geektime-geekbang/geektime-webpack-course)
2. 学会优化
    - 体积优化： `tree shaking`、按需引入、代码切割
    - 打包速度优化：缓存、多线程打包、优化打包路径
参考资料：
 - [那些花儿，从零构建Vue工程](https://github.com/Brolly0204/webpack-vue-loader-structure)
 - [Webpack4 配置最佳实践](https://github.com/ProtoTeam/blog/blob/master/036.Webpack%204%20%E9%85%8D%E7%BD%AE%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5.md)
 - [webpack4 的30个步骤打造优化到极致的react开发环境](https://juejin.im/post/5cfe4b13f265da1bb13f26a8)
3. 原理
  - webpack构建步骤
  - 细说webpack之流程篇
  - webpack HMR原理解析
  - 从零实现webpack热更新HMR
  - 干货！撸一个webpack插件（内含tapable详解+webpack流程）
  - 手把手教你撸一个Webpack Loader
4. 项目参考
   - [le-cli](https://github.com/skygragon/leetcode-cli)
   - [fe-workflow，涉及了初始化项目、打包、测试、联调、质量把控、上线、回滚、线上监控（性能监控、异常监控）等等](https://github.com/luoxue-victor/fe-workflow)