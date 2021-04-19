---
title: Android NFC标签读取
tags:
  - android
  - nfc
---

## Android对NFC的支持

> 不同的NFC标签之间差异很大，有的只支持简单的读写操作，有时还会采用支持一次性写入的芯片，将NFC标签设计成只读的。当然，也存在一些复杂的NFC标签，例如，有一些NFC标签可以通过硬件加密的方式限制对某一区域的访问。还有一些标签自带操作环境，允许NFC设备与这些标签进行更复杂的交互。这些标签中的数据也会采用不同的格式。但Android SDK API主要支持NFC论坛标准（Forum Standard），这种标准被称为NDEF（NFC Data Exchange Format，NFC数据交换格式）。

<!-- more -->

### 对NDEF数据操作

> 需要用到的类

```
NfcAdapter 获取NFC适配器

NdefRecord NDEF记录

NdefMessage NDEF消息

PendingIntent 是 Android 提供的一种用于外部程序调起自身程序的能力，生命周期不与主程序相关。外部程序通过 PendingIntent 只能调用起三种组件：Activity, Service, Broadcast
```

### 编写NFC步骤

1. 设置需要的访问权限 AndroidManifest.xml

```xml
<uses-permission android:name="android.permission.NFC" />
<!-- 只有有nfc的手机可以搜到该应用 -->
<uses-feature
    android:name="android.hardware.nfc"
    android:required="true" />
```

2. 定义接受tag的Activity, launchMode需要设置为 singleTop/singleTask, 保证无论NFC标签靠近手机多少次都保证只有一个Activity实例, 并添加对应的inter-filter

```xml
<activity android:name=".activity.NfcActivity"
    android:launchMode="singleTop">
    <intent-filter>
      <action android:name="android.nfc.action.NDEF_DISCOVERED" />
      <category android:name="android.intent.category.DEFAULT" />
      <data android:mimeType="text/xxx" />
    </intent-filter>

    <intent-filter>
      <action android:name="android.nfc.action.TECH_DISCOVERED" />
    </intent-filter>

    <meta-data
      android:name="android.nfc.action.TECH_DISCOVERED"
      android:resource="@xml/nfc_tech_filter" />
    <intent-filter>
      <action android:name="android.nfc.action.TAG_DISCOVERED" />
    </intent-filter>
</activity>
```

3. 判断手机是否支持NFC功能, 如果支持判断NFC是否已开启

```java
public boolean checkNFC() {
  NfcAdapter nfcAdapter = NfcAdapter.getDefaultAdapter(this);
  if (nfcAdapter == null) {
    Toast.makeText(activity, "设备不支持NFC功能!", Toast.LENGTH_SHORT).show();
    return;
  } else {
    // 如果没有开启, 则提示未开启
    if (!nfcAdapter.isEnabled()) {
        Toast.makeText(activity, "NFC功能未打开!",Toast.LENGTH_SHORT).show();
        return false;
    } else {
      Toast.makeText(activity, "NFC功能已打开!",Toast.LENGTH_SHORT).show();
        return true;
    }
  }
}
```

4. 基础工作做好之后开始创建我们的Activity

