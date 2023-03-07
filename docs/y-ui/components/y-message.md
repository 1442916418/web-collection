# 消息提示

## 组件 show

```html preview
<div class="msg">
  <y-message type="info" show>info</y-message>
  <y-message type="success" show>success</y-message>
  <y-message type="danger" show>danger</y-message>
  <y-message type="warning" show>warning</y-message>
</div>
```

## 尺寸

```html preview
<div class="msg">
  <y-message type="info" show size="small">info small</y-message>
  <y-message type="info" show>info default</y-message>
  <y-message type="info" show size="large">info large</y-message>
</div>
```

## 原型调用

```html preview
<y-button onclick="window.$message.info('info')">info</y-button>
<y-button onclick="window.$message.success('success')">success</y-button>
<y-button onclick="window.$message.danger('danger')">danger</y-button>
<y-button onclick="window.$message.warning('warning')">warning</y-button>
```
