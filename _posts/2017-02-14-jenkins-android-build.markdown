---
layout:     post
title:      "Jenkins＋Gradle搭建Android持续集成编译环境"
subtitle:   " Jenkins＋Gradle搭建Android持续集成编译环境"
date:       2017-02-14 12:00:00
author:     "X-ray"
header-img: "img/post-bg-2015.jpg"
tags:
    - Android
---


## 什么是持续集成

持续集成是一种软件开发实践，即开发者多次的将代码集成到主干中，通过持续的编译，能够及时的发现代码库中存在的错误，并且支持测试和产品及时的取包进行测试。

## 集成条件

- 一台持续集成服务器：这台服务器的任务是从代码托管服务器自动拉取最新的代码，并且进行代码的编译和打包输出app的安装包，同时发邮件提示团队的其他成员。一般情况下移动端产品都有Android和IOS两个平台，为了兼顾，会选择Max OSX系统。但本文介绍的话，选择了我自己用的Ubuntu系统，并且只搭建Android端的环境。

- 另外就是需要一个集成工具jenkins



## Jenkins的安装

Jenkins的安装有两种方法

1. 在[Jenkins的官网](https://jenkins.io/)　下载最新的war包。直接在终端中执行下面的命令就可以了(前提安装了jdk并且配置了相关的环境变量)


```

cfp@cfp:~$ java -jar jenkins.war

```


这样Jenkins就启动了，war包中自带jetty服务器，安装现在就完成了。第一次启动Jenkins时，出于安全考虑，Jenkins会自动生成一个随机的按照口令。复制下来一会访问页面的时候需要验证。



2. 通过tomcat部署jenkins,在Ubuntu上安装Tomcat也很简单，一行命令



```

cfp@cfp:~$ sudo apt-get install tomcat7

```


安装成功tomcat后，将第一种方法下载的jenkins的war包放到tomcat的webapps目录下就可以了，具体的位置在


```

/var/lib/tomcat7/webapps

```


下面看看安装的成果：

第一种方法访问


```

http://localhost:8080/

```


第二种方法访问


```

http://localhost:8080/jenkins/

```


在按提示验证过后即可打开jenkins的首页



![](http://7xrrm5.com1.z0.glb.clouddn.com//blog/jenkins/Selection_115.png)




## Jenkins插件的安装

Jenkins构建Android Studio工程需要安装下面的插件

- Gradle plugin: 支持执行gradle构建脚本

- Git plugin: 代码仓库是基于git的话，用于支持Jenkins拉取远程代码。

- SSH Credentials Plugin: SSH 证书插件，用于支持Jenkins支持本地存储SSH证书。

点击Jenkins的系统管理->插件管理->可选插件，里面可以搜到所需要的插件。



tip:如果在下载插件中出现了失败，也可以点到插件详情里，手动的下载下来，然后在插件管理->高级中手动的安装。

## Jenkins全局配置

点击Jenkins首页, 系统管理->全局工具配置，可以进入jenkins的全局配置页面。这个页面中进行jdk,git和gradle的配置


![](http://7xrrm5.com1.z0.glb.clouddn.com//blog/jenkins/Selection_123.png)



![](http://7xrrm5.com1.z0.glb.clouddn.com//blog/jenkins/Selection_124.png)




## Android项目构建配置

- 在Jenkins首页“新建”　－> "构建一个自由风格的软件项目"并输入Item名称

- 这样在Jenkins首页就看到这个项目了，点击进入项目详情页，点击左侧的配置，我们用git仓库为例配置代码库，找到“源码管理”　->选择git,如果使用HTTP协议直接配置HTTP地址即可，如果使用了SSH方式访问git,需要配置Credentials，点击“Add”->jenkins, 在Kind中选择“SSH Username with private key”, Username 选择服务器主机用户，例如:root, Private Key 选择　Enter directly,将你服务器的ssh私钥复制过来，然后保存，这样在Credentials中选择该用户就可以了。


![](http://7xrrm5.com1.z0.glb.clouddn.com//blog/jenkins/Selection_126.png)




![](http://7xrrm5.com1.z0.glb.clouddn.com//blog/jenkins/Selection_125.png)




接下来配置你构建的分支


![](http://7xrrm5.com1.z0.glb.clouddn.com/Selection_127.png)


- 构建

“添加构建步骤”　-> "invoke Gradle script" -> "invoke Gradle" 选择我们在全局工具配置中配置的gradle版本

Tasks配置任务


![](http://7xrrm5.com1.z0.glb.clouddn.com//blog/jenkins/Selection_128.png)



- 构建后操作

获取构建成功后的apk文件，然后发送邮件给相关人员


![](http://7xrrm5.com1.z0.glb.clouddn.com//blog/jenkins/Selection_129.png)




- 点击立即构建，如果没问题的话一会就有构建成功的提示。
















