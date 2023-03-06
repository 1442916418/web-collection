# 复选框

## 展示

```html preview
<y-checkbox>checkbox</y-checkbox>
<y-checkbox disabled></y-checkbox>
<y-checkbox size="large"></y-checkbox>
<y-checkbox></y-checkbox>
<y-checkbox size="small"></y-checkbox>
```

## 禁用

```html preview
<y-checkbox disabled></y-checkbox>
<y-checkbox size="large"></y-checkbox>
<y-checkbox></y-checkbox>
<y-checkbox size="small"></y-checkbox>
```

## 尺寸

```html preview
<y-checkbox size="large"></y-checkbox>
<y-checkbox></y-checkbox>
<y-checkbox size="small"></y-checkbox>
```

## 圆形复选框

```html preview
<y-checkbox circle>checkbox circle</y-checkbox>
<y-checkbox circle disabled>checkbox disabled</y-checkbox>
<y-checkbox circle size="large"></y-checkbox>
<y-checkbox circle></y-checkbox>
<y-checkbox circle size="small"></y-checkbox>
```

## 校验  

```html preview
<y-checkbox-group name="books" required min="2" max="3">
  <y-checkbox>React</y-checkbox>
  <y-checkbox>Vue</y-checkbox>
  <y-checkbox>Angular</y-checkbox>
  <y-checkbox>Flutter</y-checkbox>
  <y-checkbox>Swift</y-checkbox>
</y-checkbox-group>
<y-button onclick="this.previousElementSibling.checkValidity()">主动校验</y-button>
```
