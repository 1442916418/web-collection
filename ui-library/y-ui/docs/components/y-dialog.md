# 对话框

## 原型调用

```html preview
<y-button onclick="window.$dialog.alert('alert' )">alert</y-button>
<y-button onclick="window.$dialog.info('info')">info</y-button>
<y-button onclick="window.$dialog.success('success')">success</y-button>
<y-button onclick="window.$dialog.danger('danger')">danger</y-button>
<y-button onclick="window.$dialog.warning('warning')">warning</y-button>
<y-button onclick="window.$dialog.confirm('confirm')">confirm</y-button>
```

## 尺寸

```html preview
<y-button onclick="window.$dialog.alert('alert', null, 'small' )">alert small</y-button>
<y-button onclick="window.$dialog.alert('alert', null, 'large' )">alert large</y-button>
```

## 主题

```html preview
<y-button onclick="window.$dialog.alert('alert', null, null, 'dark' )">alert theme dark</y-button>
```
