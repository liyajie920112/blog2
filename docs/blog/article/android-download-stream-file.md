---
title: Android通过下载器下载文件流
tags:
  - android
---

```java
// 下载方法
@Override
public void onDownLoadFile(final String downLoadUrl, final String fileName) {

    // 判断是否开启了存储权限
    getPermissionsManager().checkStoragePermission(new PermissionsManager.OnResultListener() {
        @Override
        public void onSuccess() {
            Toast.makeText(getBaseContext(), fileName + "正在下载...", Toast.LENGTH_SHORT).show();
            long id = downloadBySystem(downLoadUrl, fileName);
            if (id != -1) {
                listener(id, fileName);
            }
        }

        @Override
        public void onFailure() {
            showPermissionsFailureDialog();
        }

        @Override
        public void onAlreadyDenied() {
            showPermissionsAlreadyDeniedDialog();
        }
    });
}
```

<!-- more -->

```java
private void showPermissionsFailureDialog() {
    MessageDialog.show((AppCompatActivity) AppUtils.getActivity(this),
            "提示", "已拒绝权限请求，该功能可能无法正常使用",
            "确定");
}

// 跳转到开启权限页面
private void showPermissionsAlreadyDeniedDialog() {
    MessageDialog.show((AppCompatActivity) AppUtils.getActivity(this),"提示",
            "请前往设置->应用->[应用名称]->权限中打开相关权限，否则功能无法正常运行",
            "确定", "取消")

            .setOnOkButtonClickListener(new OnDialogButtonClickListener() {
                @Override
                public boolean onClick(BaseDialog baseDialog, View v) {
                    Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                    Uri uri = Uri.fromParts("package", AppUtils.getPackageName(getThis()), null);
                    intent.setData(uri);
                    AppUtils.getActivity(getThis()).startActivity(intent);
                    return false;
                }
            });
}
```

```java
// url: 下载地址
// fileName: 文件名
private long downloadBySystem(String url, String fileName){
    try {
        Uri uri = Uri.parse(url);
        // 指定下载地址
        DownloadManager.Request request = new DownloadManager.Request(uri);
        String token = LoginUtils.getHttpToken(this);
        // 如果下载文件需要token授权, 则需要加到header
        request.addRequestHeader("Authorization", LoginUtils.getHttpToken(this));
        // 允许媒体扫描，根据下载的文件类型被加入相册、音乐等媒体库
        request.allowScanningByMediaScanner();
        // 设置通知的显示类型，下载进行时和完成后显示通知
        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
        // 设置通知栏的标题，如果不设置，默认使用文件名
       request.setTitle("This is title");
        // 设置通知栏的描述
       request.setDescription("This is description");
        // 允许在计费流量下下载
        request.setAllowedOverMetered(true);
        // 允许该记录在下载管理界面可见
        request.setVisibleInDownloadsUi(true);
        // 允许漫游时下载
        request.setAllowedOverRoaming(false);
        // 允许下载的网路类型
        request.setAllowedNetworkTypes(DownloadManager.Request.NETWORK_MOBILE | DownloadManager.Request.NETWORK_WIFI);
        request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName);
        final DownloadManager downloadManager = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
        // 添加一个下载任务
        long downloadId = downloadManager.enqueue(request);
        System.out.println("downloadId:" + downloadId);
        return downloadId;
    } catch (Exception e) {
        e.printStackTrace();
        Toast.makeText(this,"下载失败, 请重试...", Toast.LENGTH_LONG).show();
        return -1;
    }
}
```

```java
private BroadcastReceiver broadcastReceiver;

// 监听下载完成
private void listener(final long Id, final String fileName) {
    // 注册广播监听系统的下载完成事件。
    IntentFilter intentFilter = new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
    broadcastReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (DownloadManager.ACTION_DOWNLOAD_COMPLETE.equals(intent.getAction())) {
                long ID = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
                if (ID == Id) {
                    Toast.makeText(getApplicationContext(), fileName + "下载完成!", Toast.LENGTH_LONG).show();
                }
                long downloadId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
                DownloadManager downloadManager = (DownloadManager) context.getSystemService(Context.DOWNLOAD_SERVICE);
                String type = downloadManager.getMimeTypeForDownloadedFile(downloadId);
                if (TextUtils.isEmpty(type)) {
                    type = "*/*";
                }
                Uri uri = downloadManager.getUriForDownloadedFile(downloadId);
                if (uri != null) {
                    Intent handlerIntent = new Intent(Intent.ACTION_VIEW);
                    // 授予权限
                    handlerIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    handlerIntent.setDataAndType(uri, type);
                    context.startActivity(handlerIntent);
                }
            }
        }
    };

    registerReceiver(broadcastReceiver, intentFilter);
}
```