# 单选框

## 展示

```html preview
<y-radio>radio</y-radio>
<y-radio disabled></y-radio>
<y-radio size="large"></y-radio>
<y-radio></y-radio>
<y-radio size="small"></y-radio>
```

## 禁用

```html preview
<y-radio disabled></y-radio>
<y-radio size="large"></y-radio>
<y-radio></y-radio>
<y-radio size="small"></y-radio>
```

## 尺寸

```html preview
<y-radio size="large"></y-radio>
<y-radio></y-radio>
<y-radio size="small"></y-radio>
```

## 组

```html preview
<y-radio name="frame">Vue</y-radio>
<y-radio name="frame">React</y-radio>
<y-radio name="frame">Svelte</y-radio>
```

## 组与默认值

```html preview
<y-radio-group name="frame" default-value="Vue">
  <y-radio>Vue</y-radio>
  <y-radio>React</y-radio>
  <y-radio>Svelte</y-radio>
</y-radio-group>
```

## 校验  

```html preview
<y-radio-group name="frame" required>
  <y-radio>Vue</y-radio>
  <y-radio>React</y-radio>
  <y-radio>Svelte</y-radio>
</y-radio-group>
<y-button onclick="this.previousElementSibling.checkValidity()">校验</y-button>
```
