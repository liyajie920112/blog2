---
title: Android申请系统权限
tags:
  - Android
---

> Android 6.0系统一个最大的特性就是动态权限申请。在android 6.0以前，我们APP开发中对权限的处理是直接在AndroidManifest文件中配置即可；这种情况在android 6.0之后就改变了，对于一些涉及用户隐私的危险权限，我们不但需要在AndroidManifest文件中进行配置，还需要在使用到该权限的地方使用API来对权限进行动态申请.

<!-- more -->

## 原生写法- 以申请相机权限为例

> Build.VERSION_CODES.M -> SDK23 -> Android 6.0

// MainActivity.java
```java

// 检测照片权限是否开启
public void checkImagePermission(OnResultListener listener, Boolean isForcibly) {
    mImageListener = null;
    // 判断是否有Camera权限
    boolean haveCameraPermission = ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA)
            == PackageManager.PERMISSION_GRANTED;
    // 判断是否有存储写入权限
    boolean haveWritePermission = ContextCompat.checkSelfPermission(context, Manifest.permission.WRITE_EXTERNAL_STORAGE)
            == PackageManager.PERMISSION_GRANTED;
    // 如果都没有, 则执行监听回调
    if (haveCameraPermission && haveWritePermission) {
        if (listener != null) {
            // 如果都执行成功了, 则执行成功回调
            listener.onSuccess();
        }
    } else {
        // 如果当前版本>=android 6, 才去申请 
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (AppUtils.getActivity(context).shouldShowRequestPermissionRationale(Manifest.permission.CAMERA) ||
                    AppUtils.getActivity(context).shouldShowRequestPermissionRationale(Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
                if (listener != null) {
                    // isForcibly 是否强制申请权限
                    if (isForcibly) {
                        // 请求权限, 则会弹出申请页面
                        requestImagePermissions();
                    } else {
                        // 否则, 则执行拒绝回调
                        listener.onAlreadyDenied();
                    }
                }
            } else {
                // 如果没有权限则执行请求权限
                mImageListener = listener;
                requestImagePermissions();
            }
        } else {
            if (listener != null) {
                // 如果拒绝了则执行失败回调
                listener.onFailure();
            }
        }
    }
}

// 申请图片访问权限和存储写入权限
@RequiresApi(api = Build.VERSION_CODES.M)
private void requestImagePermissions() {
    if (AppUtils.getActivity(context) != null) {
        AppUtils.getActivity(context).requestPermissions(new String[]{Manifest.permission.CAMERA,
                Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_IMAGE_PERMISSION_CODE);
    }
}

// 使用
public void useCamera() {
  // getPermissionsManager() 获取PermissionsManager实例
  getPermissionsManager().checkImagePermission(new PermissionsManager.OnResultListener() {
    @Override
    public void onSuccess() {
        // 授权成功后执行这里....
        Log.i("TAG", "授权成功了");
    }

    @Override
    public void onFailure() {
        Logger.d("onFailure");
        showPermissionsFailureDialog();
    }

    @Override
    public void onAlreadyDenied() {
        Logger.d("onAlreadyDenied");
        showPermissionsAlreadyDeniedDialog();
    }
  }, true);
}
```

## 第三方权限库(推荐)

> 只用注解的方式, 相当方便

- [参考地址 https://github.com/permissions-dispatcher/PermissionsDispatcher](https://github.com/permissions-dispatcher/PermissionsDispatcher)

