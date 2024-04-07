<template>
  <el-col slot="empty" style="margin-top: 140px;">
    <el-col style="line-height: 1">
      <img src="@/images/empty-table.svg" />
    </el-col>
    <el-col style="line-height: 20px;margin-top: 16px;margin-bottom: 140px;">
      <span
        >{{ $t("message.empty_content") }}
        <slot></slot>
      </span>
    </el-col>
  </el-col>
</template>

<script>
export default {
  name: "emptyTableContent"
}
</script>

<style lang="scss" scoped>

</style>