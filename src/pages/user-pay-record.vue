<template>
  <div>
    <el-row style="height: 44px" type="flex" align="middle" justify="space-between">
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="display: flex; align-items: center">
          <img src="@/images/hometag.svg" alt="" style="float: left; margin-right: 10px" />
          <el-breadcrumb-item to="/user-list-data">
            <span>{{ $t("message.showMenus.user_list_data") }}</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <span style="color: #000000">{{ $t("message.pay_record") }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <span style="font-size: 14px; color: #2e2e2e">{{ $t("message.user_address") }}:{{ "\xa0\xa0" + address }}</span>
      </div>
    </el-row>
    <el-row id="table" style="margin-top: 30px">
      <el-table :data="list" stripe ref="tableList" :header-cell-style="addClass" :cell-style="addClass">
        <el-table-column type="index" :index="formatIndex" :label="$t('message.index')" :width="60"></el-table-column>
        <el-table-column :label="$t('message.pay_time')" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.trade_time }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.vip_end_time')" width="160">
          <template slot-scope="scope">
            <span>{{ timestampToDateTime(scope.row.end_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.chainHash')" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <a target="_blank" :href="toBrowser(scope.row.hash)">{{ scope.row.hash }}</a>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.vip_combo')" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ vipCombo(scope.row.plan) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.pay_type')" align="center" width="100">
          <template>
            <div style="display: flex; align-items: center; justify-content: center">
              <img style="margin-right: 10px" src="@/images/zfb.svg" alt="" />
              {{ $t("message.zfb") }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.pay_money')" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ $t("message.money", { money: scope.row.total_amount }) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.vip_state')" align="center" width="100">
          <template slot-scope="scope">
            <span :style="{ color: nowTime <= scope.row.end_time ? '#089649' : '#F74645' }">{{
              vipState(scope.row, nowTime)
            }}</span>
          </template>
        </el-table-column>

        <EmptyTableContent slot="empty"></EmptyTableContent>
      </el-table>
    </el-row>
    <el-row type="flex" justify="end" style="margin-top: 24px" v-if="count">
      <el-pagination
        background
        :page-size="size"
        :current-page="page"
        layout="total, prev, pager, next"
        :total="count"
        @current-change="pageChange"
      >
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import { Loading } from "element-ui";
import { getUserPay } from "@/js/api/v1";
import { PAGE, SIZE } from "@/js/base";
import timestampToDateTimeMixin from "@/mixins/timestampToDateTime";
import EmptyTableContent from "@/components/empty-table-content.vue";
import { apiErrorMessage } from "@/js/message-toast";
import tableLRMixin from "@/mixins/tableLR";

export default {
  name: "userPayRecord",
  beforeRouteEnter(to, from, next) {
    const { address } = to.params;
    next((vm) => {
      vm.address = address;
    });
  },
  mixins: [timestampToDateTimeMixin, tableLRMixin],
  async mounted() {
    this.fetchDatas({ page: this.page, size: this.size, address: this.address });
  },
  components: {
    EmptyTableContent,
  },
  data() {
    return {
      list: [],
      count: 0,
      nowTime: null,
      address: "",
      page: PAGE,
      size: SIZE,
    };
  },
  methods: {
    toBrowser(hash) {
      const str = "https://swtcscan.jccdex.cn/#/trade/tradeDetail/?hash=" + hash;
      return str;
    },
    vipCombo(plan) {
      switch (plan) {
        case "B":
          return this.$t("message.vip_combo_type.month_card");
        case "C":
          return this.$t("message.vip_combo_type.quarter_card");
        case "D":
          return this.$t("message.vip_combo_type.year_card");
        default:
          return "- -";
      }
    },
    vipState(item, now) {
      if (item.end_time >= now) {
        return this.$t("message.vip_state_type.in");
      } else {
        return this.$t("message.vip_state_type.out");
      }
    },
    async fetchDatas(params) {
      const loading = Loading.service({
        lock: true,
        spinner: "el-icon-loading",
        text: this.$t("message.loading"),
        target: "#table",
        fullscreen: false,
      });
      try {
        const res = await getUserPay(params);
        this.count = res.data.count;
        this.list = res.data.list;
        this.nowTime = res.data.nowTime;
      } catch (error) {
        apiErrorMessage(error);
      } finally {
        loading.close();
      }
    },
    formatIndex(index) {
      return (this.page - 1) * SIZE + index + 1;
    },
    async pageChange(page) {
      this.page = page;
      this.fetchDatas({ page: this.page, size: this.size, address: this.address });
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  color: #2a2f37;
  &:hover {
    color: #2d61be;
  }
}
</style>
