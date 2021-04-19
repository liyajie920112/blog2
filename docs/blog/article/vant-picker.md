---
title: vant picker实现无限级联选择
tags:
  - vant
  - js
---

:::warning 注意
vant 的picker 从2.4.5之后可以支持columns的children, 用来实现级联选择

但是: `级联选择的数据嵌套深度需要保持一致，如果部分选项没有子选项，可以使用空字符串进行占位`
:::

基于以上需求, 并且后台返回的树的结构有深有浅, 需要做一款可以支持选择多级的picker

> 方案是基于tree的数据, 使用动态设置选项完成✅, 动态设置选项的结果就是`key-value`格式, 如下

```js
const citys = {
  浙江: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
  福建: ['福州', '厦门', '莆田', '三明', '泉州'],
};
// 浙江, 福建为第一列, 对应后面的数据为选中后的第二列
```

<!-- more -->

对应的tree.json为[点击这里查看](http://image.liyajie.cn/blog/vant-picker-tree.json)

页面结构

```html
<van-picker class="list" show-toolbar title="标题" @confirm="onConfirm" value-key="label" @change="onChange" :columns="columns"/>
```

```js
import tree from '../assets/vant-picker-tree'
export default {
  data () {
    return {
      columns: []
    }
  },
  methods: {
    onConfirm (value, index) {
      const r = {
        arr: [],
        obj: {}
      }
      for (const [key, v] of Object.entries(this.columnObj)) {
        const _v = v[index[key]]
        r.arr.push(_v)
        r.obj[key] = _v
      }
      console.log('选中的结果:', r)
    },
    // 删除columnObj指定索引后面的列
    removeColumnObj (index) {
      const len = Object.keys(this.columnObj).length
      for (let i = index; i < len; i++) {
        delete this.columnObj[i]
      }
    },
    // index: 选中的列索引
    onChange (picker, value, index) {
      // 清空选中列后面所有的列
      this.columns.splice(index + 1)
      this.removeColumnObj(index + 1)
      // 获取选中列中选项选中值的索引
      const columnValueIndex = picker.getColumnIndex(index)
      // 获取下一列
      const curValueObj = this.columnObj[index][columnValueIndex]
      if (curValueObj.children && curValueObj.children.length) {
        this.addColumn(curValueObj.children, index + 1)
      }
    },
    // 动态添加列
    addColumn (arr, index) {
      if (!this.columnObj) {
        this.columnObj = {}
      }
      this.columnObj[index] = arr
      const values = arr.map(a => a.label)
      this.columns.push({
        values
      })
      if (arr && arr.length && arr[0].children) {
        this.addColumn(arr[0].children, ++index)
      }
    }
  },
  mounted () {
    this.addColumn(tree, 0)
  }
}
</script>
```
