<template>
  <div>
    <el-row type="flex" align="middle" justify="space-between">
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="display: flex; align-items: center">
          <img src="@/images/hometag.svg" alt="" style="float: left; margin-right: 10px" />
          <el-breadcrumb-item>
            <span style="color: #000000">{{ $t("message.showMenus.user_pay_data") }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <div>
          <el-input
            style="width: 200px; margin-right: 20px"
            :placeholder="$t('message.enter_tip.enter_user_address')"
            prefix-icon="el-icon-search"
            v-model="address"
          >
          </el-input>
          <el-button type="primary" :disabled="!address || inquiring" @click="inquire">{{
            $t("message.Inquire")
          }}</el-button>
        </div>
      </div>
    </el-row>
    <el-row id="table" style="margin-top: 20px">
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
        <el-table-column
          prop="user_wallet_address"
          :label="$t('message.user_address')"
          :show-overflow-tooltip="true"
        ></el-table-column>
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

        <EmptyTableContent slot="empty">
          <template>
            <span>{{ $t("message.empty_content_txt.need_user_address") }}</span>
          </template>
        </EmptyTableContent>
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
  name: "userPayData",
  data() {
    return {
      list: [],
      count: 0,
      nowTime: null,
      page: PAGE,
      size: SIZE,
      address: "",
      inquiring: false,
    };
  },
  mixins: [timestampToDateTimeMixin, tableLRMixin],
  components: {
    EmptyTableContent,
  },
  methods: {
    toBrowser(hash) {
      const str = "https://swtcscan.jccdex.cn/#/trade/tradeDetail/?hash=" + hash;
      return str;
    },
    async inquire() {
      this.fetchDatas({ page: PAGE, size: this.size, address: this.address });
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
      this.inquiring = true;
      try {
        const res = await getUserPay(params);
        this.count = res.data.count;
        this.list = res.data.list;
        this.nowTime = res.data.nowTime;
      } catch (error) {
        apiErrorMessage(error);
      } finally {
        this.inquiring = false;
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
