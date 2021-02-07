# Fast-UI

### 项目目录结构
> 多平台快速开发的UI模板框架


```
├── common                                    公共模块
    ├── api                                           请求模块
    ├── css                                           公共样式
    ├── minix                                         常用混入
    ├── utils                                         公共方法
        ├── day.js                                    日期格式转换
        ├── message.js                                toast弹窗
        ├── router.js                                 路由
        ├── update-app.js                             APP更新
        ├── upload-file-to-oss.js                     上传文件至阿里OSS
        ├── upload-file-to-qiniu.js                   上传文件至七牛云
        ├── upload-image.js                           上传图片至服务器
        └── validate.js                               验证
    └── config.js                                     配置文件
├── components                                内置公共组件
├── fu-code                              Fast-UI 代码块分包
├── fu-templete                          Fast-UI 模板分包
├── pages                                     项目页面
    ├── tab                                           底部栏目
    └── global-pop                                    压窗屏及公共弹出组件
├── static                                    公共静态资源
├── .editconfig                               编辑器设置
├── .gitignore                                git忽略文件
└── pages.json                                页面配置
```
