---
title: Mac通过brew安装mongodb4.2
tags:
  - mongodb
---

## 1. 第一步

```bash
brew tap mongodb/brew
```

## 2. 第二步

```bash
brew install mongodb-community@4.2
```

<!-- more -->

## 3. 启动数据库服务

### 3.1 创建mongo.conf

```bash
systemLog:
  destination: file
  path: /Users/xxx/xxx/data/mongodb/mongo.log
  logAppend: true
storage:
  dbPath: /Users/xxx/xxx/data/mongodb
net:
  bindIp: 127.0.0.1
```

### 3.2 启动

```bash
mongod --config /Users/xxx/xxx/data/mongo.conf
```

:::tip 提示
`/Users/xxx/xxx/data/mongo.conf` 这个3.1创建的mongo.conf
:::

## 4. 测试连接

```bash
mongo
```