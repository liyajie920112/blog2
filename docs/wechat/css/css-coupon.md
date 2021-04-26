---
title: CSS 实现优惠券的技巧
quote: 原创 严文彬 阅文前端团队 公众号:yuewen_YFE
tags:
  - css
  - 收藏
  - 非原创
---
在实际 Web 开发过程中，总会遇到各种各样的布局。有公司同事问我这样一种布局有没有什么好的实现方式，就是一种在活动充值页非常普遍的优惠券效果，如下

![](https://mmbiz.qpic.cn/mmbiz_png/HGCZWzWIk2lc7lsskuJx8vuZKTnVA0xvAVLdtAHDzZMmYjee30q8eQsOtOrZXgaRTbQezlxebpU2hiaEiaO3Wiauw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

<!-- more -->

还有这样的

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426142919.webp)

考虑到各种可能出现的场景，抽象出以下几种案例，一起来看看实现吧

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426143450.webp)

## 一、最佳实现方式

首先，碰到这类布局的最佳实现肯定是mask遮罩\[1\]。关于遮罩，可以看一下CSS3 Mask 安利报告\[2\]。这里简单介绍一下

基本语法很简单，和**background**的语法基本一致

```css
.content{
  -webkit-mask: '遮罩图片' ;
}
/*完整语法*/
.content{
  -webkit-mask: '遮罩图片' [position] / [size] ;
}
```

这里的遮罩图片和背景的使用方式基本一致，可以是**PNG图片**、**SVG图片**、也可以是**渐变绘制**的图片，同时也支持**多图片叠加**。

遮罩的原理很简单，**最终效果只显示不透明的部分，透明部分将不可见，半透明类推**

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426100453.webp)

> 事实上，除了根据透明度（Alpha）来作为遮罩条件，还可以通过亮度（luminance）来决定，比如白色表示隐藏，黑色表示可见。不过目前只有 Firefox 支持

所以，只要能绘制以上各种形状，就可以实现了。

## 二、内凹圆角

优惠券大多有一个很明显的特点，就是**内凹圆角**。提到圆角，很容易想到radial-gradient\[3\]。这个语法有点复杂，记不住没关系，可以看看张老师的这篇10个demo示例学会CSS3 radial-gradient径向渐变\[4\]。

```css
.content{
  -webkit-mask: radial-gradient(circle at left center, transparent 20px, red 20px); 
}
```

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426143612.webp)

这样就绘制了一个半径为 20px 的透明的圆，不过代码层面还有很多优化的空间。

1.在实现边界分明的渐变时，后面颜色的位置只需要小于等于前面颜色的位置就行了，比如**0**2.透明颜色可以用**16进制**缩写比如**#0000**来代替**，**不透明的部分随便用一个颜色就好，我喜欢用**red**，主要是这个单词比较短3.还有渐变的位置默认是居中的，所以第二个center可以去除，left 可以用**0**来表示

进一步简化就得到了

```css
.content{
  -webkit-mask: radial-gradient(circle at 0, #0000 20px, red 0); 
}
```

不错，又少了好几个B的流量~ 可以查看在线实例codepen 优惠券实现1\[5\]

## 三、优惠券效果

上面是一个最基本的内凹圆角效果，现在来实现下面几种布局，比如两个半圆的，根据上面的例子，再复制一个圆不就可以了？改一下定位的方向

```css
.content{
  -webkit-mask: radial-gradient(circle at 0, #0000 20px, red 0), radial-gradient(circle at right, #0000 20px, red 0); 
}
```

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426143752.webp)

这时发现一个圆都没有了。原因其实很简单，如下演示，**两层背景相互叠加，导致整块背景都成了不透明的**，所以 mask 效果表现为全部可见。

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426143810.gif)

解决方式有2个，分别是：

1.**把两个凹角的地方错开，这里可以通过修改尺寸和位置，同时还需要禁止平铺**

```css
.content{
  -webkit-mask: radial-gradient(circle at 0, #0000 20px, red 0), radial-gradient(circle at right, #0000 20px, red 0);
  -webkit-mask-size: 51%; /*避免出现缝隙*/
  -webkit-mask-position: 0, 100%; /*一个居左一个居右*/
  -webkit-mask-repeat: no-repeat;
}
```

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426143909.webp)

