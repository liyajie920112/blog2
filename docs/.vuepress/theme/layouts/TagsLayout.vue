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
            :style="{
              backgroundColor: tag.tagv !== item.tagv ? '#fff' : item.bgc.bg,
              color: tag.tagv !== item.tagv ? item.bgc.bg : '#fff',
              border: `1px solid ${item.bgc.bg}`,
            }"
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
            :key="item.title"
          >
            <template v-if="item.excerpt">
              <router-link class="article-title" :to="item.path">{{
                item.title
              }}</router-link>
              <div class="article-excerpt" v-html="item.excerpt"></div>
              ...
            </template>
            <router-link v-else :to="item.path">{{ item.title }}</router-link>
            <div class="more">
              <router-link :to="item.path">阅读全文</router-link>
            </div>
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
import Page from "../components/Page";
import Home from "@theme/components/Home.vue";
import Navbar from "@theme/components/Navbar.vue";
import Sidebar from "@theme/components/Sidebar.vue";
import { resolveSidebarItems } from "@vuepress/theme-default/util/index";

export default {
  name: "TagsLayout",

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
      tag: "",
    };
  },

  computed: {
    shouldShowNavbar() {
      const { themeConfig } = this.$site;
      const { frontmatter } = this.$page;
      if (frontmatter.navbar === false || themeConfig.navbar === false) {
        return false;
      }
      return (
        this.$title ||
        themeConfig.logo ||
        themeConfig.repo ||
        themeConfig.nav ||
        this.$themeLocaleConfig.nav
      );
    },

    shouldShowSidebar() {
      const { frontmatter } = this.$page;
      return (
        !frontmatter.home &&
        frontmatter.sidebar !== false &&
        this.sidebarItems.length
      );
    },

    sidebarItems() {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      );
    },

    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass;
      return [
        {
          "no-navbar": !this.shouldShowNavbar,
          "sidebar-open": this.isSidebarOpen,
          "no-sidebar": !this.shouldShowSidebar,
        },
        userPageClass,
      ];
    },

    tags() {
      //核心代码，整合markdown中tags的数目
      let allTags = [];
      this.$site.pages.forEach((v) => {
        if (v.frontmatter.tags) {
          allTags.push(v.frontmatter.tags);
        } else if (v.frontmatter.tag) {
          allTags.push(v.frontmatter.tag);
        }
      });
      allTags = allTags.join(",").split(",");
      allTags = allTags.map(tag => {
        return tag.toLowerCase();
      })
      let flatTags = Array.from(new Set(allTags));
      let ts = flatTags.reduce((res, v) => {
        let o = {};
        o.tag = v.toUpperCase();
        o.tagv = v;
        o.number = allTags.filter(
          (value) => value.toLowerCase() === v.toLowerCase()
        ).length;
        o.bgc = this.tagBgc();
        res.push(o);
        return res;
      }, []);
      ts = ts.sort((a, b) => a.tagv.localeCompare(b.tagv));
      ts.unshift({ tag: "全部", tagv: "", bgc: this.tagBgc() });
      return ts;
    },
  },

  methods: {
    tagBgc() {
      const r = parseInt(Math.random() * 255);
      const g = 50 + parseInt((Math.random() * 255) / 2);
      const b = 50 + parseInt((Math.random() * 255) / 2);
      return {
        bg: `rgb(${r},${g},${b})`,
        shadow: `rgba(${r},${g},${b},.5)`,
      };
    },

    clickTag(item, isFirst) {
      //点击标签下面文章显示对应的内容
      if (item.tagv === this.tag.tagv) {
        return;
      }
      if (!isFirst) {
        this.$router.push({
          path: this.$route.path,
          query: { tag: item.tagv },
        });
      }
      this.tag = item;
      const pages = this.$site.pages.filter((a) =>
        a.path.includes("/article/")
      );
      this.list = !item.tagv
        ? pages
        : pages.filter((v) => {
            let tags = v.frontmatter.tags;
            if (tags) {
              return tags.some(
                (v) => v.toLowerCase() === item.tagv.toLowerCase()
              );
            }
          });
    },
    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === "boolean" ? to : !this.isSidebarOpen;
      this.$emit("toggle-sidebar", this.isSidebarOpen);
    },

    // side swipe
    onTouchStart(e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
    },

    onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x;
      const dy = e.changedTouches[0].clientY - this.touchStart.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true);
        } else {
          this.toggleSidebar(false);
        }
      }
    },
  },
  mounted() {
    this.$router.afterEach(() => {
      this.isSidebarOpen = false;
    });
    const { tag } = this.$route.query;
    if (tag) {
      const tagObj = this.tags.find(
        (a) => a.tagv.toLowerCase() === tag.toLowerCase()
      );
      this.clickTag(tagObj, true);
      return;
    }
    this.clickTag(this.tags[0], true);
  },
};
</script>
