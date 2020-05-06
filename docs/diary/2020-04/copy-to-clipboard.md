# 复制内容到剪贴板功能

1. 创建textarea/input
2. 把需要复制的内容赋值给texarea/input
3. 将textarea/input添加到body
4. 执行copy命令
5. 移除textarea/input标签

:::warning 注意
input和textarea的区别是: input会把复制的内容在一行内显示, textarea: 会保留换行, 比如我们要复制一段代码的时候可能就需要保留换行格式, 所以这个时候就需要使用`textarea`
:::

```js
function copyTextToClipboard(text) {
  const input = document.createElement('input')
  input.value = text
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
}
```

上面方式可能会在添加删除input元素的时候有闪烁问题, 我们来改进下

```js
function copyTextToClipboard(text) {
  const input = document.createElement('input')
  input.value = text
  input.setAttribute('readonly', '')  // 添加只读属性
  input.style.position = 'absolute'   // 设置绝对定位
  input.style.left = '-99999px'       // 设置偏移, 为了不在可视范围内看到
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
}
```
