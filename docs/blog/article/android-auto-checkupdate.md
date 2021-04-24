---
title: Android基于蒲公英的版本更新检查
tags:
  - android
---

[完整Demo Github](https://github.com/liyajie920112/android-demo/tree/main/TestAutoUpdate)
[测试App下载地址](https://www.pgyer.com/68942cb39ae2d1cc426f816ca10d02e8)

:::tip
先下载一个1.3版本的, 然后更新为最新版本
:::

1. 使用OkHttpUtils来实现接口请求
2. 使用Gson实现反序列化解析或者fastjson也可以, 看自己需求

:::tip 方案
方案一: 集成蒲公英sdk

方案二: 根据蒲公英的api自己版本比对
:::

<!-- more -->

> 方案一可以按照蒲公英官网文档来执行

这里主要说下方案二

涉及到的权限有:
```xml
<application ...>
  <!-- 网络相关 -->
  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  <uses-permission android:name="android.permission.INTERNET"/>
  <!-- 存储相关 -->
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
  <!-- 安装apk包相关 -->
  <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />
  <!-- 这也是安装apk包相关 -->
  <provider
      android:name="androidx.core.content.FileProvider"
      android:authorities="com.example.testautoupdate.fileprovider"
      android:exported="false"
      android:grantUriPermissions="true">

      <!-- 元数据 -->
      <meta-data
          android:name="android.support.FILE_PROVIDER_PATHS"
          android:resource="@xml/file_path" />
  </provider>
  ...
</application>
```
res/xml/file_path.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<resource xmlns:android="http://schemas.android.com/apk/res/android">
    <paths>
        <external-path path="" name="download"/>
    </paths>
</resource>
```

:::warning 注意
因为我用的是`Context.getExternalFilesDir()`这个方法来读取sd卡上的内容, 所以如果API>=19, 则不需要权限申请, 否则需要申请权限后才能访问
:::

:::tip 分析
1. 根据蒲公英官方提供的api接口来查询检测App是否有更新[https://www.pgyer.com/doc/view/api#appUpdate](https://www.pgyer.com/doc/view/api#appUpdate), 入参和出参有详细的说明
2. 比较版本是否有变化, 可以自己比较版本号, 也可以通过接口的返回值的`buildHaveNewVersion`字段来判断, 如果根据`buildHaveNewVersion`判断, 则入参需要加一个参数`buildVersion`当前app的版本
3. 如果有变化要提示下载
4. 下载完之后实现自动安装
5. 如果中途下载异常或者退出了app, 则需要删除临时文件, 防止解析安装包失败
6. 如果已经下载过最新版本, 则可以直接安装, 无需再次下载
:::

## 1. 实现

获取app是否有更新

MainActivity.java

### 调用检查版本的方法

```java
checkUpdate(new CheckUpdateCallback<CheckUpdateModel>() {
    @Override
    public void onNewVersion(CheckUpdateModel model) {
        Toast.makeText(MainActivity.this, "发现新版本", Toast.LENGTH_SHORT).show();
        // Builder里面一定要传入Activity
        AlertDialog.Builder dialog = new AlertDialog.Builder(MainActivity.this);
        dialog.setTitle("更新提示");
        if (isWifi()) {
            dialog.setMessage("发现新版本");
        } else {
            double size = Double.parseDouble(model.getBuildFileSize()) / (1024 * 1024);
            dialog.setMessage("发现新版本  当前为移动网络, 立即更新将消耗移动流量" + String.format("%.2f", size) + "M");
        }
        dialog.setCancelable(false);
        // 如果不是强制更新, 则显示取消按钮
        if (!model.getNeedForceUpdate()) {
            dialog.setPositiveButton("取消", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    dialog.dismiss();
                }
            });
        }
        // 点击立即更新后去下载apk文件
        dialog.setNegativeButton("立即更新", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
                // 下载安装文件
                downloadApk(model);
            }
        });
        AlertDialog d = dialog.show();
    }

    @Override
    public void onNone() {
        Toast.makeText(MainActivity.this, "已经是最新版本", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onError(Exception e) {
        Toast.makeText(MainActivity.this, "检测失败", Toast.LENGTH_SHORT).show();
    }
});
```

### 创建进度条 createProgressDialog
```java
ProgressDialog bar;
private float pro = 0;

