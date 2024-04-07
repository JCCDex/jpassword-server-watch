<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <el-row type="flex" align="middle" justify="space-between">
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="display: flex; align-items: center">
          <img src="@/images/hometag.svg" alt="" style="float: left; margin-right: 10px" />
          <el-breadcrumb-item>
            <span style="color: #000000">{{ $t("message.showMenus.use_access_log") }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div style="display: flex; align-items: center">
        <span style="margin-right: 10px; color: #838e9d; font-size: 14px">{{ $t("message.time_space") }}</span>
        <el-select style="width: 100px; margin-right: 20px" v-model="space">
          <el-option v-for="item in selectSpace" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <el-date-picker
          style="width: 250px; margin-right: 20px"
          v-model="selectDate"
          type="daterange"
          unlink-panels
          :range-separator="$t('message.to')"
          :start-placeholder="$t('message.start_date')"
          :end-placeholder="$t('message.end_date')"
          :picker-options="pickerOptions"
          :default-value="defaultDate"
        >
        </el-date-picker>
        <el-input
          style="width: 160px; margin-right: 20px"
          :placeholder="$t('message.enter_tip.enter_user_address')"
          prefix-icon="el-icon-search"
          v-model="address"
        >
        </el-input>
        <div id="log-type">
          <el-select style="width: 100px; margin-right: 20px" v-model="logType">
            <el-option v-for="item in selectLog" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </div>
        <el-button type="primary" :disabled="inquiring" @click="inquire">{{ $t("message.Inquire") }}</el-button>
      </div>
    </el-row>
    <el-row id="table" style="margin-top: 20px; overflow: auto; flex: 1">
      <el-table :data="list" ref="tableList" stripe :header-cell-style="addClass" :cell-style="addClass">
        <el-table-column type="index" :index="formatIndex" :label="$t('message.index')" width="80"></el-table-column>
        <el-table-column :label="$t('message.visit_time')">
          <template slot-scope="scope">
            <span>{{ timestampToDateTime(scope.row.values[0][0] / 1000000) || "- -" }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.user_address')">
          <template slot-scope="scope">
            <span>{{ scope.row.stream.request_querystring_w || "- -" }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.visit_do_type')" align="center" width="110">
          <template slot-scope="scope">
            <span
              :style="{
                color:
                  scope.row.state === 1
                    ? '#F37015'
                    : scope.row.state === 2
                    ? '#089649'
                    : scope.row.state === 3
                    ? '#F74645'
                    : '#2A2F37',
              }"
              >{{
                scope.row.state === 1
                  ? $t("message.visit_log_type.read")
                  : scope.row.state === 2
                  ? $t("message.visit_log_type.save")
                  : scope.row.state === 3
                  ? $t("message.visit_log_type.delete")
                  : "- -"
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="expand-css">
              <div
                style="display: flex; margin: 14px 20px 0px"
                v-for="(item, index) in Object.keys(props.row.stream)"
                :key="index"
              >
                <div style="color: #6e7072; min-width: 400px">{{ item }}:</div>
                <div style="color: #2a2f37">{{ props.row.stream[item] }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <EmptyTableContent slot="empty"></EmptyTableContent>
      </el-table>
    </el-row>
    <div v-show="showPage" style="padding: 20px 0px; border-top: 1px solid #ddd9e3">
      <timePagination ref="page" :start="startTime" :end="endTime" :space="space" :change="changePage"></timePagination>
    </div>
  </div>
</template>

<script>
import { getIpfsRWVisitLog } from "@/js/api/v1";
import { PAGE, SIZE, DEFAULT_SPACE } from "@/js/base";
import timestampToDateTimeMixin from "@/mixins/timestampToDateTime";
import EmptyTableContent from "@/components/empty-table-content.vue";
import { apiErrorMessage } from "@/js/message-toast";
import { Loading } from "element-ui";
import timePagination from "@/components/time-pagination";
import spaceList from "@/js/base/space-select";
import visitLogSelect from "@/js/base/visit-log-select";
import BigNumber from "bignumber.js";
import tableLRMixin from "@/mixins/tableLR";

export default {
  name: "useAccessLog",
  async mounted() {
    this.defaultDate = new Date();
    this.defaultDate.setMonth(new Date().getMonth() - 1);
    this.inquire();
  },
  data() {
    return {
      list: [],
      page: PAGE,
      size: SIZE,
      space: DEFAULT_SPACE,
      selectSpace: spaceList,
      selectLog: visitLogSelect,
      logType: "request_uri =~ `/api/.*`",
      address: "",
      inquiring: false,
      selectDate: null,
      defaultDate: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setDate(start.getDate() - 6);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setDate(start.getDate() - 29);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setDate(start.getDate() - 89);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
        disabledDate: (time) => {
          // 禁用日期
          let nowData = new Date();
          return time > nowData;
        },
      },
      startTime: "",
      endTime: "",
      showPage: false,
    };
  },
  mixins: [timestampToDateTimeMixin, tableLRMixin],
  components: {
    EmptyTableContent,
    timePagination,
  },
  methods: {
    inquire() {
      const now = new Date();
      let rangeStart = null;
      let rangeEnd = null;
      if (this.selectDate) {
        const start = this.selectDate[0];
        const end = this.selectDate[1];
        this.startTime = this.timestampToDate(start) + "T00:00:00+08:00";
        this.endTime = this.timestampToDate(end);
        if (this.timestampToDate(end) == this.timestampToDate(now)) {
          this.endTime = this.endTime + `T${this.timestampToTime(now)}+08:00`;
        } else {
          this.endTime = this.endTime + "T23:59:59+08:00";
        }
        rangeEnd = this.endTime;
        const startTimestamp = new Date(this.startTime).getTime();
        const endTimestamp = new Date(this.endTime).getTime();
        const s_space_e = endTimestamp - startTimestamp;
        const div_num = new BigNumber(s_space_e).idiv(this.space * 1000 * 3600).toNumber();
        if (div_num > 0) {
          const r_e_timestamp = new Date(rangeEnd).getTime();
          const r_s_timestamp = r_e_timestamp - this.space * 1000 * 3600;
          rangeStart =
            this.timestampToDate(new Date(r_s_timestamp)) + `T${this.timestampToTime(new Date(r_s_timestamp))}+08:00`;
        } else {
          rangeStart = this.startTime;
        }
      } else {
        this.endTime = this.timestampToDate(now) + `T${this.timestampToTime(now)}+08:00`;
        rangeEnd = this.endTime;
        const r_e_timestamp = new Date(rangeEnd).getTime();
        const r_s_timestamp = r_e_timestamp - this.space * 1000 * 3600;
        rangeStart =
          this.timestampToDate(new Date(r_s_timestamp)) + `T${this.timestampToTime(new Date(r_s_timestamp))}+08:00`;
      }
      this.inquiring = true;
      this.fetchDatas(rangeStart, rangeEnd, this.address, this.logType);
      this.inquiring = false;
      if (!this.showPage) this.showPage = true;
      if (this.showPage) {
        setTimeout(() => {
          this.$refs.page.setPageList();
        }, 500);
      }
    },
    formatIndex(index) {
      return (this.page - 1) * SIZE + index + 1;
    },
    changePage(start, end) {
      this.fetchDatas(start, end, this.address, this.logType);
    },
    async fetchDatas(start, end, address, logType) {
      this.list = [];
      const loading = Loading.service({
        lock: true,
        spinner: "el-icon-loading",
        text: this.$t("message.loading"),
        target: "#table",
        fullscreen: false,
      });
      try {
        const res = await getIpfsRWVisitLog(start, end, address, logType);
        this.list = this.list.concat(
          res.data.result.map((item) => Object.assign({}, item, { state: this.setVisitState(item.values[0][1]) }))
        );
        this.list = this.list.sort((a, b) => {
          return b.values[0][0] - a.values[0][0];
        });
      } catch (error) {
        apiErrorMessage(error);
      } finally {
        loading.close();
      }
    },
    setVisitState(state) {
      if (state.indexOf("read") != -1) return 1;
      else if (state.indexOf("write") != -1) return 2;
      else if (state.indexOf("delete") != -1) return 3;
      else return -1;
    },
  },
};
</script>

<style lang="scss" scoped>
.expand-css {
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 14px;
}
</style>
