<template>
  <div v-if="range" class="background" :style="{ background: range.isCurrent ? '#6038dc' : '#f4f4f5' }">
    <div style="width: 100%; height: 100%; display: flex; justify-content: space-around; align-items: center">
      <div class="column-center">
        <div>{{ range.start.date }}</div>
        <div>{{ range.start.time }}</div>
      </div>
      <div>～</div>
      <div class="column-center">
        <div>{{ range.end.date }}</div>
        <div>{{ range.end.time }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "timePaginationItem",
  props: {
    range: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
.background {
  width: 200px;
  height: 48px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 14px;
  font-family: PingFang SC, PingFang SC-Regular;
  line-height: 20px;
  .column-center {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