private ProgressDialog createProgressDialog() {
    if (bar == null) {
        bar = new ProgressDialog(this);
        bar.setMax(100);
        bar.setCanceledOnTouchOutside(false);
        bar.setMessage("下载中...");
        bar.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        return bar;
    }
    return bar;
}
```

### 下载安装包方法 downloadApk
```java
private void downloadApk(CheckUpdateModel model) {
    // 执行下载操作, 并下载完成后安装
    String downloadUrl = model.getDownloadURL();
    // 文件的下载文职
    String downloadPath = Environment.DIRECTORY_DCIM + File.separator + "/download/";
    File dir = getExternalFilesDir(downloadPath);
    if (!dir.exists()) {
        dir.mkdir(); // 如果文件夹不存在, 则创建一个新的
    }
    String realDownloadPath = dir.getPath();
    String fileName = getPackageName() + "-" + model.getBuildVersion() + ".apk";
    String tempFileName = "bak-" + fileName;
    // 如果临时文件已经存在, 则直接删除临时文件
    // 每次下载前都要判断下临时文件是否存在, 如果存在, 则删除
    File tempFile = new File(dir.getPath() + File.separator + tempFileName);
    if (tempFile.exists()) {
        tempFile.delete();
    }
    // 判断最新安装包是否存在, 如果存在, 则直接安装, 因为文件名是通过最新的版本来命名, 所以如果能查到, 说明是最新的apk (手动修改名字的问题不考虑)
    File apk = new File(dir.getPath() + File.separator + fileName);
    if (apk.exists()) {
        // 如果已经存在, 则直接安装
        installApk(apk);
        return;
    }
    
    // 显示进度条, 显示下载进度
    createProgressDialog().show();
    OkHttpUtils.get().url(downloadUrl).build().execute(new FileCallBack(realDownloadPath, tempFileName) {
        @Override
        public void onError(Call call, Exception e, int id) {
            createProgressDialog().dismiss();
            // 下载失败后删除临时文件
            File oldFile = new File(dir.getPath() + File.separator + tempFileName);
            if (oldFile.exists()) {
                oldFile.delete();
            }
            Toast.makeText(MainActivity.this, "下载失败", Toast.LENGTH_SHORT).show();
        }

        @Override
        public void onResponse(File response, int id) {
            createProgressDialog().setMessage("下载完成");
            createProgressDialog().dismiss(); // 关闭进度条弹窗
            // 下载完成后, 重命名文件
            File oldFile = new File(dir.getPath() + File.separator + tempFileName);
            File newFile = new File(dir.getPath() + File.separator + fileName);
            oldFile.renameTo(newFile);
            // 安装
            installApk(newFile);
        }

        @Override
        public void inProgress(float progress, long total, int id) {
            // 设置进度条进度
            if (progress > pro) {
                createProgressDialog().setProgress((int) (progress * 100));
                pro = progress;
            }
        }
    });
}
```

### 安装apk包
```java
public void installApk(File file) {
    Intent intent = new Intent(Intent.ACTION_VIEW);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        Uri apkUri = FileProvider.getUriForFile(this, getPackageName() + ".fileprovider", file);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
    } else {
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        Uri uri = Uri.fromFile(file);
        intent.setDataAndType(uri, "application/vnd.android.package-archive");
    }
    startActivity(intent);
    finish();
}
```

### 检测是否有最新版本
```java
void checkUpdate(CheckUpdateCallback cb) {
  // 该接口有4个入参, 两个必填两个选填
  String checkUpdateUrl = "https://www.pgyer.com/apiv2/app/check";
  String apiKey = getMetaData("PGY_API_KEY");
  String appKey = getMetaData("PGY_APP_KEY");
  OkHttpUtils.post()
          .url(checkUpdateUrl)
          .addParams("_api_key", apiKey) // api文档页面就可以获取
          .addParams("appKey", appKey) // 在应用概述里面直接可以看到
          .build()
          .execute(new JsonCallback<Result<CheckUpdateModel>>() {
              @Override
              public void onError(Call call, Exception e, int id) {
                  Toast.makeText(MainActivity.this, "失败", Toast.LENGTH_SHORT).show();
                  cb.onError(e);
              }

              @Override
              public void onResponse(Result<CheckUpdateModel> response, int id) {
                  CheckUpdateModel checkUpdateModel = response.getData();
                  String remoteVersion = checkUpdateModel.getBuildVersion();
                  String curVersion = getCurrentVersion();
                  // 如果我们想自己比较版本, 就自己写一个比较方法, 如果不想自己比较版本, 可以给该接口传一个buildVersion的参数,参数值为当前app的versionName
                  int r = compareVersion(remoteVersion, curVersion); // 0:版本一致, -1: 当前版本高, 1: 远程版本高
                  if (r == 0) {
                      cb.onNone();
                  } else if (r == 1) {
                      cb.onNewVersion(checkUpdateModel);
                  }
              }
          });
    }
