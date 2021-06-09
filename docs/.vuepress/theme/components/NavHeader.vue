<template>
  <div class="nav-header">
    <ul>
      <li v-for="item in pages" :key="item.key"><a :href="item.path" >[{{ item.lastUpdated }}] {{ item.title }}</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    page() {
      return this.$page
    },
    pages() {
      const pages = this.$site.pages.filter(a => a.path.startsWith(this.page.path) && a.path !== this.page.path)
      pages.sort((a, b) => {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      })
      return pages
    }
  }
}
</script>

<style>

</style>