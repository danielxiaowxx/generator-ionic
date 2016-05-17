
####新建项目

1. 创建项目
```
ionic start [app name] [template]
```

2. 更新项目
```
yo ionic:update-project
```

3. 引入友盟SDK, 并把渠道ID更改为
```
AndroidManifest.xml:
<meta-data android:name="UMENG_CHANNEL" android:value="Channel_ID" />
```

4. 制作<%= appName %>-release-key.keystore文件, 并把密码文件存放在~/.bash_profile中。[参考文档](http://ionicframework.com/docs/guide/publishing.html)
```
keytool -genkey -v -keystore <%= appName %>-release-key.keystore -alias <%= appName %> -keyalg RSA -keysize 2048 -validity 10000
```
```
~/.bash_profile
export <%= snakeCaseAppName %>_storepass=[store password]
export <%= snakeCaseAppName %>_keypass=[key password]
```


####Andoird 发布

1. 修改package.json的version

2. 运行 ./release-android-app.sh (最好执行两次以确保版本更新成功)

3. 到友盟更新各个渠道的包


####IOS 发布

1. 修改package.json的version

2. 运行 ./release-ios-app.sh (最好执行两次以确保版本更新成功)

3. 用xcode打开ios项目, 执行Product > Archive 并上传到apple store




  

   
