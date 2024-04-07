<template>
  <div style="margin: 34px 0px;" class="head">
    <span>{{ $t("message.welcome_txt") }}</span>
  </div>
</template>

<script>
export default {
  name: "menuHead"
}
</script>

<style lang="scss" scoped>
.head{
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  color: #3a2186;
  line-height: 22px;
}
</style>