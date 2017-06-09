---
layout:     post
title:      "Django环境配置"
subtitle:   " Django环境配置"
date:       2017-06-09 12:00:00
author:     "X-ray"
header-img: "img/post-bg-2015.jpg"
tags:
    - Python Django
---



## 前言

最近写android写的有点烦了．想搞点服务端的东西，刚开始考虑使用java的，但是java web学起来太麻烦了，而且也不怎么适合练手．正好之前学了些python的语法，而且最近python真的很火，什么大数据，机器学习，人工智能，到现在搞不清，机器学习和人工智能的区别．python有个很火的web框架Django.貌似用的人比较多（有利于收集学习资料），好，就拿你开刀了！

## 安装Django

我用的系统是ubuntu，下面所有的操作默认都是在ubuntu下完成的．

使用python的依赖管理工具pip安装，命令：

```
sudo pip install Django

```
检查一下下是否安装完成:

```
>>> import django
>>> django.VERSION
(1, 9, 6, 'final', 0)
>>>


```

## 搭建多个独立的开发环境
有些时候我们有多个不同的项目，并且每个项目使用的django版本是不一样的,那咋办，这不是坑爹吗，难道需要我们每打开一个项目，就重新安装卸载一次django.这是不可能的，程序猿哪有这么傻．那我们该咋办了．答案是使用virtualenv来管理多个开发环境．同时安装virtualenvwrapper，virtualenvwrapper是virtualenv的封装，可以方便的创建/删除/拷贝/切换不通的环境．
安装virtualenv和virtualenvwrapper

```
sudo pip install virtualenv
sudo pip install virtualenvwrapper

```
修改~/.bash_profile或其它环境变量相关文件(如 .bashrc 或用 ZSH 之后的 .zshrc)，添加以下语句

```
export WORKON_HOME=$HOME/.virtualenvs
export PROJECT_HOME=$HOME/workspace
source /usr/local/bin/virtualenvwrapper.sh

```

使用方法

```
mkvirtualenv env 创建虚拟环境
workon　env　切换到env
deactivate 退出终端环境

```
还有其他的一些方法，有兴趣的可以自己去找．如果使用了ide PyCharm的话创建和使用VirtualEnv就更方便了．创建和查看VirtualEnv可以在

```
File > Settings > Project Interpreter

```

中设置

## 总结

Django环境的配置就介绍到这里，接下来，就到Django的内部去看看，它到底该咋用．
