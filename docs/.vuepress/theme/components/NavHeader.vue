<template>
  <div class="nav-header">
    <ul>
      <li v-for="item in pages" :key="item.key"><a :href="item.path" >{{ item.title }}</a></li>
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
      return this.$site.pages.filter(a => a.path.startsWith(this.page.path) && a.path !== this.page.path)
    }
  }
}
</script>

<style>

</style>