动态演示如下，这样就不会互相覆盖了

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426143927.gif)

可以查看在线实例codepen 优惠券实现2

2.**使用遮罩合成**mask-composite**，这个可能不太熟悉，简单介绍一下**

标准属性下**mask-composite**有 4 个属性值（Firefox支持）

```css
/* Keyword values */
mask-composite: add; /* 叠加（默认） */
mask-composite: subtract; /* 减去，排除掉上层的区域 */
mask-composite: intersect; /* 相交，只显示重合的地方 */
mask-composite: exclude; /* 排除，只显示不重合的地方 */
```

这个可能有些不好理解，其实可以参考一些图形软件的形状合成操作，比如 photoshop

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426144139.webp)

-webkit-mask-composite\[6\]与标准下的值有所不同，属性值非常多，看下面

```css
-webkit-mask-composite: clear; /*清除，不显示任何遮罩*/
-webkit-mask-composite: copy; /*只显示上方遮罩，不显示下方遮罩*/
-webkit-mask-composite: source-over; 
-webkit-mask-composite: source-in; /*只显示重合的地方*/
-webkit-mask-composite: source-out; /*只显示上方遮罩，重合的地方不显示*/
-webkit-mask-composite: source-atop;
-webkit-mask-composite: destination-over;
-webkit-mask-composite: destination-in; /*只显示重合的地方*/
-webkit-mask-composite: destination-out;/*只显示下方遮罩，重合的地方不显示*/
-webkit-mask-composite: destination-atop;
-webkit-mask-composite: xor; /*只显示不重合的地方*/
```

是不是一下就懵了？不用慌，可以看到上面有几个值是**source-***，还有几个是**destination-***开头的，**source 代表新内容**，也就是上面绘制的图层，**destination 代表元内容**，也就是下面绘制的图层（**在CSS中，前面的图层会覆盖后面的图层**），这里的属性值其实是借用了Canvas 中的概念，具体可以查看CanvasRenderingContext2D.globalComposite\[7\]

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426144350.webp)

记不住没关系，实际开发可以逐一试验\[\\捂脸\]。具体差异可以查看codepen -webkit-mask-composite 属性值演示\[8\]

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426144408.gif)

了解这个属性后，上面的叠加问题就很简单了，设置**只显示重合的地方**就行了

```css
.content{
  -webkit-mask: radial-gradient(circle at 0, #0000 20px, red 0), radial-gradient(circle at right, #0000 20px, red 0); 
  -webkit-mask-composite: source-in | destination-in ; /*chrome*/
  mask-composite: intersect; /*Firefox*/
}
```

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426143909.webp)

动态演示如下，这样只会显示**互相重合的地方**

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426144530.gif)

可以查看在线实例codepen 优惠券实现3\[9\]

2个圆角的实现了，4个的就很容易了，画4个圆就行，同样利用遮罩合成可以轻易实现

```css
content{
  -webkit-mask: radial-gradient(circle at 0 0, #0000 20px, red 0), radial-gradient(circle at right 0, #0000 20px, red 0), radial-gradient(circle at 0 100%, #0000 20px, red 0), radial-gradient(circle at right 100%, #0000 20px, red 0); /*4个角落各放一个圆*/
  -webkit-mask-composite: source-in | destination-in ; /*chrome*/
  mask-composite: intersect; /*Firefox*/
}
```

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426144549.webp)

可以查看在线实例codepen 优惠券实现4\[10\]

## 四、优惠券平铺效果

上面的例子展示了2个圆角和4个圆角的效果，分别绘制了2个和4个圆，其实这是可以通过平铺来实现的，只需要一个圆就可以。实现步骤如下

1.**画一个左中的靠边的透明圆**

```css
.content{
  -webkit-mask: radial-gradient(circle at 20px, #0000 20px, red 0); 
}
```

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426144608.webp)

2.**向左平移自身的一半**