```java
// NFCActivity.java

/**
当NFC标签靠近手机的时候会走到onNewIntent
*/
@Override
protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
    // 判断action, 用来判断是否是nfc相关
    if (intent.getAction().equals(NfcAdapter.ACTION_TAG_DISCOVERED)
    || intent.getAction().equals(NfcAdapter.ACTION_NDEF_DISCOVERED)
    || intent.getAction().equals(NfcAdapter.ACTION_TECH_DISCOVERED)) {
        tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
        // 通过tag来读取NFC标签数据
        nfcReader(tag);
    }
}

@Override
protected void onPause() {
  super.onPause();
  NfcAdapter nfcAdapter = getNfcAdapter();
  if (nfcAdapter == null) {
      return;
  }
  nfcAdapter.disableForegroundDispatch(this);
}

@Override
protected void onResume() {
  super.onResume();
  NfcAdapter nfcAdapter = getNfcAdapter();
  if (nfcAdapter == null) {
      return;
  }
  IntentFilter filter = new IntentFilter();
  // 如果在这里添加intent-filter, 则AndroidManifest.xml中可以不添加
  filter.addAction(NfcAdapter.ACTION_TAG_DISCOVERED);
  filter.addAction(NfcAdapter.ACTION_NDEF_DISCOVERED);
  filter.addAction(NfcAdapter.ACTION_TECH_DISCOVERED);
  PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, new Intent(this, getClass()).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), 0);
  nfcAdapter.enableForegroundDispatch(this, pendingIntent, new IntentFilter[]{filter}, NfcUtils.techList);
}

String mimeStr = "text/xxx"; // 这里可以自定义, 这里的mimeStr就是AndroidManifest.xml文件中的<data android:mimeType="text/xxx" />
short TNF = NdefRecord.TNF_MIME_MEDIA;
private String nfcReader(Tag tag) {
  try {
    Ndef ndef = Ndef.get(tag);
    if (ndef == null) {
        return null;
    }
    int size = ndef.getMaxSize();

    NdefMessage ndefMessage = ndef.getCachedNdefMessage();
    NdefRecord[] records = ndefMessage.getRecords();
    for (NdefRecord ndefRecord : records) {
        // 如果自定义mime, 则需要设置TNF为NdefRecord.TNF_MIME_MEDIA
        // 如图mime是text/plain, 则下面需要这么判断
        // ndefRecord.getTnf() == TNF && Arrays.equals(ndefRecord.getType(), NdefRecord.RTD_TEXT)
        if (ndefRecord.getTnf() == TNF && Arrays.equals(ndefRecord.getType(), strToBytes(mimeStr))) {
            try {
                return readTextFromRecord(ndefRecord);
            } catch (UnsupportedEncodingException e) {
            }
        }
    }
  } catch (Exception e) {
    return null;
  }
  return null;
}

// 字符串转byte[]
private byte[] strToBytes(String str) {
  return str.getBytes(Charset.forName("US-ASCII"));
}

// 通过NdefRecord读取
public String readTextFromRecord(NdefRecord record) throws UnsupportedEncodingException {
  byte[] payload = record.getPayload();
  String textEncoding = ((payload[0] & 128) == 0) ? "UTF-8" : "UTF-16";
  int languageCodeLength = payload[0] & 0063;
  return new String(payload, languageCodeLength + 1, payload.length - languageCodeLength - 1, textEncoding);
}

// 写入数据到NFC标签, 这里主要是处理的NDEF数据格式
public boolean writeNdefTag(String text, Tag tag) throws IOException, FormatException {
  NdefRecord[] records = {createRecord(text)};
  NdefMessage ndefMessage = new NdefMessage(records);
  Ndef ndef = Ndef.get(tag);
  NdefFormatable ndefFormatable = NdefFormatable.get(tag);
  if (ndef != null) { // 如果该标签是Ndef, 则直接写入
      ndef.connect();
      ndef.writeNdefMessage(ndefMessage);
      return true;
  } else if (ndefFormatable != null) { // 如果是NdefFormatable, 则格式化成Ndef格式, 然后写入tag
      ndefFormatable.connect();
      ndefFormatable.format(ndefMessage); // 这句话就是把NdefFormatable格式化成Ndef
      return true;
  }
  return false;
}
```

参考:

- [https://blog.csdn.net/qq_36135335/article/details/82463179](https://blog.csdn.net/qq_36135335/article/details/82463179)
- [https://blog.csdn.net/chengkaizone/article/details/27887273](https://blog.csdn.net/chengkaizone/article/details/27887273)
- [https://github.com/RickyYu/Nfc-Android](https://github.com/RickyYu/Nfc-Android)
- [https://github.com/tawaasalage/SimpleNFC](https://github.com/tawaasalage/SimpleNFC)


