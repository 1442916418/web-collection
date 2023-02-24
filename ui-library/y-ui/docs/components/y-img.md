# 图片

## 展示

<y-img src="https://kjimg10.360buyimg.com/ott/jfs/t1/124686/11/31072/170103/63bb8037F15537b4b/1e5cf478e1c70f0e.jpg"></y-img>

## 加载错误

<y-img src="https://images.jpg"></y-img>

## 加载错误时，使用默认链接

<y-img src="https://images.jpg" default-src="https://kjimg10.360buyimg.com/ott/jfs/t1/124686/11/31072/170103/63bb8037F15537b4b/1e5cf478e1c70f0e.jpg"></y-img>

## alt

<y-img src="https://kjimg10.360buyimg.com/ott/jfs/t1/124686/11/31072/170103/63bb8037F15537b4b/1e5cf478e1c70f0e.jpg" alt="色彩绚丽的电子调音机器"></y-img>

## 自适应

<p>
  <y-radio name="img-fit" value="cover" checked onchange="document.getElementById('img-fit').fit = this.value">
    cover</y-radio
  >
  <y-radio name="img-fit" value="fill" onchange="document.getElementById('img-fit').fit = this.value"
    >fill
  </y-radio>
  <y-radio name="img-fit" value="contain" onchange="document.getElementById('img-fit').fit = this.value"
    >contain
  </y-radio>
</p>

<y-img src="https://kjimg10.360buyimg.com/ott/jfs/t1/124686/11/31072/170103/63bb8037F15537b4b/1e5cf478e1c70f0e.jpg" alt="色彩绚丽的电子调音机器" fit="cover" id="img-fit"> </y-img>

## 比例

<p>
  <y-radio
    name="img-ratio"
    value="16/9"
    checked
    onchange="document.getElementById('img-ratio').ratio = this.value"
    >16/9</y-radio
  >
  <y-radio name="img-ratio" value="3/2" onchange="document.getElementById('img-ratio').ratio = this.value"
    >3/2
  </y-radio>
  <y-radio name="img-ratio" value="1/1" onchange="document.getElementById('img-ratio').ratio = this.value"
    >1/1
  </y-radio>
</p>

<y-img src="https://kjimg10.360buyimg.com/ott/jfs/t1/124686/11/31072/170103/63bb8037F15537b4b/1e5cf478e1c70f0e.jpg" alt="色彩绚丽的电子调音机器" ratio="16/9" id="img-ratio"> </y-img>

## 懒加载

<y-img lazy src="https://kjimg10.360buyimg.com/ott/jfs/t1/124686/11/31072/170103/63bb8037F15537b4b/1e5cf478e1c70f0e.jpg" alt="色彩绚丽的电子调音机器"> </y-img>

## 预览

<y-img src="https://kjimg10.360buyimg.com/ott/jfs/t1/124686/11/31072/170103/63bb8037F15537b4b/1e5cf478e1c70f0e.jpg" alt="色彩绚丽的电子调音机器" preview lazy> </y-img>
<y-img src="https://kjimg10.360buyimg.com/ott/jfs/t1/46578/15/20761/310339/63bb7deeF3f1d0f82/840fa7b17580b7df.jpg" alt="科幻" preview lazy> </y-img>
<y-img src="https://kjimg10.360buyimg.com/ott/jfs/t1/83382/23/18572/516626/63bb7e15Fd107bbac/b22bf8cfbb11f45c.jpg" alt="星球" preview lazy> </y-img>

## 预览分组

<y-img src="https://kjimg10.360buyimg.com/ott/jfs/t1/161751/30/34214/36269/63bb7baeFe6e44804/c2fd27490c73c231.jpg" alt="猫猫" preview="cat" lazy> </y-img>
<y-img src="https://kjimg10.360buyimg.com/ott/jfs/t1/14933/8/20518/119743/63bb7badFb30ccff5/8768fff06aee58a4.jpg" alt="猫猫" preview="cat" lazy> </y-img>
<y-img src="https://kjimg10.360buyimg.com/ott/jfs/t1/99453/22/36265/134406/63bb7bafF3bea0392/9612c2fc34474fab.jpg" alt="猫猫" preview="cat" lazy> </y-img>

## 自定义 slot - loading

<y-img lazy src="https://kjimg10.360buyimg.com/ott/jfs/t1/124686/11/31072/170103/63bb8037F15537b4b/1e5cf478e1c70f0e.jpg" alt="色彩绚丽的电子调音机器">
  <iconpark-icon slot="loading" name="config" spin></iconpark-icon>
  <iconpark-icon slot="preview" name="area-map"></iconpark-icon>
  <iconpark-icon slot="error" name="moon"></iconpark-icon>
</y-img>

## 自定义 slot - preview

<y-img lazy preview="test" src="https://kjimg10.360buyimg.com/ott/jfs/t1/124686/11/31072/170103/63bb8037F15537b4b/1e5cf478e1c70f0e.jpg" alt="色彩绚丽的电子调音机器">
  <iconpark-icon slot="preview" name="area-map"></iconpark-icon>
</y-img>

## 自定义 slot - error

<y-img lazy src="https://images.jpg" alt="加载错误">
  <iconpark-icon slot="error" name="moon"></iconpark-icon>
</y-img>
