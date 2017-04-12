---
layout:     post
title:      "Android自定义编译时注解"
subtitle:   " \"自定义编译时注解\""
date:       2017-04-11 12:00:00
author:     "X-ray"
header-img: "img/post-bg-2015.jpg"
tags:
    - Android
---


前言

Android 现在的开源库中大量的使用了注解，无论是运行时注解，还是编译时注解或者是标准的注解都被广泛的使用著名的使用注解的Andorid库有，Retrofit, BufferKnife,Dagger2等。

注解的定义

注解是Java中的一个特性，它是在源代码中插入标签，这些标签在之后的编译和运行中起到某种作用，注解的定义需要注解接口@interface创建，接口的方法对应着注解的元素。我们用一个简单例子，看看一个注解是怎么声明的：

@Retention(RetentionPolicy.CLASS)
@Target(ElementType.FIELD)
public @interface Bind {
    int value();
}
@interface 声明会创建一个实际的Java接口，与其他接口一样，注解也将会编译成.class文件。注解接口中的元素声明实际上是方法声明，注解接口中的方法没有参数，没有throws语句，也不能使用泛型。

标准注解

Java API中默认定义的注解我们称之为标准注解。它们定义在java.lang、java.lang.annotation和javax.annotation包中。按照使用场景不同，可以分为如下3类。

编译相关注解

编译相关注解是给编译器使用的，有以下几种。

@Override: 编译器会检查被注解的方法是否真的重载了一个来自父类的方法，如果没有，编译器会给出错误的提示。
@Deprecated:用来修饰任何不再鼓励使用或已经弃用的属性和方法等。
@Suppress Warning:用于除了包之外的其他声明项中，用来抑制某种类型的警告。
元注解

元注解，顾名思义，就是用来定义和实现注解的注解，总用有如下五种：

@Target:这个注解的取值是一个ElementType类型的数组，用来指定注解所使用的对象范围，总共有十种不同的类型:
元素类型	适用于
ANNOTATION_TYPE	注解类型声明
CONSTRUCTOR	构造函数
FIELD	实例变量
LOCAL_VARIABLE	局部变量
METHOD	方法
PACKAGE	包
PARAMETER	方法参数或构造函数的参数
TYPE	类（包含enum）和接口(包含注解类型)
TYPE_PARAMETER	类型参数
TYPE_USE	类型的用途
@Retention: 用来注明注解的访问范围，也就是在什么级别保留注解，有下面三种选择
@Retention(RetentionPolicy.SOURCE) ,源码级注解，该类型的注解只会保留在.java源码里，源码编译后，注解的信息会被丢弃，不会保留在.class文件中。
@Retention(RetentionPolicy.CLASS), 编译时注解，该类型的注解会被保留在.java和.class中，在执行的过程中会被Java虚拟机丢弃，不会加载到虚拟机中。
@Retention(RetentionPolicy.RUNTIME),运行时注解，java虚拟机在运行时也会保留的注解，可以通过反射机制读取注解的信息(.java源码、.class文件和执行的时候都有注解信息) 
未指定类型时，默认是CLASS类型
@Documented : 表示被修饰的注解应该被包含在被注解项的文档中
@Inherited : 表示该注解是可以被子类继承的。
运行时注解

运行时注解相对比较简单，一般和反射机制配合使用，相比编译时注解性能较低，但灵活性好，实现起来比较简单,可以参考其他文档。

编译时注解

编译时注解能够自动处理Java源文件并生成更多的源码、配置文件、脚本或其他可能想要生成的东西。这些操作都是通过注解处理器生成的。Java编译器集成了注解处理，通过在编译期调用javac -processor命令可以调起注解处理器，他能够允许我们实现编译时注解的功能。

定义注解处理器

在编译期间，编译器会定位到Java源文件的注解，注解处理器会对它感兴趣的注解进行处理。需要注意的是，一个处理器只能生成新的源文件，而不能修改已经存在的文件。注解处理器一般需要继承AbstractProcessor类并实现process方法，同时需要指定这个处理器能够支持的java版本语句如下：

/**
 * Created by cfp on 17-3-29.
 */
