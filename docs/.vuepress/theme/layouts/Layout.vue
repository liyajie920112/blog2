<template>
  <LayoutNew>
    <div slot="sidebar-top" class="upyun-sidebar">
      <a v-if="config.useUpyun" class="upyun-box" href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral" target="_blank">
        该网站由<img src="/images/upyun_logo.png" />
        提供网络存储服务
      </a>
    </div>
  </LayoutNew>
</template>

<script>
import LayoutNew from './LayoutNew'
export default {
  components: {
    LayoutNew
  },
  computed: {
    config() {
      const { themeConfig } = this.$site
      return themeConfig
    }
  }
}
</script>

<style lang="stylus" scoped>
.upyun-sidebar
  padding 10px
  text-align center
  .upyun-box
    display flex 
    align-items center
    justify-content center
    text-align center
    border 1px solid $accentColor
    margin 0 auto
    padding 8px
    font-size 12px
    img 
      height 40px
</style>