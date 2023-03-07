# 主题

## 切换  

```html preview
  <y-theme id="theme"></y-theme>
```

<script>
  const themeEle = document.querySelector('#theme')

  if (themeEle) {
    themeEle.addEventListener('change', function (e) {
      changeTheme(e.detail.value)
    })
  }

  function changeTheme(type) {
    if (!type) return

    const css = 'https://1442916418.github.io/web-collection/assets/styles/' + type + '.css'
    const linkEle = document.createElement('link')
    linkEle.id = type
    linkEle.href = css
    linkEle.rel = 'stylesheet'
    linkEle.type = 'text/css'

    document.querySelector('head').appendChild(linkEle)
  }
</script>
