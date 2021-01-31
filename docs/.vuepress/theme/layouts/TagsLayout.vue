<template>
  <div
    class="theme-container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar" />

    <div class="sidebar-mask" @click="toggleSidebar(false)" />

    <Sidebar :items="sidebarItems" @toggle-sidebar="toggleSidebar">
      <template #top>
        <slot name="sidebar-top" />
      </template>
      <template #bottom>
        <slot name="sidebar-bottom" />
      </template>
    </Sidebar>

    <Home v-if="$page.frontmatter.home" />

    <Page v-else :sidebar-items="sidebarItems">
      <template #top>
        <slot name="page-top" />
      </template>
      <template #content-top>
        <div class="tags-wrapper">
          <span
            @click="clickTag(item)"
            class="tags-item"
            :class="{ active: tag.tagv === item.tagv }"
            :style="{ backgroundColor: item.bgc.bg }"
            v-for="item in tags"
            :key="item.tag"
            >{{ item.tag }}</span
          >
        </div>
        <div class="article-list">
          <div
            class="article"
            :style="{ 'box-shadow': `0 0 10px ${tag.bgc.shadow}` }"
            v-for="item in list"
          >
            <template v-if="item.excerpt">
              <div v-html="item.excerpt"></div>
              ...
              <div class="more">
                <router-link :to="item.path">阅读全文</router-link>
              </div>
            </template>
            <router-link v-else :to="item.path">{{ item.title }}</router-link>
          </div>
        </div>
      </template>
      <template #bottom>
        <slot name="page-bottom" />
      </template>
    </Page>
  </div>
</template>

<script>
import Page from '../components/Page'
import Home from '@theme/components/Home.vue'
import Navbar from '@theme/components/Navbar.vue'
import Sidebar from '@theme/components/Sidebar.vue'
import { resolveSidebarItems } from '@vuepress/theme-default/util/index'

export default {
  name: 'TagsLayout',

  components: {
    Home,
    Page,
    Sidebar,
    Navbar,
  },

  data() {
    return {
      isSidebarOpen: false,
      list: [],
      tag: '',
    }
  },

  computed: {
    shouldShowNavbar() {
      const { themeConfig } = this.$site
      const { frontmatter } = this.$page
      if (frontmatter.navbar === false || themeConfig.navbar === false) {
        return false
      }
      return (
        this.$title ||
        themeConfig.logo ||
        themeConfig.repo ||
        themeConfig.nav ||
        this.$themeLocaleConfig.nav
      )
    },

    shouldShowSidebar() {
      const { frontmatter } = this.$page
      return (
        !frontmatter.home &&
        frontmatter.sidebar !== false &&
        this.sidebarItems.length
      )
    },

    sidebarItems() {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      )
    },

    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass
      return [
        {
          'no-navbar': !this.shouldShowNavbar,
          'sidebar-open': this.isSidebarOpen,
          'no-sidebar': !this.shouldShowSidebar,
        },
        userPageClass,
      ]
    },

    tags() {
      //核心代码，整合markdown中tags的数目
      let allTags = []
      this.$site.pages.forEach((v) => {
        if (v.frontmatter.tags) {
          allTags.push(v.frontmatter.tags)
        } else if (v.frontmatter.tag) {
          allTags.push(v.frontmatter.tag)
        }
      })
      allTags = allTags.join(',').split(',')
      let flatTags = Array.from(new Set(allTags))
      const ts = flatTags.reduce((res, v) => {
        let o = {}
        o.tag = v
        o.tagv = v
        o.number = allTags.filter((value) => value === v).length
        o.bgc = this.tagBgc()
        res.push(o)
        return res
      }, [])
      ts.unshift({ tag: '全部', tagv: '', bgc: {} })
      return ts
    },
  },

  mounted() {
    this.$router.afterEach(() => {
      this.isSidebarOpen = false
    })
    this.clickTag(this.tags[0])
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

    clickTag(item) {
      //点击标签下面文章显示对应的内容
      this.tag = item
      const pages = this.$site.pages.filter((a) =>
        a.path.startsWith('/blog/article')
      )
      this.list = !item.tagv
        ? pages
        : pages.filter((v) => {
            let tags = v.frontmatter.tags
            if (tags) {
              return tags.some((v) => v === item.tagv)
            }
          })
    },
    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen
      this.$emit('toggle-sidebar', this.isSidebarOpen)
    },

    // side swipe
    onTouchStart(e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      }
    },

    onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x
      const dy = e.changedTouches[0].clientY - this.touchStart.y
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true)
        } else {
          this.toggleSidebar(false)
        }
      }
    },
  },
}
</script>