```css
.content{
  -webkit-mask: radial-gradient(circle at 20px, #0000 20px, red 0); 
  -webkit-mask-position: -20px
}
/*也可以缩写为*/
.content{
  -webkit-mask: radial-gradient(circle at 20px, #0000 20px, red 0) -20px; 
}
```

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426144623.webp)

效果就出来了，是不是很神奇？其实就是利用到了默认的**repeat特性**，这里用一张动图就能明白了

> 下面**红色边框内表示视区范围**，也就是最终的效果，这里为了演示，把视线之外的**平铺**做了半透明处理，移动表示 position 改变的过程

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426144641.gif)

可以查看在线实例codepen 优惠券实现5\[11\]

同样原理，4个圆角也可以采用这种方式实现

```css
.content{
  -webkit-mask: radial-gradient(circle at 20px 20px, #0000 20px, red 0); 
  -webkit-mask-position: -20px -20px;
}
/*也可以缩写为*/
.content{
  -webkit-mask: radial-gradient(circle at 20px 20px, #0000 20px, red 0) -20px -20px; 
}
```

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426144702.webp)

实现原理演示如下

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426144717.gif)

可以查看在线实例codepen 优惠券实现6\[12\]

6个圆角就需要改一下平铺尺寸了。

```css
.content{
  -webkit-mask: radial-gradient(circle at 20px 20px, #0000 20px, red 0); 
  -webkit-mask-position: -20px -20px;
  -webkit-mask-size: 50%;
}
/*也可以缩写为*/
.content{
  -webkit-mask: radial-gradient(circle at 20px 20px, #0000 20px, red 0) -20px -20px / 50%; 
}
```

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426144746.webp)

实现原理演示如下

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426144801.gif)

可以查看在线实例codepen 优惠券实现7\[13\]

如果继续缩小背景图的尺寸，还可以得到最后的效果

```css
.content{
  -webkit-mask: radial-gradient(circle at 10px, #0000 10px, red 0); 
  -webkit-mask-position: -10px;
  -webkit-mask-size: 100% 30px;
}
/*也可以缩写为*/
.content{
  -webkit-mask: radial-gradient(circle at 20px 20px, #0000 20px, red 0) -10px / 100% 30px; 
}
```

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426144816.webp)

实现原理演示如下，其实就平铺

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426144829.gif)

可以查看在线实例codepen 优惠券实现8\[14\]

## 五、反向镂空叠加

有些情况下可能单一的一层渐变绘制不了很复杂的图形，这就需要用到反向镂空技术了，其实就是上面提到过的**遮罩合成**，这里再运用一下

1.**先把上面的实现拿过来**

```css
.content{
  -webkit-mask: radial-gradient(circle at 20px 20px, #0000 20px, red 0) -20px -20px / 50%; 
}
```

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426144746.webp)

1.**直接在这个基础上打一排小洞**

```css
.content{
  -webkit-mask: radial-gradient( circle at 50%, red 5px, #0000 0) 50% 50% / 100% 20px, radial-gradient(circle at 20px 20px, #0000 20px, red 0) -20px -20px / 50%;
  -webkit-mask-composite: destination-out;
  mask-composite: subtract; /*Firefox*/
}
```

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426144951.webp)

注意这里用到了**-webkit-mask-composite: destination-out**，**表示减去，只显示下方遮罩，重合的地方不显示**

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426145015.gif)

可以查看在线实例codepen 优惠券实现9\[15\]

也可以放在两边，改一下**position**就可以了

```css

.content{
  -webkit-mask: radial-gradient( circle at 5px, red 5px, #0000 0) -5px 50% / 100% 20px, radial-gradient(circle at 20px 20px, #0000 20px, red 0) -20px -20px / 50%;
  -webkit-mask-composite: destination-out;
  mask-composite: subtract; /*Firefox*/
}
```

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426145040.webp)

可以查看在线实例codepen 优惠券实现10\[16\]

## 六、边框遮罩

有些同学觉得**径向渐变太复杂，实在是写不出来，能不能用图片代替呢**？其实也是可行的。这里说的边框遮罩指的是mask-border\[17\], 目前还在 W3C 草案当中，不过有一个替代属性-webkit-mask-box-image\[18\]

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426145056.webp)

