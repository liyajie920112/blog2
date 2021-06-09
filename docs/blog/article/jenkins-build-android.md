---
title: Jenkins 打包Android项目
tags:
  - jenkins
  - android
---

## 服务器环境

centos7.6

AndroidSdk目录: `/opt/android-home/sdk`

Gradle目录: `/opt/gradle`

## 1. 配置Android打包环境

### 安装java jdk

1. jdk8下载地址[https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html)

2. 下载后传输到服务器或者直接在服务器上下载

3. 解压对应的文件

4. 配置环境变量

### 安装 sdk tools

1. 到这里[https://developer.android.com/studio/index.html](https://developer.android.com/studio/index.html)找到对应系统的command-line

我用的是: [https://dl.google.com/android/repository/sdk-tools-linux-3859397.zip](https://dl.google.com/android/repository/sdk-tools-linux-3859397.zip)

下载到你的目录(我的是  `/opt/android-home/sdk`)
```bash
wget https://dl.google.com/android/repository/sdk-tools-linux-3859397.zip
```

解压: unzip ./sdk-tools-linux-3859397.zip   (如果该命令`unzip`找不到,则需要先安装`unzip`, 安装方法自行百度)

解压后有一个`tools`目录, 解压完成后可以删除该压缩包  `rm -rf ./sdk-tools-linux-3859397.zip`

### build-tools安装

- 上一步安装完`tools`后, 我们就可以安装`build-tools`了

查看可以安装的版本
```base
./tools/bin/sdkmanager --list
```

安装builds-tools,安装成功后sdk目录下会多一个builds-tools文件夹
```bash
./tools/bin/sdkmanager "builds-tools;26.0.1"
```

安装`platforms`, 安装成功后sdk目录下会多一个platforms文件夹
```bash
./tools/bin/sdkmanager "platforms;android-25"
```

### 配置对应的环境变量

1. 打开`/etc/profile`

```bash
vi /etc/profile
```

2. 添加环境变量
```bash
# 添加ANDROID_HOME环境变量
export ANDROID_HOME=/opt/android-home/sdk
export PATH=$PATH:/opt/android-home/sdk/platforms-tools:/opt/android-home/sdk/tools
```

```bash
source /etc/profile # 使/etc/profile生效
```

3. 检查环境变量

```bash
echo $PATH
echo $ANDROID_HOME
```

4. 导入AndroidSdk license **相当关键**

```bash
/opt/android-home/sdk/tools/bin/sdkmanager --licenses
```

## 安装Gradle

### 选择对应版本

1. 下载到/opt/gradle
```bash
wget https://services.gradle.org/distributions/gradle-6.5-all.zip
```

2. 解压
```bash
unzip gradle-6.5-all.zip
```

3. 添加环境变量

```bash
export GRADLE_HOME=/opt/gradle/gradle-6.5/bin
export PATH=$PATH...:$GRADLE_HOME  # ...为省略
```

4. 执行`source /etc/profile`

5. 查看gradle版本

```bash
gradle -v
```

## 配置Jenkins

1. 打开Jenkins的系统配置(Configure System) [`Manage Jenkins->Configure System`]

2. 配置全局属性->环境变量

```
Key: ANDROID_HOME
Value: /opt/android-home/sdk
```

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210608161121.png)

3. 进入全局工具配置

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210608161324.png)

4. Gradle安装, 可以添加多个, 也可以选择自动安装

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210608161445.png)

5. 点击保存即可

## 创建Jenkins打包任务

1. 创建一个FreeStyle Project

2. 开始配置

  2.1 配置git
  2.2 配置git代码仓库地址
  2.3 配置分支 `*/dev`

3. 在build(构建环节)选择增加构建步骤下的 `Invoke Gradle script`

4. 选择Invoke Gradle, 选择上一步我们全局配置的gradle-4.1/gradle-6.5

5. Tasks 输入以下命令

```
clean
assembleDebug
```

6. 构建后的操作->增加构建后操作->Archive the artifacts, 输入`**/*.apk`

7. 点击开始构建, 如果构建成功, 点击状态会看到最后一次构建成功的结果, 如下

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210608162239.png)

点击后可下载

参考:
- [https://gist.github.com/Ashok-Varma/6b5864c1e444a3f1b61158254a43c4bc](https://gist.github.com/Ashok-Varma/6b5864c1e444a3f1b61158254a43c4bc)
