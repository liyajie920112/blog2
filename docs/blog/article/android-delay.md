---
tags:
  - android
---

# Android 延迟执行的方法

## 1.使用线程的休眠实现延时操作

```java
new Thread() {
  @Override
  public void run() {
    super.run();
    Thread.sleep(3000);//休眠3秒
    /**
      * 要执行的操作
      */
    }
}.start();
```

## 2.使用TimerTask实现延时操作

```java
TimerTask task = new TimerTask() {
  @Override
  public void run() {
  /**
  *要执行的操作
  */
  }
};
Timer timer = new Timer();
timer.schedule(task, 3000);//3秒后执行TimeTask的run方法
```

## 3.使用Handler的postDelayed方法实现延时操作

```java
Handler handler = new Handler();
handler.postDelayed(new Runnable() {
  @Override
  public void run() {
    /**
    *要执行的操作
    */
  }
}, 3000);//3秒后执行Runnable中的run方法

简单的一般推荐第三种。
```

```
`Handler`开启的runnable会在这个handler所依附线程中运行。若handler在UI线程中创建，runnable中的代码也会在主线程中执行
```

参考:

- [https://www.cnblogs.com/genggeng/p/7514452.html](https://www.cnblogs.com/genggeng/p/7514452.html)
