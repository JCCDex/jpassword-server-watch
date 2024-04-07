const timestampToDateTime = {
  methods: {
    timestampToDateTime(timestamp) {
      var date = new Date(timestamp); // 创建一个Date对象

      // 格式化日期和时间
      var formattedDate = this.timestampToDate(date);
      var formattedTime = this.timestampToTime(date);

      return formattedDate + " " + formattedTime;
    },

    timestampToDate(date) {
      var year = date.getFullYear(); // 获取年份
      var month = date.getMonth() + 1; // 获取月份（注意：月份从0开始，需要加1）
      var day = date.getDate(); // 获取日期
      return year + "-" + this.addLeadingZero(month) + "-" + this.addLeadingZero(day);
    },

    timestampToTime(date) {
      var hours = date.getHours(); // 获取小时
      var minutes = date.getMinutes(); // 获取分钟
      var seconds = date.getSeconds(); // 获取秒钟
      return this.addLeadingZero(hours) + ":" + this.addLeadingZero(minutes) + ":" + this.addLeadingZero(seconds);
    },

    addLeadingZero(number) {
      // 在个位数前面补零
      return number < 10 ? "0" + number : number;
    },
  },
};

export default timestampToDateTime;
