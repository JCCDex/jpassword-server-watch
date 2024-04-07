import { i18n } from "@/js/render";

const spaceList = [
  //1小时
  {
    value: 1,
    label: i18n.t("message.space_list.1_hour"),
  },
  //3小时
  {
    value: 3,
    label: i18n.t("message.space_list.3_hour"),
  },
  //6小时
  {
    value: 6,
    label: i18n.t("message.space_list.6_hour"),
  },
  //12小时
  {
    value: 12,
    label: i18n.t("message.space_list.12_hour"),
  },
  //24小时
  {
    value: 24,
    label: i18n.t("message.space_list.24_hour"),
  },
];

export default spaceList;
