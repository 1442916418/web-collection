# 表单

## 展示  

<y-form>
  <y-form-item legend="user">
    <y-input name="user" placeholder="User"></y-input>
  </y-form-item>
  <y-form-item legend="password">
    <y-input name="password" type="password" required placeholder="Password"></y-input>
  </y-form-item>
</y-form>

## 风格  

<y-radio-group id="mode-type-radio-group" default-value="normal">
  <y-radio value="normal">两栏布局</y-radio>
  <y-radio value="full">通栏布局</y-radio>
  <y-radio value="none">自定义布局</y-radio>
</y-radio-group>

<y-form id="form-mode-type">
  <y-form-item legend="user">
    <y-input name="user" placeholder="User"></y-input>
  </y-form-item>
  <y-form-item legend="password">
    <y-input name="password" type="password" required placeholder="Password"></y-input>
  </y-form-item>
  <y-form-item>
    <y-button type="submit">Submit</y-button>
    <y-button type="reset">Reset</y-button>
  </y-form-item>
</y-form>

## 无验证  

<y-form action="/login" method="post" no-validate>
  <y-form-item legend="user">
    <y-input name="user" placeholder="User"></y-input>
  </y-form-item>
  <y-form-item legend="password">
    <y-input name="password" type="password" required placeholder="Password"></y-input>
  </y-form-item>
  <y-form-item>
    <y-button type="submit">Submit</y-button>
    <y-button type="reset">Reset</y-button>
  </y-form-item>
</y-form>

## 自定义提交  

<y-form id="custom-form">
  <y-form-item legend="user">
    <y-input name="user" placeholder="User"></y-input>
  </y-form-item>
  <y-form-item legend="password">
    <y-input name="password" type="password" required placeholder="Password"></y-input>
  </y-form-item>
  <y-form-item>
    <y-button type="submit" id="custom-submit">Submit</y-button>
    <y-button type="reset">Reset</y-button>
  </y-form-item>
</y-form>

<script>
function changeFormModeType(e) {
  const radioGroup = document.querySelector('#mode-type-radio-group')

  if (radioGroup) {
    radioGroup.addEventListener('change', function (e) {
      const ele = document.querySelector('#form-mode-type')
      console.log('🚀 ~ file: index.html:1027 ~ ele:', ele, e.detail.value)

      if (ele) {
        ele.setAttribute('mode-type', e.detail.value)
      }
    })
  }
}

function customFormSubmit() {
  const btn = document.querySelector('#custom-submit')

  if (!btn) return

  btn.onclick = function () {
    const form = document.querySelector('#custom-form')
    // form.formData（默认为 formData 格式数据）
    // form.formData.json（json格式数据）

    console.log('formData', form.formData)
    console.log('formData JSON', form.formData.json)
  }
}

changeFormModeType()
customFormSubmit()
</script>
