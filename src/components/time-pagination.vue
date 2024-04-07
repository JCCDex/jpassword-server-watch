<template>
  <div>
    <el-row v-if="list" type="flex" align="middle" justify="end">
      <div id="pageArrow">
        <el-button :disabled="list[0] ? list[0].isCurrent : false" @click="changeCurrent(-1)" class="changePage">
          <i class="el-icon el-icon-arrow-left"></i>
        </el-button>
      </div>
      <div v-for="(item, index) in list" :key="index">
        <div style="display: flex; justify-content: center">
          <div
            v-show="index && item && item.end.timestamp != list[index - 1].start.timestamp"
            style="margin-left: 10px"
            class="changePage"
          >
            <span>...</span>
          </div>
          <div v-show="!item" style="margin-left: 10px" class="changePage">
            <span>...</span>
          </div>
          <div id="pageItem">
            <el-button
              :disabled="item ? item.isCurrent : false"
              style="padding: 0px; margin-left: 10px; border: 0px"
              @click="changePage(item, index)"
            >
              <timePaginationItem v-show="item" :range="item"></timePaginationItem>
            </el-button>
          </div>
        </div>
      </div>
      <div id="pageArrow">
        <el-button
          :disabled="list[list.length - 1] ? list[list.length - 1].isCurrent : false"
          @click="changeCurrent(1)"
          class="changePage"
          style="margin-left: 10px"
        >
          <i class="el-icon el-icon-arrow-right"></i>
        </el-button>
      </div>
    </el-row>
  </div>
</template>

<script>
import timestampToDateTimeMixin from "@/mixins/timestampToDateTime";
import BigNumber from "bignumber.js";
import timePaginationItem from "@/components/time-pagination-item";
import { PAGE_LIST_NUM } from "@/js/base";

export default {
  name: "timePagination",
  props: {
    start: {
      type: String,
    },
    end: {
      type: String,
    },
    space: {
      type: Number,
    },
    change: {
      type: Function,
    },
  },
  components: {
    timePaginationItem,
  },
  data() {
    return {
      list: null,
    };
  },
  methods: {
    setRange(start, end) {
      let range = {
        start: {
          date: null,
          time: null,
          timestamp: null,
        },
        end: {
          date: null,
          time: null,
          timestamp: null,
        },
        isCurrent: false,
      };
      range.start.date = this.timestampToDate(new Date(start));
      range.start.time = this.timestampToTime(new Date(start));
      range.start.timestamp = start;
      range.end.date = this.timestampToDate(new Date(end));
      range.end.time = this.timestampToTime(new Date(end));
      range.end.timestamp = end;
      return range;
    },
    changeCurrent(arrow) {
      let index = this.list.findIndex((item) => {
        return item.isCurrent;
      });
      if (this.list.length <= 1) return;
      if (arrow > 0) {
        const rangeEnd = this.list[index].start.timestamp;
        const rangeStart = rangeEnd - this.space * 1000 * 3600;
        let range = null;
        if (index == 0) {
          this.list[index].isCurrent = false;
          range = this.setRange(rangeStart, rangeEnd);
          range.isCurrent = true;
          this.$set(this.list, index + 1, range);
        } else if (index != this.list.length - 1) {
          if (this.list[this.list.length - 1]) {
            if (rangeStart >= this.list[this.list.length - 1].end.timestamp) {
              range = this.setRange(rangeStart, rangeEnd);
              range.isCurrent = true;
              this.$set(this.list, index, range);
            } else {
              this.list[index].isCurrent = false;
              this.list[index + 1].isCurrent = true;
            }
          } else {
            range = this.setRange(rangeStart, rangeEnd);
            range.isCurrent = true;
            this.$set(this.list, index, range);
          }
        }
      } else {
        const rangeStart = this.list[index].end.timestamp;
        const rangeEnd = rangeStart + this.space * 1000 * 3600;
        let range = null;
        if (index == this.list.length - 1) {
          this.list[index].isCurrent = false;
          range = this.setRange(rangeStart, rangeEnd);
          range.isCurrent = true;
          this.$set(this.list, index - 1, range);
        } else if (index != 0) {
          if (rangeEnd <= this.list[0].start.timestamp) {
            range = this.setRange(rangeStart, rangeEnd);
            range.isCurrent = true;
            this.$set(this.list, index, range);
          } else {
            this.list[index].isCurrent = false;
            this.list[index - 1].isCurrent = true;
          }
        }
      }
      index = this.list.findIndex((item) => {
        return item.isCurrent;
      });
      this.change(
        this.list[index].start.date + "T" + this.list[index].start.time + "+08:00",
        this.list[index].end.date + "T" + this.list[index].end.time + "+08:00"
      );
    },
    changePage(item, index) {
      const current_index = this.list.findIndex((item) => {
        return item.isCurrent;
      });
      this.list[current_index].isCurrent = false;
      this.list[index].isCurrent = true;
      this.change(item.start.date + "T" + item.start.time + "+08:00", item.end.date + "T" + item.end.time + "+08:00");
    },
    setPageList() {
      let range = null;
      let list = null;
      let startRange = null;
      const endRange = new Date(this.end).getTime();
      if (this.start) {
        startRange = new Date(this.start).getTime();
        const s_space_e = endRange - startRange;
        const div_num = new BigNumber(s_space_e).idiv(this.space * 1000 * 3600).toNumber();
        const mod = new BigNumber(s_space_e).mod(this.space * 1000 * 3600).toNumber();
        if (mod >= 1000 * 3600) range = this.setRange(startRange, startRange + mod);
        else range = this.setRange(startRange, startRange + mod + this.space * 1000 * 3600);
        if (div_num >= PAGE_LIST_NUM) list = new Array(PAGE_LIST_NUM);
        else list = new Array(mod ? div_num + 1 : div_num);
        list[list.length - 1] = range;
      } else {
        list = new Array(PAGE_LIST_NUM);
      }
      if (list.length > 1) {
        range = this.setRange(endRange - 1000 * 3600 * this.space, endRange);
        list[0] = range;
      }
      for (let i = 1; i < list.length - 1; i++) {
        let itemEnd = list[i - 1].start.timestamp;
        range = this.setRange(itemEnd - 1000 * 3600 * this.space, itemEnd);
        list[i] = range;
      }
      list[0].isCurrent = true;
      this.list = list;
    },
  },
  mixins: [timestampToDateTimeMixin],
};
</script>

<style lang="scss" scoped>
.changePage {
  width: 30px;
  height: 48px;
  padding: 0px;
  border: 0px;
  background: #f4f4f5 !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
