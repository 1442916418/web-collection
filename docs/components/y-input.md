# 输入框

## 展示

<y-input></y-input>

## 默认值

<y-input default-value="default"></y-input>

## 占位

<y-input placeholder="请输入"></y-input>

## 图标

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

## 禁用

<y-input disabled></y-input>

## 只读

<y-input default-value="Tom" readonly></y-input>

## 块状

<y-input default-value="Tom" block></y-input>

## 密码框 类型(password)

<y-input type="password"></y-input>

## 搜索框 类型(search)

<y-input type="search"></y-input>

## 数字框 类型(number)

<y-input type="number"></y-input>

## 最小长度与最大长度

<y-input prefix-icon="info" min-length="5" max-length="10"></y-input>

## 校验

<y-input pattern="^1(3|4|5|6|7|8|9)\d{9}$" placeholder="请输入手机号"></y-input>

## 必填项  

<y-input required placeholder="请输入"></y-input>

## 邮箱  

<y-input type="email" placeholder="email"></y-input>

## 自定义验证  

<y-input placeholder="请输入" id="custom-input"></y-input>

## 忽略验证  

<y-input type="email" placeholder="email" no-validate></y-input>

## 文本框

<y-input type="textarea"></y-input>

## 文本框行数

<y-input type="textarea" rows="6" block></y-input>
