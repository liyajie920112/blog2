---
title: CSS改变图片颜色的方式(滤镜)
tags:
    - css
---

> 图片的处理我们一般会想到ps, 而作为前端开发者, 我们可能会根据不同的状态,处理不同的特效, 图片的对比度,阴影等.那就让我们来看下CSS的滤镜有多强大吧.

<!-- more -->

css包含的预定义的一些效果函数
```css
filter: none        
    | blur() 
    | brightness() 
    | contrast() 
    | drop-shadow() 
    | grayscale() 
    | hue-rotate() 
    | invert() 
    | opacity() 
    | saturate() 
    | sepia() 
    | url();
```

原图如下:

![20210321214247](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210321214247.png)

<style>
.img1{
    filter: blur(2px);
}
.img2{
    filter: brightness(70%);
}
.img3{
    filter: contrast(0.5);
}
.img4{
    filter: drop-shadow(0 0 10px #f00);
}
.img5{
    filter: hue-rotate(90deg);
}
.img6{
    filter: invert(100%);
}
.img7{
    filter:grayscale(80%);
}
.img8{
    filter: sepia(100%);
}
.img9{
    filter: url(#url1);
}
</style>

## 高斯模糊

```css
/*高斯模糊*/
.img{
    filter:blur(2px);
}
```
<img class="img1" src="https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210321214247.png" />

## 线性乘法

```css
/*线性乘法, 让图片更亮或更暗, 100%则和原图一样, 值小于100%则会变暗,反之变亮*/
.img{
    filter: brightness(70%);
}
```
<img class="img2" src="https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210321214247.png" />

## 对比度

```css
/*对比度, 参数可以传入百分比也可以传入数字, 值越大,对比度越明显*/
.img{
    filter: contrast(0.5);
}
```
<img class="img3" src="https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210321214247.png" />

## 通过滤镜给图片添加投影

```css
/*通过滤镜给图片添加投影, 与`box-shadow`的不同除了`inset`属性没有, 其他的都类似, 我们可以利用投影投影出不同颜色的图片, 透明图片的话会比较明显*/
.img{
    filter: drop-shadow(705px 0 0 #ccc);
}
```
<img class="img4" src="https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210321214247.png" />

## 色相旋转

```css
/*hue-rotate(deg) 色相旋转*/
.img{
    filter: hue-route(10deg);
}
```
<img class="img5" src="https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210321214247.png" />

## 反转输入图像 invert

```css
/*invert 反转输入图像, 有点曝光的效果*/
.img{
    filter: invert(100%);
}
```
<img class="img6" src="https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210321214247.png" />

## 将图像转换为灰度图像

```css
/*grayscale 将图像转换为灰度图像*/
.img{
    filter:grayscale(80%);
}
```
<img class="img7" src="https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210321214247.png" />

## 将图像转换为深褐色

```css
/*sepia 将图像转换为深褐色, 颜色比较暖*/
.img{
    filter: sepia(100%);
}
```

<img class="img8" src="https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210321214247.png" />

## url的方式

> url() 的方式比较特别, 可以导入一个svg滤镜, 作为自己的滤镜使用

色板是通过红,蓝,绿加alpha四个通道组成,PS中8位色板就是2^8=256,则每个通道的取值范围是0~255, 所以我们只要改变通道的取值, 就可以为所欲为的改变图片的颜色了, 是不是很神奇.

> svg feColorMatrix方式设置滤镜

```css
<svg height="0" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <filter id="url1">
                <feColorMatrix type="matrix" values="
                3 -1 -1 0 0 /*R*/
               -1 3 -1 0 0 /*G*/
               -1 -1 3 0 0 /*B*/
               0 0 0 1 0" />
        </filter>
    </defs>
</svg>

.img{
    filter: url(#url1);
}
```
<div>
<svg height="0" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <filter id="url1">
                <feColorMatrix type="matrix" values="
                3 -1 -1 0 0
               -1 3 -1 0 0
               -1 -1 3 0 0
               0 0 0 1 0" />
        </filter>
    </defs>
</svg>
</div>
<img class="img9" src="https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210321214247.png" />

> 除了svg feColorMatrix这种方式很有很对方式设置滤镜

### 设置元素对比度滤镜

:::tip
只需要设置`<feFuncR>, <feFuncG>, <feFuncB>`这三个标签的`exponent`属性的值即可
:::

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="display: none;">
    <defs>
        <filter x="0" y="0" width="99999" height="99999" id="highcontrast">
            <feComponentTransfer>
                <feFuncR type="gamma" exponent="1" class="rgb"></fefuncr>
                <feFuncG type="gamma" exponent="1" class="rgb"></fefuncg>
                <feFuncB type="gamma" exponent="1" class="rgb"></fefuncb>
            </feComponentTransfer>
        </filter>
    </defs>
</svg>
```

其他方式, 大家可以研究下SVG

