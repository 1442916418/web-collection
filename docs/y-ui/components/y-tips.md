# 气泡提示框

## 展示

```html preview
<y-tips tips="Tips default" style="margin-top: 45px;">
  <y-button>Tips default</y-button>
</y-tips>
```

## 方向

```html preview
<div class="tips-dir-container">
  <span></span>
  <y-tips dir="tl" tips="some tips">
    <y-button>top left</y-button>
  </y-tips>
  <y-tips dir="t" tips="some tips">
    <y-button>top</y-button>
  </y-tips>
  <y-tips dir="tr" tips="some tips">
    <y-button>top right</y-button>
  </y-tips>
  <span></span>
  <y-tips dir="lt" tips="some tips">
    <y-button>left top</y-button>
  </y-tips>
  <span></span>
  <span></span>
  <span></span>
  <y-tips dir="rt" tips="some tips">
    <y-button>right top</y-button>
  </y-tips>
  <y-tips dir="l" tips="some tips">
    <y-button>left</y-button>
  </y-tips>
  <span></span>
  <span></span>
  <span></span>
  <y-tips dir="r" tips="some tips">
    <y-button>right</y-button>
  </y-tips>
  <y-tips dir="lb" tips="some tips">
    <y-button>left bottom</y-button>
  </y-tips>
  <span></span>
  <span></span>
  <span></span>
  <y-tips dir="rb" tips="some tips">
    <y-button>right bottom</y-button>
  </y-tips>
  <span></span>
  <y-tips dir="bl" tips="some tips">
    <y-button>bottom left</y-button>
  </y-tips>
  <y-tips dir="b" tips="some tips">
    <y-button>bottom</y-button>
  </y-tips>
  <y-tips dir="br" tips="some tips">
    <y-button>bottom right</y-button>
  </y-tips>
  <span></span>
</div>
```

## 前缀与后缀

```html preview
<p style="margin-top: 45px;"></p>
<y-tips tips="11" suffix="km/h">
  <y-button>Tips 后缀</y-button>
</y-tips>

<y-tips tips="11" prefix="K">
  <y-button>Tips 前缀</y-button>
</y-tips>
```