@AutoService(Process.class)
public class ViewInjectProcessor extends AbstractProcessor {
    private Messager mMessager;
    private Elements mElementUtils;
    private Filer mFiler;
    private Map<String, ProxyInfo> mProxyMap = new HashMap<String, ProxyInfo>();
    @Override
    public synchronized void init(ProcessingEnvironment processingEnv)
    {
        super.init(processingEnv);
        mMessager = processingEnv.getMessager();
        mMessager.printMessage(Diagnostic.Kind.NOTE , "init..............................");
        mFiler = processingEnv.getFiler();
        mElementUtils = processingEnv.getElementUtils();
    }
    @Override
    public Set<String> getSupportedAnnotationTypes()
    {
        HashSet<String> supportTypes = new LinkedHashSet<>();
        supportTypes.add(Bind.class.getCanonicalName());
        return supportTypes;
    }
    @Override
    public SourceVersion getSupportedSourceVersion()
    {
        return SourceVersion.latestSupported();
    }
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv)
    {
        mMessager.printMessage(Diagnostic.Kind.NOTE , "process..............................");
        mProxyMap.clear();
        Set<? extends Element> elesWithBind = roundEnv.getElementsAnnotatedWith(Bind.class);
        for (Element element : elesWithBind)
        {
            checkAnnotationValid(element, Bind.class);
            VariableElement variableElement = (VariableElement) element;
            //class type
            TypeElement classElement = (TypeElement) variableElement.getEnclosingElement();
            //full class name
            String fqClassName = classElement.getQualifiedName().toString();
            ProxyInfo proxyInfo = mProxyMap.get(fqClassName);
            if (proxyInfo == null)
            {
                proxyInfo = new ProxyInfo(mElementUtils, classElement);
                mProxyMap.put(fqClassName, proxyInfo);
            }
            Bind bindAnnotation = variableElement.getAnnotation(Bind.class);
            int id = bindAnnotation.value();
            proxyInfo.injectVariables.put(id , variableElement);
        }
        for (String key : mProxyMap.keySet())
        {
            ProxyInfo proxyInfo = mProxyMap.get(key);
            try
            {
                JavaFileObject jfo = mFiler.createSourceFile(
                        proxyInfo.getProxyClassFullName(),
                        proxyInfo.getTypeElement());
                Writer writer = jfo.openWriter();
                writer.write(proxyInfo.generateJavaCode());
                writer.flush();
                writer.close();
            } catch (IOException e)
            {
                error(proxyInfo.getTypeElement(),
                        "Unable to write injector for type %s: %s",
                        proxyInfo.getTypeElement(), e.getMessage());
            }
        }
        return true;
    }
    private boolean checkAnnotationValid(Element annotatedElement, Class clazz)
    {
        if (annotatedElement.getKind() != ElementKind.FIELD)
        {
            error(annotatedElement, "%s must be declared on field.", clazz.getSimpleName());
            return false;
        }
        if (ClassValidator.isPrivate(annotatedElement))
        {
            error(annotatedElement, "%s() must can not be private.", annotatedElement.getSimpleName());
            return false;
        }
        return true;
    }
    private void error(Element element, String message, Object... args)
    {
        if (args.length > 0)
        {
            message = String.format(message, args);
        }
        processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, message, element);
    }
}
下面就以ViewInjectProcessor为例，介绍一下注解处理器中各个方法的意义。

void init(ProcessingEnvironment processingEnv):初始化方法被注解处理工具调用，并传入ProcessingEnvironment类型的参数，这个参数提供了很多的工具，如Elements、Messager、Filter等
getSupportedAnnotationTypes() 指定这个注解处理器能够处理的注解类型，返回一个注解类型的集合
getSupportedSourceVersion() 指定注解处理器使用的Java版本,通常返回 SourceVersion.latestSupported()即可。
process(Set annotations, RoundEnvironment roundEnv) 这个方法中实现了注解处理器的具体业务逻辑，根据输入的参数roundEnv可以得到包含特定注解的被注解元素，然后可以编写处理注解的代码和生成Java源码文件的代码等等。
在Java7中可以使用注解来代替上面的getSupportedAnnotationTypes()方法和getSupportedSourceVersion()，如下所示：

/**
 * Created by cfp on 17-3-29.
 */
@SupportedAnnotationTypes({})
@SupportedSourceVersion(SourceVersion.RELEASE_7)
@AutoService(Process.class)
public class ViewInjectProcessor extends AbstractProcessor {
注册注解处理器

注解处理器定义好之后，为了让javac -processor能够进行处理，我们需要把注解处理器打包到一个jar包中，同时，需要在jar文件中添加一个名为javax.annotation.processing.Processor的文件，这个文件在/META-INF/services目录中。javax.annotation.processing.Processor文件中内容是注解处理器的全路径名，如果存在多个注解处理器，以换行进行分割。

另外这个编译的module需要是一个Java Library而不能是Android Library，因为AbsProcessor这个类是在Javax中的，不包含在Android Library的JDK中。

手动执行上面的注册过程其实是很麻烦的，因此google开源了一个库AutoService可以帮我们自动的注册只需要添加@AutoService(Process.class)即可。

android-apt插件

注解处理器所在的jar文件只是在编译的时候起作用，在应用运行的时候就没什么用了，因此在build.gradle中引入依赖时应该以provided方式而不是compile方式引入

provided '依赖'
compile '依赖'
当然，我们可以用另外一种方法，就是使用android-apt插件的方式。它是android-studio中使用的一个处理注解的一个插件，它的作用如下:

只在编译期间引入注解所在函数库的依赖，不会打包到最终的apk包中。
为注解处理器生成的源代码设置好路径，以便android studio能够正确找到。
android-apt的使用比较简单 
在使用到注解处理器函数库的模块中引入插件

apply plugin: 'com.neenbedankt.android-apt'
然后在根目录的build.gradle添加

 dependencies {
               classpath 'com.neenbedankt.gradle.plugins:android-apt:1.8'
    }
最后 
在dependencies中就可以添加依赖

 apt project(':viewinject-compiler')
总结

现在Android许多的开源库中都使用了注解，特别是编译时注解，如果使用的恰当不仅使的api的调用更简单，有些情况会显著的提高应用的性能，具体可以参考ARouter这个项目。
