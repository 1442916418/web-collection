# y-ui

web-components + 拟物风格 UI 组件库

## 运行

```cmd
  gulp
```

```cmd
  npm run build
```

## 注意

- `src\scss\neumorphism\components` 里注释声明需要和 `src\components` 下的文件名相同，否则 `build.js` 无法匹配，示例如下：
- `/*! -button */ ... /*! button- */` && `src\components\button`
