import { i18n } from "@/js/render";

const serverType = [
  //区块链节点
  {
    value: "blockChain",
    label: i18n.t("message.server_type.block_chain"),
  },
  //数据读写服务节点
  {
    value: "dateRW",
    label: i18n.t("message.server_type.date_read_and_write"),
  },
  //收费服务节点
  {
    value: "payServer",
    label: i18n.t("message.server_type.pay_server"),
  },
  //IPFS节点
  {
    value: "ipfsInfo",
    label: i18n.t("message.server_type.ipfs_info"),
  },
];

export default serverType;