语法和概念和border-image\[19\]非常相似，关于**border-image**可参考这篇文章border-image 的正确用法\[20\]，这里主要了解一下用法和效果

```css

.content{
  -webkit-mask-box-image: '遮罩图片' [<top> <right> <bottom> <left> <x-repeat> <y-repeat>]
}
```

比如有一张这样的图片

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426145112.webp)

SVG代码长这样，很多工具都可以导出来，实在不会可以直接找设计同学

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="60.031" height="60.031" viewBox="0 0 60.031 60.031">
  <path d="M40 60.027H20.129A20.065 20.065 0 0 0 .065 40H0V20.127h.065A20.066 20.066 0 0 0 20.131.061v-.065H40v.065a20.065 20.065 0 0 0 20.027 20.064V40A20.063 20.063 0 0 0 40 60.027z" fill-rule="evenodd"/>
</svg>
```

这里需要转义一下，可借助张老师的SVG在线合并工具\[21\]

```css
.content{
  -webkit-mask-box-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60.031' height='60.031' viewBox='0 0 60.031 60.031'%3E%3Cpath d='M40 60.027H20.129A20.065 20.065 0 0 0 .065 40H0V20.127h.065A20.066 20.066 0 0 0 20.131.061v-.065H40v.065a20.065 20.065 0 0 0 20.027 20.064V40A20.063 20.063 0 0 0 40 60.027z' fill-rule='evenodd'/%3E%3C/svg%3E") 20;
  /*这里的20表示四周保留20像素的固定区域，剩余部分平铺或者拉伸*/
}
```

然后就实现了这样一个形状，同样是自适应的

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426144702.webp)

可以查看在线实例codepen -webkit-mask-box-iamge 实现1\[22\]

再比如有一张这样的图片

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426145223.webp)


```css
.content{
  -webkit-mask-box-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60.031' height='60.031' viewBox='0 0 60.031 60.031'%3E%3Cpath d='M55.186 30.158a4.965 4.965 0 0 0 4.841 4.959V40A20.063 20.063 0 0 0 40 60.027H20.129A20.065 20.065 0 0 0 .065 40H0v-4.888c.054 0 .1.016.158.016a4.973 4.973 0 1 0 0-9.945c-.054 0-.1.014-.158.015v-5.074h.065A20.066 20.066 0 0 0 20.131.058v-.065H40v.065a20.065 20.065 0 0 0 20.027 20.064v5.07a4.965 4.965 0 0 0-4.841 4.966z' fill-rule='evenodd'/%3E%3C/svg%3E") 20;
}
```

可以得到这样一个形状，两侧的半圆被拉伸了

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426145242.webp)

这时只需要设置平铺方式**-webkit-mask-box-image-repeat ,**这个和border-image-repeat\[23\]是一样的概念，有以下 4 个值

```css
-webkit-mask-box-image-repeat: stretch; /*拉伸(默认)，不会平铺*/
-webkit-mask-box-image-repeat: repeat; /*重复*/
-webkit-mask-box-image-repeat: round; /*重复，当不能整数次平铺时，根据情况拉伸。*/
-webkit-mask-box-image-repeat: space; /*重复，当不能整数次平铺时，会用空白间隙填充*/
```

几种平铺方式的差异如下

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426145414.webp)

这里我们可以采用**round**或者**repeat**

```css
.content{
  -webkit-mask-box-image: url("...") 20;
  -webkit-mask-box-image-repeat: round;
}
```

![](https://raw.githubusercontent.com/liyajie920112/images/main/blog/20210426145257.webp)

可以查看在线实例codepen -webkit-mask-box-iamge 实现2\[24\]

## 七、总结和说明

以上一共介绍了12种绘制优惠券的案例，应该可以解决掉绝大部分这类布局的问题，这里总结以下几点

1.**CSS mask**一定是这类布局最完美的实现方式2.需要**CSS radial-gradient**绘制图形的技巧3.尽可能采用**repeat**来重复相同的元素4.多种形状叠加时需要灵活运用**mask-composite**5.也可以采用图片来代替CSS渐变，需要使用**mask-border**

关于兼容性，其实不考虑 IE 都没有什么大问题，最后的 mask-border 目前只兼容 chrome 内核，移动端可放心使用

感谢阅读，希望能对日后的工作有所启发。

### References

`[1]` mask遮罩: *https://developer.mozilla.org/zh-CN/docs/Web/CSS/mask?fileGuid=fKc3ePJfifoZewha*
`[2]` CSS3 Mask 安利报告: *https://jelly.jd.com/article/6006b1045b6c6a01506c87bb?fileGuid=fKc3ePJfifoZewha*
`[3]` radial-gradient: *https://developer.mozilla.org/zh-CN/docs/Web/CSS/radial-gradient()?fileGuid=fKc3ePJfifoZewha*
`[4]` 10个demo示例学会CSS3 radial-gradient径向渐变: *https://www.zhangxinxu.com/wordpress/2017/11/css3-radial-gradient-syntax-example/?fileGuid=fKc3ePJfifoZewha*
`[5]` codepen 优惠券实现1: *https://codepen.io/xboxyan/pen/BaQXQXB?fileGuid=fKc3ePJfifoZewha*
`[6]` -webkit-mask-composite: *https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-mask-composite?fileGuid=fKc3ePJfifoZewha*
`[7]` CanvasRenderingContext2D.globalComposite: *https://www.canvasapi.cn/CanvasRenderingContext2D/globalCompositeOperation?fileGuid=fKc3ePJfifoZewha*
`[8]` codepen -webkit-mask-composite 属性值演示: *https://codepen.io/xboxyan/pen/RwKbGwN?fileGuid=fKc3ePJfifoZewha*
`[9]` codepen 优惠券实现3: *https://codepen.io/xboxyan/pen/rNWXmbm?fileGuid=fKc3ePJfifoZewha*
`[10]` codepen 优惠券实现4: *https://codepen.io/xboxyan/pen/jOVgwOq?fileGuid=fKc3ePJfifoZewha*
`[11]` codepen 优惠券实现5: *https://codepen.io/xboxyan/pen/MWbNozQ?fileGuid=fKc3ePJfifoZewha*
`[12]` codepen 优惠券实现6: *https://codepen.io/xboxyan/pen/mdONMwR?fileGuid=fKc3ePJfifoZewha*
`[13]` codepen 优惠券实现7: *https://codepen.io/xboxyan/pen/PobMKyE?fileGuid=fKc3ePJfifoZewha*
`[14]` codepen 优惠券实现8: *https://codepen.io/xboxyan/pen/zYogbQJ?fileGuid=fKc3ePJfifoZewha*
`[15]` codepen 优惠券实现9: *https://codepen.io/xboxyan/pen/vYyoMoZ?fileGuid=fKc3ePJfifoZewha*
`[16]` codepen 优惠券实现10: *https://codepen.io/xboxyan/pen/BaQXeNV?fileGuid=fKc3ePJfifoZewha*
`[17]` mask-border: *https://www.w3.org/TR/css-masking-1/#mask-borders?fileGuid=fKc3ePJfifoZewha*
`[18]` -webkit-mask-box-image: *https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-mask-box-image?fileGuid=fKc3ePJfifoZewha*
`[19]` border-image: *https://developer.mozilla.org/en-US/docs/Web/CSS/border-image?fileGuid=fKc3ePJfifoZewha*
`[20]` border-image 的正确用法: *https://jelly.jd.com/article/6006b1045b6c6a01506c87bc?fileGuid=fKc3ePJfifoZewha*
`[21]` SVG在线合并工具: *https://www.zhangxinxu.com/sp/svgo/?fileGuid=fKc3ePJfifoZewha*
`[22]` codepen -webkit-mask-box-iamge 实现1: *https://codepen.io/xboxyan/pen/oNBvZmb?fileGuid=fKc3ePJfifoZewha*
`[23]` border-image-repeat: *https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-image-repeat?fileGuid=fKc3ePJfifoZewha*
`[24]` codepen -webkit-mask-box-iamge 实现2: *https://codepen.io/xboxyan/pen/gOgYWej?fileGuid=fKc3ePJfifoZewha*
