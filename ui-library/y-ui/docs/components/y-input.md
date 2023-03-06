# 输入框

## 展示

```html preview
<y-input></y-input>

## 默认值

```html preview
<y-input default-value="default"></y-input>
```

## 占位

```html preview
<y-input placeholder="请输入"></y-input>
```

## 图标

```html preview
<div class="row">
  <y-input prefix-icon="chart-graph"></y-input>
  <y-input suffix-icon="chart-histogram"></y-input>
</div>

<div class="row">
  <y-input prefix-icon="chart-histogram" suffix-icon="search"></y-input>
</div>

<div class="row">
  <y-input>
    <iconpark-icon slot="prefix" name="chart-graph"></iconpark-icon>
  </y-input>

  <y-input>
    <iconpark-icon slot="suffix" name="chart-histogram"></iconpark-icon>
  </y-input>
</div>
```

## 禁用

```html preview
<y-input disabled></y-input>
```

## 只读

```html preview
<y-input default-value="Tom" readonly></y-input>
```

## 块状

```html preview
<y-input default-value="Tom" block></y-input>
```

## 密码框 类型(password)

```html preview
<y-input type="password"></y-input>
```

## 搜索框 类型(search)

```html preview
<y-input type="search"></y-input>
```

## 数字框 类型(number)

```html preview
<y-input type="number"></y-input>
```

## 最小长度与最大长度

```html preview
<y-input prefix-icon="info" min-length="5" max-length="10"></y-input>
```

## 校验

```html preview
<y-input pattern="^1(3|4|5|6|7|8|9)\d{9}$" placeholder="请输入手机号"></y-input>
```

## 必填项  

```html preview
<y-input required placeholder="请输入"></y-input>
```

## 邮箱  

```html preview
<y-input type="email" placeholder="email"></y-input>
```

## 自定义验证  

```html preview
<y-input placeholder="请输入123" id="custom-input"></y-input>

<script>
function inputCustomCheckValidity() {
  var ele = document.querySelector('#custom-input')

  if (ele) {
    ele.customValidity = {
      method: function (el) {
        return el.value === '123'
      },
      message: '输入错误'
    }
  }
}
inputCustomCheckValidity()
</script>
```

<script>
function inputCustomCheckValidity() {
  var ele = document.querySelector('#custom-input')

  if (ele) {
    ele.customValidity = {
      method: function (el) {
        return el.value === '123'
      },
      message: '输入错误'
    }
  }
}
inputCustomCheckValidity()
</script>

## 忽略验证  

```html preview
<y-input type="email" placeholder="email" no-validate></y-input>
```

## 文本框

```html preview
<y-input type="textarea"></y-input>
```

## 文本框行数

```html preview
<y-input type="textarea" rows="6" block></y-input>
```
