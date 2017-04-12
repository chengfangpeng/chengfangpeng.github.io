---
layout:     post
title:      "Android开发使用枚举"
subtitle:   " \"Android开发使用枚举\""
date:       2017-04-12 12:00:00
author:     "X-ray"
header-img: "img/post-bg-2015.jpg"
tags:
    - Android
---


## 用静态常量代替枚举

在Android的官方文档中，关于枚举的使用，给出的建议是枚举占用的内存是静态常量的两倍，所以建议不要在android中使用枚举。但是枚举有个很重要的优点就是，提供了类型的安全。那么使用静态常量怎么能保障类型的安全呢。使用@IntDef和@StringDef,用来提供编译期的类型检查，使用很简单

以IntDef为例



首先引入依赖:



```

compile 'com.android.support:support-annotations:22.0.0'

```



具体的使用代码



```

public class MainActivity extends AppCompatActivity {

    /** 成功*/

    private static final int SUCCESS = 1;

    /** 失败*/

    private static final int FAIL = 2;

    /** 处理中*/

    private static final int DEALING = 3;



    @IntDef({SUCCESS, FAIL, DEALING})

    @Retention(RetentionPolicy.SOURCE)

    public @interface State{}



    @State

    private int mState;



    @Override

    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);



    }

}

```

这样在事例中给mState变量赋值时就只能限制在我们给出的静态常量了。


