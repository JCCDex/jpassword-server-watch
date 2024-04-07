export default {
  methods: {
    addClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return { "padding-left": "10px" };
      }
      if (columnIndex === this.$refs.tableList.columns.length - 1) {
        return { "padding-right": "10px" };
      }
    },
  },
};
