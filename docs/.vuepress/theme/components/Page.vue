<template>
  <main class="page">
    <slot name="top" />
    <article class="theme-default-content">
      <slot name="content-top" />
      <Content />
      <NavHeader />
    </article>
    <PageEdit />

    <PageNav v-bind="{ sidebarItems }" />

    <slot name="bottom" />
  </main>
</template>

<script>
import PageEdit from '@theme/components/PageEdit.vue'
import PageNav from '@theme/components/PageNav.vue'
import NavHeader from '@theme/components/NavHeader.vue'

export default {
  components: { PageEdit, PageNav, NavHeader },
  props: ['sidebarItems'],
}
</script>

<style lang="stylus">
@require '../styles/wrapper.styl'
.page
  padding-bottom 2rem
  display block

</style>
