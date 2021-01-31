import Vue from 'vue'
import tags from './tags'

export default {
  watch: {
    '$page.path'(newV) {
      this.$nextTick(() => {
        this.addTags()
      })
    }
  },
  methods: {
    addTags() {
      const _tags = this.$frontmatter.tags
      let Tags = Vue.extend(tags)
      let tags1 = new Tags({
        propsData: {
          tags: _tags,
        },
      })
      tags1.$mount()
      const targetH1Selector = '.page .content__default h1'
      const h1 = document.querySelector(targetH1Selector)
      const newElement = tags1.$el
      if (h1) {
        const parent = h1.parentNode
        parent.insertBefore(newElement, h1.nextSibling)
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.addTags()
    }, 300)
  },
}
