# 开发指南

## 启动项目

安装所有依赖

```shell
npm i
```

## 网站预览

使用 `docsify` 启动，需要全局安装 [docsify](https://docsify.js.org)  

```shell
npm run docs
```

## 本地开发

1.编译 `sass`

```shell
npm run css
```

2.配置 `css` 到组件中

```shell
npm run build
```

3.启动，需要全局安装 [serve](https://www.npmjs.com/package/serve)

```shell
npm run serve
```

## 添加新组件

使用命令创建基础组件，修改 `new` 命令的 **FILE_NAME** 为组件名称(中划线命名法)

```shell
npm run new
```

## 注意

- `src\scss\neumorphism\components` 里的注释名称需要和 `src\components` 组件文件夹名称一样，示例请使用 `new` 命令查看
