---
tags:
    - css
---
# CSS魔法
## 01. CSS loading...

```html
<div class="loading">
    <div></div>
    <div></div>
    <div></div>
</div>
```

<!-- more -->

```css
@keyframes loading-animate {
    to {
        opacity: 0.1;
    }
}
.loading {
    display: flex;
    justify-content: center;
}
.loading > div {
    width: 20px;
    height: 20px;
    margin: 0 10px;
    border-radius: 50%;
    background-color: #000;
    animation: loading-animate 0.6s infinite alternate;
}
.loading > div:nth-child(2) {
    animation-delay: 0.2s;
}
.loading > div:nth-child(3) {
    animation-delay: 0.3s;
}
```

<div class="loading">
    <div></div>
    <div></div>
    <div></div>
</div>
<style>

@keyframes loading-animate {
    to {
        opacity: 0.1;
    }
}
.loading {
    display: flex;
    justify-content: center;
}
.loading > div {
    width: 20px;
    height: 20px;
    margin: 0 10px;
    border-radius: 50%;
    background-color: #000;
    animation: loading-animate 0.6s infinite alternate;
}
.loading > div:nth-child(2) {
    animation-delay: 0.2s;
}
.loading > div:nth-child(3) {
    animation-delay: 0.4s;
}
</style>

## 02. 恒定宽高比

```html
<div class="css-magic-constant"></div>
```

```css
.css-magic-constant {
    background-color: #0094ff;
    width: 50%;
}
.css-magic-constant::before {
    content: '';
    padding-top:100%;
    float: left;
}
.css-magic-constant::after {
    content: '';
    display: block;
    clear: both;
}
```

<div class="css-magic-constant">
</div>

<style>
.css-magic-constant {
    background-color: #0094ff;
    width: 50%;
}
.css-magic-constant::before {
    content: '';
    padding-top:100%;
    float: left;
}
.css-magic-constant::after {
    content: '';
    display: block;
    clear: both;
}
</style>


## 03. `:not`选择器

> 要求横向布局, 且每个中间有分割线

```html
<ul class="not-selector">
    <li>one</li>
    <li>two</li>
    <li>three</li>
    <li>four</li>
</ul>

<style>
.not-selector {
    display: flex;
}
.not-selector li {
    list-style: none;
    padding: 0 10px;
}
.not-selector li:not(:last-child) {
    border-right: 2px solid #ddd;
}
</style>
```

<ul class="not-selector">
    <li>one</li>
    <li>two</li>
    <li>three</li>
    <li>four</li>
</ul>

<style>
.not-selector {
    display: flex;
}
.not-selector li {
    list-style: none;
    padding: 0 10px;
}
.not-selector li:not(:last-child) {
    border-right: 2px solid #ddd;
}
</style>

## 04. css实现switch组件

```html
<input type="checkbox" class="switch" id="toggle"/><label for="toggle" class="toggle"></label>

<style>
.switch {
    position: absolute;
    left: -10000px;
}
.toggle {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
    background-color: rgba(0,0,0,0.25);
    border-radius: 20px;
}
.toggle::after {
    position: absolute;
    content: '';
    left: 1px;
    top: 1px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: #fff;
    transition: all 0.3s;
}
.switch[type="checkbox"]:checked + .toggle::after {
    transform: translateX(20px);
}
.switch[type="checkbox"]:checked + .toggle {
    background-color: #0094ff;
}
</style>
```

<input type="checkbox" class="switch" id="toggle"/><label for="toggle" class="toggle"></label>

<style>
.switch {
    position: absolute;
    left: -10000px;
}
.toggle {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
    border-radius: 10px;
    background-color: rgba(0,0,0,0.25);
}
.toggle::after {
    position: absolute;
    content: '';
    left: 1px;
    top: 1px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: #fff;
    transition: all 0.3s;
}
.switch[type="checkbox"]:checked + .toggle::after {
    transform: translateX(20px);
}
.switch[type="checkbox"]:checked + .toggle {
    background-color: #0094ff;
}
</style>

## 05. 雕刻文字

```css
.etched-text {
    text-shadow: 0px 2px #fff;
    font-size: 24px;
    font-weight: 700;
    background-color: #faf6fa;
    color: #b8bec5;
    padding: 15px;
}
```

<div class="etched-text">I'm LiYajie</div>

<style>
.etched-text {
    text-shadow: 0px 2px #fff;
    font-size: 24px;
    font-weight: 700;
    background-color: #faf6fa;
    color: #b8bec5;
    padding: 15px;
}
</style>

## 06. 自定义滚动条

```css
.custom-scroll {
    height: 200px;
    background-color: #eee;
    overflow-y: scroll;
    padding: 10px;
    border-radius: 4px;
}
/* 获取到滚动条元素 */
.custom-scroll::-webkit-scrollbar {
    width: 10px;
}
/* 设置滚动条的滚动轨道 */
.custom-scroll::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
}
/* 设置滚动条滑块 */
.custom-scroll::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    border-radius: 10px;
}
```
<div class="custom-scroll">
    <p>我是内容</p>
    <p>我是内容</p>
    <p>我是内容</p>
    <p>我是内容</p>
    <p>我是内容</p>
    <p>我是内容</p>
    <p>我是内容</p>
</div>

<style>
.custom-scroll {
    height: 200px;
    background-color: #eee;
    overflow-y: scroll;
    padding: 10px;
    border-radius: 4px;
}
.custom-scroll::-webkit-scrollbar {
    width: 10px;
}
.custom-scroll::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
}
.custom-scroll::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    border-radius: 10px;
}
</style>

## 07. 环形loading

::: tip
只需要让元素变成原型, 然后设置其中一个边框颜色高亮, 再使用动画`animation`使其无限循环即可
:::

```css
@keyframes cricleloading {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
.cricle-loading {
    width: 25px;
    height: 25px;
    border: 4px solid #ddd;
    border-radius: 50%;
    border-top-color: #0094ff;
    animation: cricleloading 1.2s linear infinite;
}
```

<div class="cricle-loading"></div>

<style>
@keyframes cricleloading {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
.cricle-loading {
    width: 25px;
    height: 25px;
    border: 4px solid #ddd;
    border-radius: 50%;
    border-top-color: #0094ff;
    animation: cricleloading 1.2s linear infinite;
}
</style>
