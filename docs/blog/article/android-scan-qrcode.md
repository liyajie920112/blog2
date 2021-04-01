---
tags:
  - android
  - Scan QRCode
---

# Android 基于zxing-android-embedded开发一个识别二维码的功能

用到的第三方工具包[zxing-android-embedded](https://github.com/journeyapps/zxing-android-embedded)

## 准备工作

1. AndroidManifest.xml 添加`Camera`权限
```xml
<uses-permission android:name="android.permission.CAMERA" />
```

2. 添加依赖`zxing-android-embedded`

app.bradle
```json
dependencies {
    implementation group: 'com.journeyapps', name: 'zxing-android-embedded', version: '4.2.0'
    ...
}
```

3. 注意点
> 最新的`zxing-android-embedded`支持的`minSdkVersion`为 24, 如果使用的`minSdkVersion<24`, 请参考[https://github.com/journeyapps/zxing-android-embedded](https://github.com/journeyapps/zxing-android-embedded)

## 实现 - 简单版

// MainActivity.java
```java
// 执行扫码, 需要相机授权
public void scanQrCode(View view) {
  new IntentIntegrator(this).initiateScan();
}

@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    IntentResult result = IntentIntegrator.parseActivityResult(resultCode, data);
      // 弹出结果
      Toast.makeText(this, "Scanned: " + result.getContents(), Toast.LENGTH_LONG).show();
    }
}
```

## 实现扫码后继续扫码

```java
// 自定义Activity
public void scanContinuous(View view) {
  Intent intent = new Intent(this, ContinuousCaptureActivity.class);
  startActivity(intent);
}

public class ContinuousCaptureActivity extends Activity {
    private DecoratedBarcodeView barcodeView; // 组件DecoratedBarcodeView, 也是扫码组件
    private BeepManager beepManager;
    private String lastText;

    private BarcodeCallback callback = new BarcodeCallback() {
        @Override
        public void barcodeResult(BarcodeResult result) {
            if(result.getText() == null || result.getText().equals(lastText)) {
                // 重复扫码
                return;
            }

            // 获取扫码结果
            lastText = result.getText();
            // 把扫码结果显示
            barcodeView.setStatusText(result.getText());

            // 播放扫码声音
            beepManager.playBeepSoundAndVibrate();

            ImageView imageView = findViewById(R.id.barcodePreview);

            // 把扫描到的图片放到ImageView中, Color.YELLOW会把扫的二维码的入口用黄色标识
            imageView.setImageBitmap(result.getBitmapWithResultPoints(Color.YELLOW));
        }

        @Override
        public void possibleResultPoints(List<ResultPoint> resultPoints) {
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.continuous_scan);

        barcodeView = findViewById(R.id.barcode_scanner);
        Collection<BarcodeFormat> formats = Arrays.asList(BarcodeFormat.QR_CODE, BarcodeFormat.CODE_39);
        barcodeView.getBarcodeView().setDecoderFactory(new DefaultDecoderFactory(formats));
        barcodeView.initializeFromIntent(getIntent());
        barcodeView.decodeContinuous(callback);

        beepManager = new BeepManager(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        barcodeView.resume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        barcodeView.pause();
    }

    // 点击暂停按钮的时候执行该方法
    public void pause(View view) {
        barcodeView.pause();
    }

    // 点击继续按钮的时候执行该方法
    public void resume(View view) {
        barcodeView.resume();
    }

    public void triggerScan(View view) {
        barcodeView.decodeSingle(callback);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        return barcodeView.onKeyDown(keyCode, event) || super.onKeyDown(keyCode, event);
    }
}
```

参考:
  - [https://github.com/journeyapps/zxing-android-embedded](https://github.com/journeyapps/zxing-android-embedded)

  