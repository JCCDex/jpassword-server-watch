import getUuid from "../uuid";
import MessageCode from "./message-code";

export { MessageCode };

export const BASE_URL = {
  browser: "https://stats.jccdex.cn",
  servers: "https://whprth.jccdex.cn:8443",
  log: "https://wuhuloki.jccdex.cn:8443",
};

let browserUuid = "";

export const setBrowserUuid = (len, radix) => {
  browserUuid = getUuid(len, radix);
};

export const getBrowserUuid = () => {
  return browserUuid;
};

export const SIZE = 10;
export const PAGE = 1;

export const DEFAULT_SPACE = 3;
export const PAGE_LIST_NUM = 3;
