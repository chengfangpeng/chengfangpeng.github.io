---

layout:     post

title:      "Android自动化测试工具MonkeyRnnner"

subtitle:   "Android自动化测试工具MonkeyRnnner"

date:       2016-08-26 12:00:00

author:     "X-ray"

header-img: "img/post-bg-2015.jpg"

tags:

    - Android



---





## MonkeyRunner测试环境配置

1. android-sdk

    下载android-sdk，配置android-sdk环境变量（当然也包括java环境，配置JAVA_HOME环境变量）

2. 配置python环境

    MonkeyRunner基于python环境运行，最好下载2.x版的python,因为我测试代码中用的是2.x的python



配置好后输入monkeyrunner命令如果能进入monkeyrunner的命令交互模式证明安装成功

如图：

![](http://7xrrm5.com1.z0.glb.clouddn.com/blog-article-monkeyrunner-Selection_056.png)



## MonkeyRunner简介

MonkeyRunner是什么东西是猴子派来的救兵吗，确实是！MonkeyRunner是Android sdk中一个用于测试的工具，通过它，可以用一个python脚本程序去安装一个android的apk包，运行它，向它发送模拟点击，截取它的用户界面。

下面就是一段很简单的python脚本，通过调用MonkeyRunner的api实现app的自动安装，卸载，截图，打开某个页面。

具体每句代码的作用已经在注释中了



test_install.py



```

#!/usr/bin/env python

# encoding: utf-8



from com.android.monkeyrunner import MonkeyRunner, MonkeyDevice, MonkeyImage

# 该目录是需要改成你自己的目录，将要测试的apk文件放进去，同时产生的截图文件也会保存到该目录下

dir = "/home/cfp/test/"



# 连接手机设备

device = MonkeyRunner.waitForConnection()



# 截图

result = device.takeSnapshot()

# 将截图保存到文件

result.writeToFile(dir + '1.png','png')



# 卸载APP 参数是旺财谷app的包名

device.removePackage('com.yitoudai.wcg')

print ('Uninstall Success!')



# 暂停5秒

MonkeyRunner.sleep(5)



# 截图

result = device.takeSnapshot()

result.writeToFile(dir + '2.png','png')



# 安装新的APP

device.installPackage(dir + 'wcg.apk')

print ('Install Success!')



# 截图

result = device.takeSnapshot()

result.writeToFile( dir + '3.png','png')



# 跳转到主页

device.startActivity(component="com.yitoudai.wcg/.ui.MainActivity")



#暂停目前正在运行的程序指定的秒数

#MonkeyRunner.sleep(秒数，浮点数)

MonkeyRunner.sleep(5)



#获取设备的屏蔽缓冲区，产生了整个显示器的屏蔽捕获。（截图）

result=device.takeSnapshot()

#返回一个MonkeyImage对象（点阵图包装），我们可以用以下命令将图保存到文件

result.writeToFile(dir +'4.png','png')



```



然后在终端中用MonkeyRunner运行test_install.py脚本,就可以看到效果了



```

monkeyrunner test_install.py

```





除了上面脚本文件中用到的命令，还有一些常用的脚本命令

- 重启设备

```

device.reboot()

```

- 点击屏幕,前两个参数是坐标，第三个是点击事件

```

device.touch(100, 100, 'DOWN_AND_UP')

```

- 在设备上弹出提示信息



```

MonkeyRunner.alert("Hello World")

```

- 向编辑区域输入文本“hello”



```

    device.type('hello')

```



下面想特别说一下



```

device.startActivity()这个方法



```

其实官方文档完整的形式是



```

void startActivity ( string uri, string action, string data, string mimetype, iterable categories dictionary extras,component component, iterable flags)



```



上面的栗子，是跳转到一个不需要传参数的页面，但是app中很多页面是需要传参数的，否则这个页面进去会显示不正常，比如标详情页，需要传入标id



那怎么传呢，其实很简短，因为传的是键值对，对应python中的词典。可以这样写：



```

extra={}                   

extra['deal_id'] = '2334'  

device.startActivity(extras = extra, component="com.yitoudai.wcg/.ui.financial.DealDetailActivity")  

```



上面的代码就是跳转到标详情页的实现,标id是2334





## MonkeyRunner 录制和回放脚本



用上面的方法写脚本测试确实很麻烦，而且要求测试对android项目必须的熟悉。有没有更naocan一点的方法呢，回答是yes,它也是android sdk中的一个工具MonkeyRecorder

运行MonkeyRecorder需要两个脚本：



- 录制脚本：recorder.py



```


#!/usr/bin/env monkeyrunner
# Copyright 2010, The Android Open Source Project
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from com.android.monkeyrunner import MonkeyRunner as mr
from com.android.monkeyrunner.recorder import MonkeyRecorder as recorder
device = mr.waitForConnection()
recorder.start(device)

```



- 回放脚本：recorder_playback.py



```

#!/usr/bin/env monkeyrunner
# Copyright 2010, The Android Open Source Project
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import sys
from com.android.monkeyrunner import MonkeyRunner
from com.android.monkeyrunner import MonkeyRunner as mr

# The format of the file we are parsing is very carfeully constructed.
# Each line corresponds to a single command.  The line is split into 2
# parts with a | character.  Text to the left of the pipe denotes
# which command to run.  The text to the right of the pipe is a python
# dictionary (it can be evaled into existence) that specifies the
# arguments for the command.  In most cases, this directly maps to the
# keyword argument dictionary that could be passed to the underlying
# command.

# Lookup table to map command strings to functions that implement that
# command.
CMD_MAP = {
    'TOUCH': lambda dev, arg: dev.touch(**arg),
    'DRAG': lambda dev, arg: dev.drag(**arg),
    'PRESS': lambda dev, arg: dev.press(**arg),
    'TYPE': lambda dev, arg: dev.type(**arg),
    'WAIT': lambda dev, arg: MonkeyRunner.sleep(**arg)
    }
device= mr.waitForConnection(1,"emulator-5556")
# Process a single file for the specified device.
def process_file(fp, device):
    for line in fp:
        (cmd, rest) = line.split('|')
        try:
            # Parse the pydict
            rest = eval(rest)
        except:
            print 'unable to parse options'
            continue

        if cmd not in CMD_MAP:
            print 'unknown command: ' + cmd
            continue

        CMD_MAP[cmd](device, rest)


def main():
    file = sys.argv[1]
    fp = open(file, 'r')

    device = MonkeyRunner.waitForConnection()

    process_file(fp, device)
    fp.close();


if __name__ == '__main__':
    main()

```



当执行



```

monkeyrunner recorder.py

```



会出现下面的窗口

![](http://7xrrm5.com1.z0.glb.clouddn.com/blog-article-monkeyrunner-Selection_057.png)



该窗口的功能：



1. 可以自动显示手机当前的界面

2. 自动刷新手机的最新状态

3. 点击手机界面可以对手机进行操作，同时反应到真机，而且会在右侧插入操作脚本

4.

    - wait: 用来插入下一次操作的时间间隔

    - Press a Button: 用来确定需要点击的按钮，包括menu、home、serach,以及对按钮的press、down、up属性

    - Type Something: 用来输入内容到输入框

    - Fling: 用来进行拖动操作, 可以向上、下、左、右，以及范围的操作

    - Export Actions: 用来导出脚本

    - Refresh Display: 用来刷新手机界面



录制的脚本如下：

recorder_action.py



```

TOUCH|{'x':698,'y':1540,'type':'downAndUp',}

TOUCH|{'x':162,'y':1836,'type':'downAndUp',}

TOUCH|{'x':266,'y':1836,'type':'downAndUp',}

TOUCH|{'x':563,'y':1668,'type':'downAndUp',}

TYPE|{'message':'13310011006',}

TOUCH|{'x':317,'y':424,'type':'downAndUp',}

TYPE|{'message':'aaa111222',}

TOUCH|{'x':1002,'y':152,'type':'downAndUp',}

TOUCH|{'x':982,'y':1692,'type':'downAndUp',}

TOUCH|{'x':587,'y':1736,'type':'downAndUp',}



```



比如上边的脚本是我记录的登陆操作，我们要回放上面的步骤，只需要执行一下上面的recorder_playback.py脚本



```

monkeyrunner recorder_playback.py  recorder_action.py

```



第二个脚本就是录制的脚本文件。



## MonkeyRunner的测试类型

1. 多设备控制

2. 功能测试：例如：你给一个输入框提供值，然后观察输出结果的截屏

3. 回归测试：可以将测试接截屏和正确的结果相比较。MonkeyRunner有个模块提供了该功能。



## 总结

要真正在生产环境中使用MonkeyRunner，需要测试能编写python脚本代码，并且对andrfoid的项目有一定的了解，当然前期可以让开发去编写测试代码，但是，测试至少也的能看懂。上面的内用还处于demo的级别，还需要许多工作去做.







> 路漫漫其修远兮，吾将上下而求索...
