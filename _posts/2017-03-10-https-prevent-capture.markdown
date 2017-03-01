---
layout:     post
title:      "Android防止抓包"
subtitle:   " \"Android防止抓包\""
date:       2017-03-01 12:00:00
author:     "X-ray"
header-img: "img/post-bg-2015.jpg"
tags:
    - Android
---


[1.证书相关玩意](http://www.cnblogs.com/guogangj/p/4118605.html)

[2.android网络安全配置](https://developer.android.com/training/articles/security-config.html?hl=zh-cn#CleartextTrafficPermitted)

[3.Android HTTPS SSL双向验证](http://frank-zhu.github.io/android/2014/12/26/android-https-ssl/)

[4.Android N HTTPS](http://linghaolu.github.io/android-n/2016/03/25/android-n-https.html)

[5.Java和HTTP的那些事 HTTPS和证书](http://www.aneasystone.com/archives/2016/04/java-and-https.html)



## 概述

现在大量的app的api都采用了https传输协议，但是只采用https也不能完全的保障数据的安全，比如使用Fiddler，charles等工具,很容易可以进行中间人攻击，Android N （sdk > =24）在Https的安全性，防止中间人攻击做了加强.

主要的功能如下：

- 自定义信任锚：针对应用的安全连接自定义哪些证书颁发机构 (CA) 值得信任。例如，信任特定的自签署证书或限制应用信任的公共 CA 集。

- 仅调试重写：在应用中以安全方式调试安全连接，而不会增加已安装用户的风险。

- 明文通信选择退出：防止应用意外使用明文通信。

- 证书固定：将应用的安全连接限制为特定的证书。

其中第四条就可以在一定的程度上防止中间人攻击，比如防止Fiddler，charles通过导入自己的证书而进行抓包。具体的配置可以看上面的[参考2].但是对于sdk<24的版本怎么办呢,我可以在代码中固定证书。



## android-async-http设置自定义证书



下面以[android-async-http](https://github.com/loopj/android-async-http) 为例，介绍一下给AsyncHttpClient设置自定义证书验证。直接上代码



```

/** 协议*/

    private static final String X509 = "X.509";

    /** 证书类型*/

    private static final String PKCS12 = "PKCS12";

    private static final String BC = "BC";

    private static final String TRUST = "trust";





 /**

     * 获取固定签名的httpclient

     * @return

     */

    private static AsyncHttpClient getCustomHttpsClient(){

        InputStream ins = null;

        String result = "";

        AsyncHttpClient asyncHttpClient = null;

        try {

            ins = WCGApplicationLike.getInstance().getApplication().getApplicationContext().getResources().openRawResource(R.raw.app);

            CertificateFactory cerFactory = CertificateFactory

                    .getInstance(X509);

            Certificate cer = cerFactory.generateCertificate(ins);

            KeyStore keyStore = KeyStore.getInstance(PKCS12, BC);

            keyStore.load(null, null);

            keyStore.setCertificateEntry(TRUST, cer);

            org.apache.http.conn.ssl.SSLSocketFactory ssl = new org.apache.http.conn.ssl.SSLSocketFactory(keyStore);

            ssl.setHostnameVerifier(org.apache.http.conn.ssl.SSLSocketFactory.STRICT_HOSTNAME_VERIFIER);//记得设置主机为严格认证，这样才会起作用，证书不对时会直接返回请求失败

            SchemeRegistry schReg = new SchemeRegistry();

            schReg.register(new Scheme("http", ssl, 80));

            schReg.register(new Scheme("https", ssl, 443));

            asyncHttpClient = new AsyncHttpClient(schReg);

        } catch (Exception e) {

            asyncHttpClient = new AsyncHttpClient(true,80,443);

        }finally {

            return asyncHttpClient;

        }

    }

```
