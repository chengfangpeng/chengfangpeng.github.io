---
layout:     post
title:      "工厂模式"
subtitle:   " \"工厂模式\""
date:       2017-03-11 12:00:00
author:     "X-ray"
header-img: "img/post-bg-2015.jpg"
tags:
    - 设计模式
---


## 理财产品的创建

开篇先介绍一下我们公司的业务，我们公司是一家金融理财公司。在公司的业务中有很多打包好的理财产品，种类繁多。它们既有很多相似的特征，也有一些区别。不久前，公司的ceo觉得我们的这些理财产品的名称，以及里面包含的专业术语，对于普通的用户理解起来有很大的困难。于是乎，需求出来了，将所有之前的理财产品名称和一些描述，全部换掉。使用一些让用户户更容易理解的名称和描述。但是为了兼容旧的产品种类，我们不能在旧的种类上直接修改，需要将之前的种类，一对一的再新生成一套。面对这样的需求，就要用到我们介绍的工厂模式。



那我们的系统是怎么设计的呢？我们使用了工厂方法模式（factory method pattern）,先看看我们的类图。

﻿



![](http://7xrrm5.com1.z0.glb.clouddn.com//blog/design_pattern/factory_method_practice.png)



类图比较简单, AbsFinancialFactory是一个抽象类，定义了一个产生金融产品的工厂类，FinancialFactory为实现类，完成具体的任务－生成新的理财产品。FinancialProduct是我们的产品抽象类，定义了一些金融产品的共有属性和方法。ImproveSalaryProduct和NewUserFinancialProdcut是我公司旗下的两个具体的理财产品"旺薪宝"和"新手包"。Client则是场景类。



下面我们具体看看代码：

AbsFinancialFactory.java

```



/**

 * 抽象金融产品工厂

 * Created by cfp on 17-3-8.

 */

public abstract class AbsFinancialFactory {



    /**

     * 创建金融产品的工厂类

     * @param c

     * @param <T>

     * @return

     */

    public abstract <T extends FinancialProduct> T createProduct(Class<T> c);

}



```

AbsFinancialFactory是抽象工厂类，定义了创建产品的方法createProduct(Class<T> c)，参数为Class类型。在这里我们使用了泛型，通过定义泛型可以对createProduct的输入参数产生限制：必须是FinancialProduct的实现类，并且是Class类型。





FinancialFactory.java

```



/**

 * 具体产品工厂类

 * Created by cfp on 17-3-8.

 */

public class FinancialFactory extends AbsFinancialFactory{

    @Override

    public <T extends FinancialProduct> T createProduct(Class<T> c) {



        FinancialProduct financialProduct = null;

        try {

            financialProduct = (FinancialProduct) Class.forName(c.getName()).newInstance();

        } catch (Exception e) {

            System.out.print("创建金融产品类失败");

        }

        return (T) financialProduct;

    }

}






```



FinancialFactory是具体的实现类，这里使用了java的反射去创建具体的产品实例。





FinancialProduct.java

```



/**

 * 抽象金融产品类

 * Created by cfp on 17-3-8.

 */

public abstract class FinancialProduct {



    private String mName;

    private float mRate;

    private String mDate;

    private float mTotalMoney;

    private float mAddRate;





    public String getmName() {

        return mName;

    }



    public void setmName(String mName) {

        this.mName = mName;

    }



    public float getmRate() {

        return mRate;

    }



    public void setmRate(float mRate) {

        this.mRate = mRate;

    }



    public String getmDate() {

        return mDate;

    }



    public void setmDate(String mDate) {

        this.mDate = mDate;

    }



    public float getmTotalMoney() {

        return mTotalMoney;

    }



    public void setmTotalMoney(float mTotalMoney) {

        this.mTotalMoney = mTotalMoney;

    }



    public float getmAddRate() {

        return mAddRate;

    }



    public void setmAddRate(float mAddRate) {

        this.mAddRate = mAddRate;

    }



    /**

     * 显示改产品的信息

     */

    public void showInfo(){



       System.out.println( "FinancialProduct{" +

               "mName='" + mName + '\'' +

               ", mRate='" + mRate + '\'' +

               ", mDate='" + mDate + '\'' +

               ", mTotalMoney=" + mTotalMoney +

               ", mAddRate=" + mAddRate +

               '}');

    }



    /**

     * 活动

     */

    public abstract void activity();

}



```



FinancialProduct是抽象的产品类，定义了我们平台产品的一些共同属性和方法。





NewUserFinancialProduct.java

```

/**

 * Created by cfp on 17-3-8.

 */

public class NewUserFinancialProduct extends FinancialProduct{





    @Override

    public void activity() {

        System.out.println( getmName() + "正在搞活动...");

    }

}

```

NewUserFinancialProduct是具体的金融产品类”新手宝“





ImproveSalaryProduct.java

```

/**

 * 旺薪宝

 * Created by cfp on 17-3-8.

 */

public class ImproveSalaryProduct extends FinancialProduct{

    @Override

    public void activity() {

        System.out.println( getmName() + "正在搞活动...");

    }

}

```

ImproveSalaryProduct是具体的金融产品类"旺薪宝"



现在需要看看我们的场景类Client,怎么通过工厂去创建具体的金融产品的。直接上代码：





```

/**

 * Created by cfp on 17-3-8.

 */

public class Client {





    public static void main(String[] args){



        FinancialFactory financialFactory = new FinancialFactory();



        //新手宝

        FinancialProduct newUserProduct = financialFactory.createProduct(NewUserFinancialProduct.class);

        newUserProduct.setmName("新手宝");

        newUserProduct.setmDate("365天");

        newUserProduct.setmTotalMoney(1000000f);

        newUserProduct.setmRate(10f);

        newUserProduct.setmAddRate(0.5f);

        newUserProduct.activity();

        newUserProduct.showInfo();



        //旺薪宝

        FinancialProduct improveSalaryProduct = financialFactory.createProduct(ImproveSalaryProduct.class);

        improveSalaryProduct.setmName("旺薪宝");

        improveSalaryProduct.setmDate("360天");

        improveSalaryProduct.setmTotalMoney(2000000f);

        improveSalaryProduct.setmRate(8.0f);

        improveSalaryProduct.setmAddRate(0.2f);

        improveSalaryProduct.activity();

        improveSalaryProduct.showInfo();

    }

}



```



输出结果:



```

新手宝正在搞活动...

FinancialProduct{mName='新手宝', mRate='10.0', mDate='365天', mTotalMoney=1000000.0, mAddRate=0.5}

旺薪宝正在搞活动...

FinancialProduct{mName='旺薪宝', mRate='8.0', mDate='360天', mTotalMoney=2000000.0, mAddRate=0.2}



Process finished with exit code 0

```

通过结果了解到我们的产品已经成功的生产出来了。



## 工厂方法模式的定义

工厂方法模式(Factory Method Pattern)：定义一个用于创建对象的接口，让子类决定将哪一个类实例化。工厂方法模式让一个类的实例化延迟到其子类。工厂方法模式又简称为工厂模式(Factory Pattern)，又可称作虚拟构造器模式(Virtual Constructor Pattern)或多态工厂模式(Polymorphic Factory Pattern)。工厂方法模式是一种类创建型模式。



工厂方法的通用类图：



![](http://7xrrm5.com1.z0.glb.clouddn.com//blog/design_pattern/factory_method_pattern.png)





在工厂方法模式中，抽象产品类Product负责定义产品的共性，实现事物最抽象的定义。Factory为抽象创建类，具体的实现在ConcreteFactory中完成。工厂方法的模式变种很多。我们来看个比较实用的通用代码。

抽象产品类



```

/**

 * 抽象产品类

 * Created by cfp on 17-3-8.

 */

public abstract class Product {



    //产品类的公共方法

    public void method1(){

     //业务逻辑

    }

    //抽象方法

    public abstract void method2();

}



```



具体产品类，可能有多个。

```

/**

 * 具体产品类

 * Created by cfp on 17-3-8.

 */

public class ConcreteProduct1 extends Product{

    @Override

    public void method2() {

        //业务逻辑

        System.out.print("ConcreteProduct1 method2 execute...");

    }

}

```

```

/**

 * 具体产品类

 * Created by cfp on 17-3-8.

 */

public class ConcreteProduct2 extends Product{

    @Override

    public void method2() {

        //业务逻辑

        System.out.print("ConcreteProduct2 method2 execute...");

    }

}

```



抽象工厂类

```



/**

 * 抽象工厂类

 * Created by cfp on 17-3-8.

 */

public abstract class Factory {



    /**

     * 创建一个产品对象，其输入参数类型就可以自行生成

     * @param c

     * @param <T>

     * @return

     */

    public abstract <T extends Product> T createProduct(Class<T> c);

}

```

具体工厂类



```

/**

 * 具体工厂类

 * Created by cfp on 17-3-8.

 */

public class ConcreteFactory extends Factory{

    @Override

    public <T extends Product> T createProduct(Class<T> c) {



        Product product = null;

        try {

            product = (Product) Class.forName(c.getName()).newInstance();

        } catch (Exception e) {

            System.out.print("创建产品类失败");

        }



        return (T) product;

    }

}

```



场景类



```

/**

 * Created by cfp on 17-3-8.

 */

public class Client {



    public static void main(String[] args){



        Factory factory = new ConcreteFactory();

        Product product = factory.createProduct(ConcreteProduct1.class);

        product.method2();

    }

}

```

该通用代码是一个比较实用、易扩展的框架，当然也可以自行的进行扩展。



## 工厂方法模式的应用

#### 工厂方法模式的优点

首先，良好的封装性，代码结构清晰。一个对象创建是有条件约束的，如一个调用者需要一个具体的产品对象，只要知道这个产品的类名（或约束字符串）就可以了，不用知道创建对象的过程，降低模块之间的耦合。

其次，工厂模式的扩展性非常的好。比如上面的理财产品，我们想再增加一个，只需要新建个具体的产品类就可以了。工厂类不需要任何的修改。

再次，屏蔽产品类。我们不需要关心产品类里的具体实现，只需要关心产品的接口，只要接口保持不变，系统中的上层模块就不会方式变化。



#### 工厂方法模式的缺点

首先，新加产品时需要添加具体的产品类，有时还需要添加具体的工厂类，系统中的类成对增长，增加了系统的复杂性。

其次，为了扩展性，定义了抽象层，增加了系统的理解难度.



## 工厂方法模式的扩展

工厂方法模式有很多的扩展，下面介绍几种常用到的扩展。



- 简化为简单工厂模式

如果一个模块仅需要一个工程类的时候，就没必要把它生产出来，使用静态方法就可以了。根据这个要求，我们可以修改上面的例子为简单工厂模式，将AbsFinancialFactory去掉，修改一下FinancialFactory,类图如下



![](http://7xrrm5.com1.z0.glb.clouddn.com//blog/design_pattern/simple_factory_practice.png)



FinancialProduct类修改为:



```

/**

 * 简单工厂金融产品类

 * Created by cfp on 17-3-8.

 */

public class FinancialFactory{





    public static <T extends FinancialProduct> T createProduct(Class<T> c){

        FinancialProduct financialProduct = null;

        try {

            financialProduct = (FinancialProduct) Class.forName(c.getName()).newInstance();

        } catch (Exception e) {

            System.out.print("创建金融产品类失败");

        }

        return (T) financialProduct;



    }

}



```

场景类



```



/**

 * Created by cfp on 17-3-8.

 */

public class Client {



    public static void main(String[] args) {



        FinancialProduct newUserProduct = FinancialFactory.createProduct(NewUserFinancialProduct.class);

        newUserProduct.setmName("新手宝");

        newUserProduct.setmDate("365天");

        newUserProduct.setmTotalMoney(1000000f);

        newUserProduct.setmRate(10f);

        newUserProduct.setmAddRate(0.5f);

        newUserProduct.activity();

        newUserProduct.showInfo();

    }

}



```



运行结果:



```

新手宝正在搞活动...

FinancialProduct{mName='新手宝', mRate='10.0', mDate='365天', mTotalMoney=1000000.0, mAddRate=0.5}



Process finished with exit code 0



```

我们将之前的工厂方法模式简化成简单工厂模式，代码只需要两个地方发生变化。使的系统变的简单。但是它有个缺点就是工厂类不容易扩展了。





- 升级为多个工厂类

当我们在做一个比较复杂的项目时，经常会遇到初始化一个对象很耗费精力的情况，所有的产品类都放到一个工厂方法中进行初始化会使代码结构不清晰。

考虑到需要清晰，我们就为每个产品定义一个工厂类。具体的类图如下：



![](http://7xrrm5.com1.z0.glb.clouddn.com/multiple_factory_method.png)





每个产品都对应了一个工厂，每个工厂都独立负责创建对应的产品，非常的符合单一责任原则。按照这种模式我们看看代码发生了哪些变化



抽象工厂类



```

/**

 * Created by cfp on 17-3-8.

 */

public abstract class AbsFinancialFactory {



    public abstract FinancialProduct createProduct();

}



```

抽象工厂中的创建方法不再需要传递参数，因为具体的工厂只生产对应的产品。



”新手宝”的工厂



```

/**

 * 新手宝工厂类

 * Created by cfp on 17-3-8.

 */

public class NewUserFinancialFactory extends AbsFinancialFactory{

    @Override

    public FinancialProduct createProduct() {

        return new NewUserFinancialProduct();

    }

}



```



"旺薪宝"的工厂



```



/**

 * 旺薪宝工厂类

 * Created by cfp on 17-3-8.

 */

public class ImproveSalaryFinancialFactory extends AbsFinancialFactory{

    @Override

    public FinancialProduct createProduct() {

        return new ImproveSalaryProduct();

    }

}



```



场景类



```

/**

 * Created by cfp on 17-3-8.

 */

public class Client {



    public static void main(String[] args) {



        //新手宝

        FinancialProduct newUserProduct = new NewUserFinancialFactory().createProduct();

        newUserProduct.setmName("新手宝");

        newUserProduct.setmDate("365天");

        newUserProduct.setmTotalMoney(1000000f);

        newUserProduct.setmRate(10f);

        newUserProduct.setmAddRate(0.5f);

        newUserProduct.activity();

        newUserProduct.showInfo();



        //旺薪宝

        FinancialProduct improveSalaryProduct = new ImproveSalaryFinancialFactory().createProduct();

        improveSalaryProduct.setmName("旺薪宝");

        improveSalaryProduct.setmDate("360天");

        improveSalaryProduct.setmTotalMoney(2000000f);

        improveSalaryProduct.setmRate(8.0f);

        improveSalaryProduct.setmAddRate(0.2f);

        improveSalaryProduct.activity();

        improveSalaryProduct.showInfo();



    }

}



```



运行接口还和前面的一样。

我们回头看一下，每一个产品对应一个工厂，好处是创建的职责单一，代码清晰，但是不好的地方是使扩展变的麻烦，每增加一个产品类需要对应的生成一个工厂类，同时还的维护两个类之间的关系。



当然，在复制的应用中一般都使用多工厂的方法，然后增加一个协调类，避免调用者与各个子工厂交流。，协调类的作用是封装子工厂类，对高层模块暴露统一的接口。



- 替代单例模式

单例模式其实就是内存中只存在一个对象，通过工厂方法模式也可以达到相同的目的。类图如下：



![](http://7xrrm5.com1.z0.glb.clouddn.com/singleton_factory_method.png)





Singleton定义了一个private的无参构造函数。目的是不允许new对象。



```

/**

 * Created by cfp on 17-3-8.

 */

public class Singleton {



    private Singleton(){

    }

    public void doSomething(){

        //业务处理

        System.out.println("我是实例 = " + this);

    }

}



```



Singleton不能通过new来创建一个对象，那么SingletonFactory怎么创建Singleton的对象呢，答案是反射。



```

/**

 * 单例生成工厂

 * Created by cfp on 17-3-8.

 */

public class SingletonFactory {



    private static Singleton singleton;



    static {



        try {

            Class cls = Class.forName(Singleton.class.getName());

            //获取无参构造

            Constructor constructor = cls.getDeclaredConstructor();

            //设置无参构造是可访问的

            constructor.setAccessible(true);

            singleton = (Singleton) constructor.newInstance();



        } catch (Exception e) {

            System.out.println("创建单例失败");

        }

    }



    /**

     * 获取单例

     * @return

     */

    public static Singleton getSingleton(){

        return singleton;

    }

}



```



这样只要在团队内约定好，只能通过SingletonFactory去创建Singleton对象，而不允许其他人在其他类中使用反射获取Singleton的对象，我们就能保证Singleton的实例是唯一的。

现在，在场景类中测试一下最后的结果



```

/**

 * Created by cfp on 17-3-9.

 */

public class Client {



    public static void main(String[] args) {

        Singleton singleton = SingletonFactory.getSingleton();

        singleton.doSomething();

        Singleton singleton2 = SingletonFactory.getSingleton();

        singleton.doSomething();

        Singleton singleton3 = SingletonFactory.getSingleton();

        singleton.doSomething();

    }

}



```

运行结果显示，我么获得确实是单例



```

我是实例 = com.xray.singleton.Singleton@11c10834

我是实例 = com.xray.singleton.Singleton@11c10834

我是实例 = com.xray.singleton.Singleton@11c10834



Process finished with exit code 0

```





## 总结

工厂方法模式适用情况包括：一个类不知道它所需要的对象的类；一个类通过其子类来指定创建哪个对象；将创建对象的任务委托给多个工厂子类中的某一个，客户端在使用时可以无须关心是哪一个工厂子类创建产品子类，需要时再动态指定。






























