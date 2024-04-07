import { i18n } from "@/js/render";

const visitLogList = [
  //全部类型
  {
    value: "request_uri =~ `/api/.*`",
    label: i18n.t("message.visit_log_type.all_type"),
  },
  //读取
  {
    value: "request_uri =~ `/api/.*/read.*`",
    label: i18n.t("message.visit_log_type.read"),
  },
  //保存
  {
    value: "request_uri =~ `/api/.*/write.*`",
    label: i18n.t("message.visit_log_type.save"),
  },
  //删除
  {
    value: "request_uri =~ `/api/.*/remove.*`",
    label: i18n.t("message.visit_log_type.delete"),
  },
];

export default visitLogList;
