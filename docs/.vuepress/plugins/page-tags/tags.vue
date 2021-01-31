<template>
  <div class="liyajie-page-tags">
    <span @click="tagClick(item)" :style="{ backgroundColor: item.bgcObj.bg }" class="page-tag" v-for="item in tagsCom" :key="item.tag">{{ item.tag }}</span>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      default: () => []
    },
    $router: {
      type: Object,
      default: () =>({})
    }
  },
  computed: {
    tagsCom() {
      return this.tags.map(a => {
        return {
          tag: a,
          bgcObj: this.tagBgc()
        }
      })
    }
  },
  methods: {
    tagBgc() {
      const r = parseInt(Math.random() * 255)
      const g = 50 + parseInt((Math.random() * 255) / 2)
      const b = 50 + parseInt((Math.random() * 255) / 2)
      return {
        bg: `rgb(${r},${g},${b})`,
        shadow: `rgba(${r},${g},${b},.5)`,
      }
    },
    tagClick(item) {
      this.$router.push({ path: '/tags/', query: { tag: item.tag } })
    }
  }
}
</script>

<style lang="styl" scoped>
.liyajie-page-tags .page-tag{
  padding: 2px 10px;
  margin-right: 10px;
  border-radius: 2px;
  background-color: $accentColor;
  color: #fff;
  cursor: pointer;
}
</style>