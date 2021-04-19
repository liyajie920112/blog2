---
title: Android集成Sentry
tags:
  - android
  - sentry
---

## 1. 添加依赖

build.gradle
```json
// Make sure mavenCentral is there.
repositories {
    mavenCentral()
}

// Enable Java 1.8 source compatibility if you haven't yet.
android {
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
}

// Add Sentry's SDK as a dependency.
dependencies {
    implementation 'io.sentry:sentry-android:4.3.0'
}
```

<!-- more -->

## 2. 配置AndroidManifest.xml

```xml
<application>
  <meta-data android:name="io.sentry.dsn" android:value="https://examplePublicKey@o0.ingest.sentry.io/0" />
</application>
```

## 3. 验证

```java
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import java.lang.Exception;
import io.sentry.Sentry;

public class MyActivity extends AppCompatActivity {
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    try {
      throw new Exception("This is a test.");
    } catch (Exception e) {
      // 主动上报异常
      Sentry.captureException(e);
    }
  }
}
```

## 4. 大部分情况我们更希望能全局检测异常自动上报

工具类, 用作异常处理
```java
package com.tsingyun.yangnong.utils;

import android.content.Context;

import io.sentry.Sentry;

public class CrashHandler implements Thread.UncaughtExceptionHandler {
    private UncaughtExceptionHanlderListener mHanlderListener;
    private Context mContext;
    private static CrashHandler sInstance;
    private StringBuffer sb;

    public static CrashHandler getInstance(Context context) {
        if (sInstance == null) {
            sInstance = new CrashHandler(context);
        }
        return sInstance;
    }

    private CrashHandler(Context context) {
        mContext = context;
        Thread.setDefaultUncaughtExceptionHandler(this);
    }

    /* (non-Javadoc)
     * @see java.lang.Thread.UncaughtExceptionHandler#uncaughtException(java.lang.Thread, java.lang.Throwable)
     */
    @Override
    public void uncaughtException(Thread thread, Throwable ex) {
        hanldeException(ex);
        if (mHanlderListener != null) {
            mHanlderListener.handlerUncaughtException(sb);
        }
    }

    /**
     * 设置外部要处理异常发生时操作监听器
     *
     * @param hanlderListener : {@link UncaughtExceptionHanlderListener}
     */
    public void setHanlderListener(UncaughtExceptionHanlderListener hanlderListener) {
        this.mHanlderListener = hanlderListener;
    }

    //崩溃日志的保存操作
    private void hanldeException(Throwable ex) {
        if (ex == null) {
            return;
        }

        Sentry.captureException(ex);
    }

    /**
     * 未捕获异常的处理监听器
     */
    public static interface UncaughtExceptionHanlderListener {
        /**
         * 当获取未捕获异常时的处理
         * 一般用于关闭界面和数据库、网络连接等等
         */
        public void handlerUncaughtException(StringBuffer sb);
    }
}
```

## 5. 找到AndroidManifest.xml
`App.activity`, App.activity对应的是`android:name=".App"`
```xml
<application
        android:name=".App"
        android:allowBackup="true">
</application>
```

## 6. 初始化

```java
public class App extends Application {
  @Override
  public void onCreate() {
    super.onCreate();
    instance = this;
    CrashHandler.getInstance(getApplicationContext());
    ...
  }
}
```

## 7. 尝试报错

```java
public class TestActivity extends AppCompatActivity {
  @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      String a = null;
      System.out.print(a.toString())
    }
}
```

## 8. 查看Sentry项目控制台

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210415191017.png)

## 9. 大功告成

参考:
  - [https://docs.sentry.io/platforms/android/](https://docs.sentry.io/platforms/android/)
