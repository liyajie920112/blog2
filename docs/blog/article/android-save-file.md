---
tags:
  - Android
---

# Android存储文件

> 需要先授权文件写入和读取权限

AndroidManifest.xml
```xml
...
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
...
```

FileUtils.java
```java
// Bitmap图报错到系统相册
public static String bitmapSave(Context context, Bitmap bitmap) {
  return MediaStore.Images.Media.insertImage(context.getContentResolver(), bitmap, "扫码照片", "二维码图片");
}

// 保存图片到文件管理对应的app下的文件夹下
public static String bitmapSaveToStorage(Context context, Bitmap bitmap) {
  File galleryPath = context.getExternalFilesDir(Environment.DIRECTORY_DCIM + File.separator + "pic" + File.separator);
  // 如果文件夹不存在, 则创建
  if (!galleryPath.exists()) {
      galleryPath.mkdir();
  }

  // 把时间戳作为文件名字
  String fileName = System.currentTimeMillis() + ".jpg";
  File file = new File(galleryPath, fileName);

  try {
      // 创建文件输出流
      FileOutputStream fos = new FileOutputStream(file);
      // 讲bitmap写入流, 并质量压缩80%
      bitmap.compress(Bitmap.CompressFormat.JPEG, 80, fos);
      fos.flush();
      fos.close();
  } catch (Exception e) {
      e.printStackTrace();
      return null;
  }

  return file.getAbsolutePath(); // 返回文件的绝对路径
}
```