```

### CheckUpdateCallback.java
方便我们在检查版本的时候自己实现回调

```java
public abstract class CheckUpdateCallback<T> {

    // 有新版本
    public void onNewVersion(T t) {}

    // 没有变化
    public void onNone() {}

    public void onError(Exception e) {}
}
```

### CheckUpdateModel.java

因为我不想使用蒲公英的sdk, 所以手动写了一个实体类, 

```java
public class CheckUpdateModel {
    private String buildBuildVersion;
    private String forceUpdateVersion;
    private String forceUpdateVersionNo;
    private Boolean needForceUpdate;
    private String downloadURL;
    private String buildHaveNewVersion;
    private String buildVersionNo;
    private String buildVersion;
    private String buildUpdateDescription;
    private String buildShortcutUrl;
    private String appKey;
    private String buildKey;
    private String buildName;
    private String buildIcon;
    private String buildFileKey;
    private String buildFileSize;
    ... 需实现get  set
}
```

### JsonCallback.java
因为接口返回值是一个json, 所以我手动写了一个Json回调, 方便使用, Result是一个通用的实体类,一般是和后台协商好的基本结构

```java
public abstract class JsonCallback<T> extends Callback<T>  {
    @Override
    public T parseNetworkResponse(Response response, int id) throws Exception {
        Type genType = getClass().getGenericSuperclass();
        Type t = ((ParameterizedType)genType).getActualTypeArguments()[0];
        String str = response.body().string();
        T result = JSON.parseObject(str, t);
        return result;
    }
}
```

### Result.java

```java
public class Result<T> {
    private String code;
    private String message;
    private T data;
    ... get set 省略
}
```

### 比较版本号 compareVersion()
```java
public static int compareVersion(String version1, String version2) {
    if (version1.equals(version2)) {
        return 0;
    }
    String[] version1Array = version1.split("\\.");
    String[] version2Array = version2.split("\\.");

    int index = 0;
    // 获取最小长度值
    int minLen = Math.min(version1Array.length, version2Array.length);
    int diff = 0;
    // 循环判断每位的大小
    while (index < minLen
            && (diff = Integer.parseInt(version1Array[index])
            - Integer.parseInt(version2Array[index])) == 0) {
        index++;
    }
    if (diff == 0) {
        // 如果位数不一致，比较多余位数
        for (int i = index; i < version1Array.length; i++) {
            if (Integer.parseInt(version1Array[i]) > 0) {
                return 1;
            }
        }

        for (int i = index; i < version2Array.length; i++) {
            if (Integer.parseInt(version2Array[i]) > 0) {
                return -1;
            }
        }
        return 0;
    } else {
        return diff > 0 ? 1 : -1;
    }
}

```

### 工具方法
```java
// 获取当前版本号
public String getCurrentVersion() {
    PackageManager packageManager = getPackageManager();
    try {
        PackageInfo info = packageManager.getPackageInfo(getBaseContext().getPackageName(), 0);
        return info.versionName;
    } catch (PackageManager.NameNotFoundException e) {
        e.printStackTrace();
        return "";
    }
}

// 获取AndroidManifest.xml里的meta-data的value
public String getMetaData(String key) {
    try {
        ApplicationInfo info = getPackageManager().getApplicationInfo(getBaseContext().getPackageName(), PackageManager.GET_META_DATA);
        return info.metaData.getString(key);
    } catch (PackageManager.NameNotFoundException e) {
        return "";
    }
}

// 判断是否是wifi网络
public boolean isWifi() {
    ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
    NetworkInfo activeNetInfo = connectivityManager.getActiveNetworkInfo();
    if (activeNetInfo != null && activeNetInfo.getType() == ConnectivityManager.TYPE_WIFI) {
        return true;
    }
    return false;
}
```