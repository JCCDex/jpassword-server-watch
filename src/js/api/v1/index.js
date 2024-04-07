import fetch from "@/js/api/fetch";
import { BASE_URL } from "../../base";

/**
 * 获取用户列表数据（page从0开始）
 *
 * @returns
 */
export const getUserList = async ({ page, size, address }) => {
  const res = await fetch({
    baseURL: BASE_URL.browser,
    url: "/explorer/v1/jpassword/user_list",
    method: "get",
    uuid: true,
    params: {
      p: page - 1,
      s: size || 10,
      w: address || "",
    },
  });
  return res;
};

/**
 * 获取用户付费数据（page从0开始）
 *
 * @returns
 */
export const getUserPay = async ({ page, size, address }) => {
  const res = await fetch({
    baseURL: BASE_URL.browser,
    url: "/explorer/v1/jpassword/pay_list",
    method: "get",
    uuid: true,
    params: {
      p: page - 1,
      s: size || 10,
      w: address || "",
    },
  });
  return res;
};

/**
 * 获取区块链节点工况
 *
 * @returns
 */
export const getBlockChainWorkState = async () => {
  const res = await fetch({
    baseURL: BASE_URL.servers,
    url: "/api/v1/query",
    method: "get",
    params: {
      query: "skywell_server_info_server_state_num",
    },
  });
  return res;
};

/**
 * 获取数据读写服务节点工况
 *
 * @returns
 */
export const getDateRWWorkState = async () => {
  const res = await fetch({
    baseURL: BASE_URL.servers,
    url: "/api/v1/query",
    method: "get",
    params: {
      query: "up{job='jpass-ipfs-pro'}",
    },
  });
  return res;
};

/**
 * 获取收费服务节点工况
 *
 * @returns
 */
export const getpayServerWorkState = async () => {
  const res = await fetch({
    baseURL: BASE_URL.servers,
    url: "/api/v1/query",
    method: "get",
    params: {
      query: "probe_http_status_code{target='jpassword-payserver'}",
    },
  });
  return res;
};

/**
 * 获取IPFS节点工况
 *
 * @returns
 */
export const getIpfsInfoWorkState = async () => {
  const res = await fetch({
    baseURL: BASE_URL.servers,
    url: "/api/v1/query",
    method: "get",
    params: {
      query: "ipfs_info",
    },
  });
  return res;
};

/**
 * 获取IPFS读写访问日志
 *
 * @returns
 */
export const getIpfsRWVisitLog = async (start, end, address, logType) => {
  const query =
    '{app="ipfs-backend"} | json | __error__=`` | ' +
    `${logType ? logType : "request_uri =~ `/api/.*`"}` +
    `${address ? " request_querystring_w=`" + address + "`" : ""}` +
    " | line_format `{{.request_uri}}`";
  const res = await fetch({
    baseURL: BASE_URL.log,
    url: "/loki/api/v1/query_range",
    method: "get",
    params: {
      query: query,
      start: start,
      end: end,
    },
    headers: {
      "X-Scope-OrgID": "jpass-ipfs",
    },
  });
  return res;
};
