---
title: 正则表达式的基本使用
tags:
  - regex
  - 正则表达式
---

> 推荐正则测试网站: [https://regexr.com/](https://regexr.com/)

## 1. 基本匹配

'name' => my `name` is Paul.

'Paul' => my name is `Paul`.

## 2. 元字符匹配

| 字符 | 描述 |
|---|---|
| . | 匹配任意单个字符,换行符除外 |
| [] | 匹配方括号之间任意字符 |
| [^] | 否定字符类。匹配方括号之间不包含的任何字符 |
| * | 匹配前面的 0 次或多次重复 |
| + | 匹配前面的 1 次或多次重复 |
| ? | 前面字符可选 |
| {n,m} | 最少n个,不超过m个 |
| (xyz) | 对xyz分组 |
|  \|  | 或 |
| \ | 转义 |
| ^ | 以什么开头 |
| $ | 以什么结尾 |

### 2.1 `.`

'.l' => I'm Pa`ul`, can you he`lp` me.

### 2.2 `[]  [^]`

'[Tt]he' => `The` car parked in `the` garage.

'[T]he' => `The` car parked in the garage.

'ar[k]' => The car p`ark`ed in the garage.

'ar[ka]' => The car p`ark`ed in the g`ara`ge.

::: tip 匹配ar开头, 并且ar后面的字符不是k的所有
'ar[^k]' => The car parked in the g`ara`ge.
:::

### 2.3 `*  +`

::: tip 匹配所有`a-z`并且出现0次或多次重复
'[a-z]*' => T`he car parked in the garage` 21 `name`.
:::

::: tip 匹配出cat并且前后出现过空格0次或多次重复
'\s*cat\s*' The fat `cat` sat on the con`cat`enation.
:::

::: tip 匹配出`c`开头, c后面至少一个字符, 出现t至少一次或多次

The fat cat sat on the concatenation.

'c.+t' => The fat `cat sat on the concatenat`ion.

'c.+s' => The fat `cat s`at on the concatenation.
:::

::: tip 匹配he前面出现 T 0次或者1次
'[T]?he' => `The` car is parked in t`he` garage.
:::

### 2.4 {} 大括号的用法, 指一个字符或一组字符可以重复的次数

::: tip 匹配数字, 长度最少为2,最大为3
'[0-9]{2,3}' => The number was 9.`999`7 but we rounded it off to `10`.0.

// 只匹配长度为3的数字
'[0-9]{3}' => The number was 9.`999`7 but we rounded it off to 10.0.

// 匹配长度至少为2位的数字
'[0-9]{2,}' => The number was 9.`99971` but we rounded it off to `10`.0.
:::

### 2.5 `|` 捕获分组

::: tip 匹配出ar结尾,c或p或g开头的字符
// 分组
'(c|p|g)ar' => The `car` is `par`ked in the `gar`age.

// 不分组
'(?:c|p|g)ar' => The `car` is `par`ked in the `gar`age.
:::

```js
var str= 'The car is parked in the garage.'
var reg=/(c|p|g)ar/g;
var res = str.match(reg);
while(res = reg.exec(str))
{
  console.log(res[1]); // 返回分组信息 c,p,g
}

[ 'car',
  'c',
  index: 4,
  input: 'The car is parked in the garage.',
  groups: undefined ]
[ 'par',
  'p',
  index: 11,
  input: 'The car is parked in the garage.',
  groups: undefined ]
[ 'gar',
  'g',
  index: 25,
  input: 'The car is parked in the garage.',
  groups: undefined ]
```

### 2.6 交替

::: tip 匹配出the或者 c g开头ar结尾的字符
原始字符串 : The car is parked in the garage.

'(c|g)ar|the' => The `car` is parked in `the` `gar`age.
:::

### 2.7 转义字符

::: tip 匹配出fat cat sat mat.
原始字符串: The fat cat sat on the mat.

(f|s|a)\.? => The `fat` `cat` `sat` on the `mat.`
:::

### 2.8 锚点Anchors `^` `$`

::: tip 获取到以某个字符开头的
原始字符串: The fat cat sat on the mat.

匹配The/the
'(T|t)he' => `The` fat cat sat on `the` mat.

匹配开头是T或者t的, 结尾是he的字符,^ 表示整个字符的开始字符
'^(T|t)he' => `The` fat cat sat on the mat.

:::

### 2.8.1 $ 是否是匹配字符串的最后一个字符

::: tip 
原始字符串: `The fat cat. sat. on the mat.`

匹配所有的at.
'(at\.)' => The fat c`at.` s`at.` on the m`at.`

匹配以at.结尾的
'(at\.)$' => The fat cat. sat. on the m`at.`
:::


## 3. 简写
```
. => 除了换行意外的任意字符

\w => [a-zA-Z0-9_]

\W => [^\w] 匹配非字母字符

\d => [0-9]

\D => [^\d] 匹配非数字

\s => [\t\n\f\r\p{Z}] 匹配空白字符

\S => [^\s] 匹配非空白字符
```

## 4. `?=` `?!` `?<=` `?<!`

::: tip 
原始字符串: The fat cat sat on the mat The mat.

`?=`匹配后面是` mat`的`The/the`
'([T|t]he)(?=\smat)' => The fat cat sat on `the` mat `The` mat.

`?!`匹配后面不是` fat`的`The/the`
'[T|t]he(?!\sfat)' => The fat cat sat on `the` mat `The` cat.

`?<=` 匹配某个东西的后面
'(?<=[T|t]he\s)(fat|mat)' => The `fat` cat sat on the `mat`.

`?<!` 不需要匹配某样东西的后面, 匹配不是the后面的cat
'(?<![T|t]he)(cat)' => The cat sat on `cat`.
:::


## 5. `i/g/m`

```
i => 不区分大小写

g => 全局搜索

m => 多行
```

::: tip `i`
'/The/g' => `The` fat cat sat on the mat.

不区分大小写,并且全局

'/The/gi' => `The` fat cat sat on `the` mat.

全局搜索

'/.(at)/' => The `fat` cat sat on the mat.

'/.(at)/g' => The `fat` `cat` `sat` on the `mat`.

```js
// 匹配多行
'/.at$/g' => The fat cat sat
on the `mat`

'/.at$/gm' => The fat cat `sat`
on the `mat`
```

:::

## 6. 贪婪匹配/懒惰匹配

::: tip 

贪婪匹配:
'(.*at)' => `The fat cat sat on the mat.`

懒惰匹配:
'(.*?at)' => `The fat` cat sat on the mat.
:::

- 参考

  - [https://gumroad.com/read/2736bd338405960300ceb75af1635dfb/ULsB31qMb5MWVb6QBKxuOw==](https://gumroad.com/read/2736bd338405960300ceb75af1635dfb/ULsB31qMb5MWVb6QBKxuOw==)
  - [https://deerchao.cn/tutorials/regex/regex.htm](https://deerchao.cn/tutorials/regex/regex.htm)
