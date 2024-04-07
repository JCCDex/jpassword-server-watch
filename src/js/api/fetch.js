import axios from "axios";
import { getBrowserUuid } from "../base";
import Response from "./response/";
import ApiError from "./response/api-error";
import { BASE_URL } from "@/js/base";

const service = axios.create({
  baseURL: "",
});

service.interceptors.request.use(
  async (config) => {
    if (config.uuid) {
      config.url = config.url + "/" + getBrowserUuid();
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  async (response) => {
    const configBaseurl = response.config.baseURL;
    if (configBaseurl === BASE_URL.browser) {
      const res = new Response(response.data);
      if (res.isSuccess()) {
        return res;
      }
      return Promise.reject(new ApiError(res.message, res.code, res.data));
    } else if (configBaseurl === BASE_URL.servers || configBaseurl === BASE_URL.log) {
      return response.data;
    }
    return response;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default service;
