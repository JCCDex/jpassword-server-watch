<template>
  <div>
    <el-row type="flex" align="middle" justify="space-between">
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="display: flex; align-items: center">
          <img src="@/images/hometag.svg" alt="" style="float: left; margin-right: 10px" />
          <el-breadcrumb-item>
            <span style="color: #000000">{{ $t("message.showMenus.service_run_state") }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-select style="width: 150px; margin-right: 20px" v-model="selectValue">
          <el-option v-for="item in selectType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <el-button type="primary" :disabled="inquiring" @click="inquire">{{ $t("message.Inquire") }}</el-button>
      </div>
    </el-row>
    <el-row id="table" style="margin-top: 20px">
      <el-table :data="tableList" stripe ref="tableList" :header-cell-style="addClass" :cell-style="addClass">
        <el-table-column type="index" :index="formatIndex" :label="$t('message.index')" width="80"></el-table-column>
        <el-table-column :label="$t('message.collect_time')">
          <template slot-scope="scope">
            <span>{{ timestampToDateTime(scope.row.value[0] * 1000) || "- -" }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.node_type')">
          <template slot-scope="scope">
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.node_IP')" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.metric.instance }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.node_state')">
          <template slot-scope="scope">
            <span :style="{ color: scope.row.state ? '#089649' : '#F74645' }">{{
              scope.row.state ? $t("message.normal") : $t("message.abnormal")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.history_record')" width="100">
          <template>
            <el-button class="checkBT">{{ $t("message.check") }}</el-button>
          </template>
        </el-table-column>

        <EmptyTableContent slot="empty"></EmptyTableContent>
      </el-table>
    </el-row>
    <el-row type="flex" justify="end" style="margin-top: 24px" v-if="list.length">
      <el-pagination
        background
        :page-size="size"
        :current-page="page"
        layout="total, prev, pager, next"
        :total="list.length"
        @current-change="pageChange"
      >
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import { getBlockChainWorkState, getDateRWWorkState, getpayServerWorkState, getIpfsInfoWorkState } from "@/js/api/v1";
import serverType from "@/js/base/server-select";
import { PAGE, SIZE } from "@/js/base";
import timestampToDateTimeMixin from "@/mixins/timestampToDateTime";
import EmptyTableContent from "@/components/empty-table-content.vue";
import { apiErrorMessage } from "@/js/message-toast";
import { Loading } from "element-ui";
import tableLRMixin from "@/mixins/tableLR";

export default {
  name: "serviceRunState",
  async mounted() {
    this.selectType = serverType.concat({
      value: "allType",
      label: this.$t("message.server_type.all_type"),
    });
    await this.fetchData();
  },
  beforeRouteLeave(to, from, next) {
    next((vm) => {
      vm.list = [];
    });
  },
  data() {
    return {
      selectType: [],
      selectValue: "allType",
      list: [],
      page: PAGE,
      size: SIZE,
      inquiring: false,
    };
  },
  computed: {
    total() {
      return this.list ? this.list.length : 0;
    },
    tableList() {
      try {
        let list = this.list.slice((this.page - 1) * SIZE, this.page * SIZE);
        if (list.length === 0) {
          if ((this.page - 1) * SIZE < this.list.length && this.page * SIZE >= this.list.length) {
            list = this.list.slice((this.page - 1) * SIZE, this.page * SIZE);
          } else if (this.list.length !== 0) {
            list = this.list.slice((this.page - 2) * SIZE, (this.page - 1) * SIZE);
            this.page = this.page - 1;
          } else {
            list = [];
          }
        }
        return list;
      } catch (error) {
        return [];
      }
    },
  },
  mixins: [timestampToDateTimeMixin, tableLRMixin],
  components: {
    EmptyTableContent,
  },
  methods: {
    pageChange(page) {
      this.page = page;
    },
    async inquire() {
      this.fetchData();
    },
    async fetchData() {
      this.page = PAGE;
      const loading = Loading.service({
        lock: true,
        spinner: "el-icon-loading",
        text: this.$t("message.loading"),
        target: "#table",
        fullscreen: false,
      });
      this.inquiring = true;
      let BlockChain = null;
      let DateRW = null;
      let PayServer = null;
      let IpfsNode = null;
      try {
        switch (this.selectValue) {
          case "blockChain":
            BlockChain = await this.fetchBlockChain();
            this.list = [].concat(BlockChain);
            break;
          case "dateRW":
            DateRW = await this.fetchDateRW();
            this.list = [].concat(DateRW);
            break;
          case "payServer":
            PayServer = await this.fetchPayServer();
            this.list = [].concat(PayServer);
            break;
          case "ipfsInfo":
            IpfsNode = await this.fetchIpfsNode();
            this.list = [].concat(IpfsNode);
            break;
          default:
            BlockChain = await this.fetchBlockChain();
            DateRW = await this.fetchDateRW();
            PayServer = await this.fetchPayServer();
            IpfsNode = await this.fetchIpfsNode();
            this.list = [].concat(BlockChain).concat(DateRW).concat(PayServer).concat(IpfsNode);
            break;
        }
      } catch (error) {
        apiErrorMessage(error);
      } finally {
        loading.close();
        this.inquiring = false;
      }
    },
    async fetchBlockChain() {
      const res = await getBlockChainWorkState();
      let list = [];
      list = list.concat(
        res.data.result.map((item) =>
          Object.assign({}, item, {
            state: this.setState_4_6(item.value[1]),
            type: this.$t("message.server_type.block_chain"),
          })
        )
      );
      return list;
    },
    async fetchDateRW() {
      const res = await getDateRWWorkState();
      let list = [];
      list = list.concat(
        res.data.result.map((item) =>
          Object.assign({}, item, {
            state: this.setState_1(item.value[1]),
            type: this.$t("message.server_type.date_read_and_write"),
          })
        )
      );
      return list;
    },
    async fetchPayServer() {
      const res = await getpayServerWorkState();
      let list = [];
      list = list.concat(
        res.data.result.map((item) =>
          Object.assign({}, item, {
            state: this.setState_200(item.value[1]),
            type: this.$t("message.server_type.pay_server"),
          })
        )
      );
      return list;
    },
    async fetchIpfsNode() {
      const res = await getIpfsInfoWorkState();
      let list = [];
      list = list.concat(
        res.data.result.map((item) =>
          Object.assign({}, item, {
            state: this.setState_1(item.value[1]),
            type: this.$t("message.server_type.ipfs_info"),
          })
        )
      );
      return list;
    },
    formatIndex(index) {
      return (this.page - 1) * SIZE + index + 1;
    },
    setState_4_6(state) {
      if (state == "4" || state == "6") {
        return true;
      } else {
        return false;
      }
    },
    setState_1(state) {
      if (state == "1") {
        return true;
      } else {
        return false;
      }
    },
    setState_200(state) {
      if (state == "200") {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.checkBT {
  border: none;
  background: none;
  margin: 0px;
  color: #4825b5;
  font-weight: 400;
}
</style>
