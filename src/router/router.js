import Vue from "vue";
import Router from "vue-router";
import _import from "./import-component";
import { i18n } from "@/js/render";
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
Vue.use(Router);

const createRouter = () =>
  new Router({
    routes: [
      {
        path: "/",
        name: "index",
        redirect: "/welcome"
      },
      {
        path: "/manage",
        name: "manage",
        redirect: "/welcome",
        component: _import("index"),
        meta: { isMenu: true },
        children: [
          {
            path: "/welcome",
            name: "Welcome",
            component: _import("welcome"),
          },
          {
            path: "/service-run-state",
            name: "service-run-state",
            component: _import("service-run-state"),
            meta: {
              showMenu: true,
              isHover: false,
              title: i18n.t("message.showMenus.service_run_state"),
              icon: require("@/images/service-run-state.svg"),
              selectedIcon: require("@/images/service-run-state-selected.svg")
            }
          },
          {
            path: "/use-access-log",
            name: "use-access-log",
            component: _import("use-access-log"),
            meta: {
              showMenu: true,
              isHover: false,
              title: i18n.t("message.showMenus.use_access_log"),
              icon: require("@/images/use-access-log.svg"),
              selectedIcon: require("@/images/use-access-log-selected.svg")
            }
          },
          {
            path: "/user-list-data",
            name: "user-list-data",
            component: _import("user-list-data"),
            meta: {
              showMenu: true,
              isHover: false,
              title: i18n.t("message.showMenus.user_list_data"),
              icon: require("@/images/user-list-data.svg"),
              selectedIcon: require("@/images/user-list-data-selected.svg")
            }
          },
          {
            path: "/user-pay-data",
            name: "user-pay-data",
            component: _import("user-pay-data"),
            meta: {
              showMenu: true,
              isHover: false,
              title: i18n.t("message.showMenus.user_pay_data"),
              icon: require("@/images/user-pay-data.svg"),
              selectedIcon: require("@/images/user-pay-data-selected.svg")
            }
          },
          {
            path: "/user-list-data/pay-record/:address",
            name: "user-pay-record",
            component: _import("user-pay-record")
          }
        ]
      },
    ]
  });

const router = createRouter();

export default router;
export { createRouter };
