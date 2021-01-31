<template>
  <div class="liyajie-page-tags">
    <span class="page-tag" v-for="tag in tags" :key="tag">{{ tag }}</span>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      default: () => []
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