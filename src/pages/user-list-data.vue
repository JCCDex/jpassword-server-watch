<template>
  <div>
    <el-row type="flex" align="middle" justify="space-between">
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="display: flex; align-items: center">
          <img src="@/images/hometag.svg" alt="" style="float: left; margin-right: 10px" />
          <el-breadcrumb-item>
            <span style="color: #000000">{{ $t("message.showMenus.user_list_data") }}</span>
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
          <el-button type="primary" :disabled="inquiring" @click="inquire">{{ $t("message.Inquire") }}</el-button>
        </div>
      </div>
    </el-row>
    <el-row id="table" style="margin-top: 20px">
      <el-table :data="list" stripe ref="tableList" :header-cell-style="addClass" :cell-style="addClass">
        <el-table-column type="index" :index="formatIndex" :label="$t('message.index')" :width="60"></el-table-column>
        <el-table-column :label="$t('message.vip_start_time')" width="160">
          <template slot-scope="scope">
            <span>{{ timestampToDateTime(scope.row.startTime) || "- -" }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.vip_end_time')" width="160">
          <template slot-scope="scope">
            <span>{{ timestampToDateTime(scope.row.endTime) || "- -" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userAccount" :label="$t('message.user_address')"></el-table-column>
        <el-table-column :label="$t('message.user_state')" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ userType(scope.row, nowTime) || "- -" }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.vip_state')" align="center" width="100">
          <template slot-scope="scope">
            <span :style="{ color: nowTime <= scope.row.endTime ? '#089649' : '#F74645' }">{{
              vipType(scope.row, nowTime) || "- -"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.pay_record')" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.plan === 'A'">- -</span>
            <span v-else @click="checkUserPay(scope.row.userAccount)" style="color: #4825b5; cursor: pointer">{{
              $t("message.check")
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
import { getUserList } from "@/js/api/v1";
import { PAGE, SIZE } from "@/js/base";
import timestampToDateTimeMixin from "@/mixins/timestampToDateTime";
import EmptyTableContent from "@/components/empty-table-content.vue";
import { Loading } from "element-ui";
import { apiErrorMessage } from "@/js/message-toast";
import tableLRMixin from "@/mixins/tableLR";

export default {
  name: "userListData",
  async mounted() {
    this.fetchDatas({ page: this.page, size: this.size });
  },
  mixins: [timestampToDateTimeMixin, tableLRMixin],
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
  components: {
    EmptyTableContent,
  },
  methods: {
    checkUserPay(address) {
      this.$router.push("/user-list-data/pay-record/" + address);
    },
    async inquire() {
      this.fetchDatas({ page: PAGE, size: this.size, address: this.address });
    },
    async pageChange(page) {
      this.page = page;
      this.fetchDatas({ page: this.page, size: this.size });
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
        const res = await getUserList(params);
        this.count = res.data.count;
        this.list = res.data.list;
        this.nowTime = res.data.nowTime;
      } catch (error) {
        apiErrorMessage(error);
      } finally {
        loading.close();
        this.inquiring = false;
      }
    },
    formatIndex(index) {
      return (this.page - 1) * SIZE + index + 1;
    },
    userType(item, now) {
      if (item.plan === "A") {
        return this.$t("message.user_state_type.try");
      } else if (now <= item.endTime) {
        return this.$t("message.user_state_type.vip");
      } else {
        return this.$t("message.user_state_type.common");
      }
    },
    vipType(item, now) {
      if (item.plan === "A") {
        if (now <= item.endTime) {
          return this.$t("message.vip_state_type.inTry");
        } else {
          return this.$t("message.vip_state_type.outTry");
        }
      } else {
        if (now <= item.endTime) {
          return this.$t("message.vip_state_type.inVip");
        } else {
          return this.$t("message.vip_state_type.outVip");
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
