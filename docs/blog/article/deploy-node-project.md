# Centos安装部署Nodejs项目

## Centos需要安装的软件

> 需要安装的软件`nvm`,`mongodb`,`nodejs`,`npm`,`nginx`,`git`

## 一.nodejs安装
安装nodejs我习惯使用nvm, 因为这样可以对nodejs的版本方便控制
安装方法[https://github.com/creationix/nvm](https://github.com/creationix/nvm)
下载完成后加入系统环境 

```bash
cd ~
source   /root/.bashrc
```
1.先查看node的版本号
```bash
nvm list-remote
```
2.安装
```bash
nvm install node的版本号
```
如果在安装nodejs的时候报错, 可能会是没有安装g++, 可以使用yum安装g++,
命令
```bash
yum -y install gcc+ gcc-c++
```


mongodb,nginx安装使用`yum`

## 二.mongodb安装

1.配置mongodb的yum源

`yum`安装`mongodb`的使用需要先配置仓库

```bash
#cd /etc/yum.repos.d 
#vim mongodb-org-4.0.repo 
```

添加以下内容：（我们这里使用阿里云的源）
```bash
[mongodb-org]
name=MongoDB Repository
baseurl=http://mirrors.aliyun.com/mongodb/yum/redhat/7Server/mongodb-org/4.0/x86_64/
gpgcheck=0
enabled=1
```
这里可以修改 gpgcheck=0, 省去gpg验证

2.安装
```bash
yum -y install mongodb-org
```

3.测试启动服务
```bash
systemctl start mongod.service
```
参考地址[http://www.cnblogs.com/tianyamoon/p/9860656.html](http://www.cnblogs.com/tianyamoon/p/9860656.html)

4.启动完成后如果要对mongodb的数据库设置密码, mongodb设置密码是基于指定数据库来设置的
使用`mongo`命令连接到数据库, 再使用
```bash
db.createUser({ user: "youruser", pwd: "yourpassword", roles: [{ role: "dbOwner", db: "yourdatabase" }] });
```
创建用户名和密码
5.登录测试
```bash
mongo 数据库名 -u 用户名 -p 密码
```

## 三.nginx安装

1.安装
```bash
yum install nginx
```
2.启动
```bash
systemctl start nginx
```
3.设置代理
查看nginx安装位置, 使用一下命令会打印出nginx的安装位置, 配置文件默认在`/etc/nginx/nginx.conf`
```bash
whereis nginx
```
4.默认核心内容样子如下
```bash
server {
    listen       80 default_server;
    listen       [::]:80 default_server;
    server_name  _;
    root         /usr/share/nginx/html;

    # Load configuration files for the default server block.
    include /etc/nginx/default.d/*.conf;

    location / {
    }

    error_page 404 /404.html;
        location = /40x.html {
    }

    error_page 500 502 503 504 /50x.html;
        location = /50x.html {
    }
}
```
5.修改上面的为下面的样子

> `root`响应的路径：配置的路径+完整访问路径(完整的location配置路径+静态文件)

>`alias`响应的路径：配置路径+静态文件(去除location中配置的路径)

```bash
server {
    listen       80 default_server;
    server_name  这里填写域名;
    root         /usr/share/nginx/html;

    # Load configuration files for the default server block.
    include /etc/nginx/default.d/*.conf;

     location / {
        proxy_pass http://127.0.0.1:3000; # 这里是代理地址
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Nginx-Proxy true;
        proxy_redirect off;
    }
    
    location /uploads/{
        alias   /www/blog/uploads/;
    }

    error_page 404 /404.html;
        location = /40x.html {
    }

    error_page 500 502 503 504 /50x.html;
        location = /50x.html {
    }
}
```
6.重启nginx
```bash
nginx -s reload
```
7.如果失败, 则可能需要重新加载下配置文件
```bash
systemctl daemon-reload
```
8.再次重启nginx服务
```bash
systemctl start nginx
```

## 四.git安装

```bash
yum install git
```

生成ssh公钥
```bash
# ssh-keygen -t rsa
```

## 五.启动项目,使用`pm2`
1.安装pm2
```bash
npm install pm2 -g
```
2.启动node项目
```bash
pm2 start app.js --watch
```
