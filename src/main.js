// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { createRoot } from "./js/render";
import App from "./App";
import router from "./router";
import store from "./store";
import { setBrowserUuid } from "./js/base";

import "@/css/base.scss";
import "@/css/table.scss";
import "@/css/input.scss";
import "@/css/button.scss";
import "@/css/pagination.scss";
import "@/css/date.scss";
import "@/css/breadcrumb.scss";

setBrowserUuid(9);

/* eslint-disable no-new */
createRoot({ router, store, root: App });
