<template>
  <main class="page">
    <slot name="top" />
    <article class="theme-default-content">
      <slot name="content-top" />
      <div class="page-title">
        <h1>{{ $page.title }}</h1>
        <div class="page-desc">
          <span class="page-author">LiYajie: {{ $page.lastUpdated }}</span>
          <span class="page-tags">
            <router-link
              class="page-tag"
              :style="{ color: item.bgcObj.bg }"
              :to="'/tags/?tag=' + item.tag"
              v-for="item in tagsCom"
              :key="item.tag"
              >{{ item.tag }}</router-link
            >
          </span>
        </div>
      </div>
      <Content />
      <NavHeader />
    </article>
    <PageEdit />

    <PageNav v-bind="{ sidebarItems }" />

    <slot name="bottom" />
    <div class="page-nav">
      <ClientOnly>
        <Vssue />
      </ClientOnly>
    </div>
  </main>
</template>

<script>
import PageEdit from '@theme/components/PageEdit.vue'
import PageNav from '@theme/components/PageNav.vue'
import NavHeader from '@theme/components/NavHeader.vue'

export default {
  components: { PageEdit, PageNav, NavHeader },
  props: ['sidebarItems'],
  computed: {
    tags() {
      return this.$page.frontmatter.tags || []
    },
    tagsCom() {
      return this.tags.map((a) => {
        return {
          tag: a,
          bgcObj: this.tagBgc(),
        }
      })
    },
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
  },
  mounted() {
    console.log(this.$page);
  }
}
</script>

<style lang="stylus">
@require '../styles/wrapper.styl'
.page
  padding-bottom 2rem
  display block
  .page-title
    h1
      margin-bottom 0
      padding-bottom 0.5rem
    .page-desc
      .page-author
        font-size 12px
        margin-right 20px
      .page-tag
        font-size 12px
        color #fff
        padding 2px 4px
        border-radius 2px
        margin-left 10px
        text-decoration none !important
        box-sizing border-box
</style>
