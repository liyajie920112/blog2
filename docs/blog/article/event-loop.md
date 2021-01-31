---
author: LiYajie
tags:
  - eventloop
---
# EventLoop的理解

## 什么是javascript

简单来讲: javascript是一个单线程,异步,非阻塞,解释性的脚本语言

javascript是一个单线程的编程语言, 单线程的运行环境, 有且只有一个调用栈, 同一时间只能做一件事.

<!-- more -->

## 调用栈的执行过程call stack

```js
function multiply(a,b){
    return a * b;
}

function square(n){
    return multiply(n,n)
}

function printSquare(n){
    var result = square(n)
    console.log(result)
}
printSquare(5) // 25
```

调用栈首先有一个入口函数, 我们命名为`main()`
当执行到`printSquare(5)`的时候, 会将该函数入栈, 然后进入该函数执行, 发现里面还调用了`square()`函数,则又会把`square()`入栈, 又发现square中调用了`multiply`,则又会将`multiply`入栈, 执行完`multiply`得到返回值, 开始执行弹栈操作, 先将multiply弹出, 这样square的返回值也得到了, 再把square弹出, 这样参数result的结果得到了, 发现里面还执行了一个`console.log`, 再把`console.log`入栈, 打印出结果后将其弹栈, 最后`printSquare`执行完毕, 把该函数也弹出栈,最后`main()`也执行完也弹出, 这就是这个执行流程.

```js
入main()-->
    入printSquare(5)-->
    
        入square(n)-->
            入multiply(n,n)-->
            出multiply(n,n)-->
        出square(n)-->
    
        入console.log(result)-->
        出console.log(result)-->
    
    出printSquare(5)-->
出main()
```
我们改造上面的函数后
```js
function multiply(a,b){
    throw new Error('报错了')
}

function square(n){
    return multiply(n,n)
}

function printSquare(n){
    var result = square(n)
    console.log(result)
}
printSquare(5) // 25
```
结果:
```js
Uncaught Error: 报错了
    at multiply (<anonymous>:2:11)
    at square (<anonymous>:6:12)
    at printSquare (<anonymous>:10:18)
    at <anonymous>:13:1
```
并且错误是由内-->外传递, 最终传递到`printSquare`



经过上述分析之后, 我们知道了调用栈的执行过程, 那么我们就可以写一个内存溢出的函数了, 如下: 

```js
function test(v){
    return test(v)
}
test(1)
```

结果:

```js
Uncaught RangeError: Maximum call stack size exceeded
超出最大调用栈大小(内存溢出)
```

原因: 一直在入栈, 没有弹栈的操作,这样就导致了每执行到`test(v)`就入栈, 这样栈很快就会被溢出


## 事件循环

什么是事件循环也就是EventLoop

> 主线程也可以说调用栈从任务队列(回调队列)中读取事件, 这个过程是循环不断的, 这个过程就是EventLoop, 下面的图可以帮助我们更好的理解

![](/uploads/contentimg/833fa9b4297875ee574ce9291e3690d1.png)

## 回调队列

所谓回调队列就是如上图中的`callback queue`, 用下面代码讲解:

```js
console.log('Hi');
setTimeout(function() {
    console.log('callback');
}, 1000);
console.log('Bye');
```
执行结果:
```js
Hi
Bye
// 1s后
callback
```

上述代码执行顺序

```js
console.log('Hi') 同步任务, 被推入主线程执行
setTimeout() 异步任务, 被放到event table中, 当1秒后被推入event queue
console.log('Bye') 同步任务, 被推入主线程执行

Hi Bye打印后, 主线程就去任务队列查看是否有可执行的任务, 如果有则执行setTimeout里的函数

```

先将`console.log('Hi')`添加到执行栈, 执行完成后输出`Hi`并弹栈, 接着执行`setTimeout`, 执行的时候发现是个定时器,是一个异步任务, 异步任务在event table中注册函数，当满足触发条件后(这里也就是时间到了之后)，被推入event queue, `setTimeout`执行完成之后就会立马弹栈, 接着执行`console.log('Bye')`, 过程和执行`console.log('Hi')`的时候一样, 整体过程如下动图展示:

![](/uploads/contentimg/3baaa2030f404cf2375836958a3b2584.gif)

> 如果主线程中代码执行事件很长, 这样就不能保证setTimeout指定的回调会在指定的时间内执行

到这里, 以上就是我对event loop的理解

但是当我遇到下面代码的时候我发现我的理解还是有点问题的.

```js
setTimeout(function(){
 console.log('定时器开始')
});

new Promise(function(resolve){
    console.log('马上执行for循环啦');
    for(var i = 0; i < 10000; i++){
        i == 99 && resolve();
    }
}).then(function(){
    console.log('执行then函数啦')
});
console.log('代码执行结束');
```

参考网站:

- [https://www.youtube.com/watch?v=8aGhZQkoFbQ](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
- [https://blog.sessionstack.com/how-javascript-works-event-loop-and-the-rise-of-async-programming-5-ways-to-better-coding-with-2f077c4438b5](https://blog.sessionstack.com/how-javascript-works-event-loop-and-the-rise-of-async-programming-5-ways-to-better-coding-with-2f077c4438b5)

