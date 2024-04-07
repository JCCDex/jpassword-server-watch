import Vue from "vue";
import ElementUI from "element-ui";
import 'element-ui/lib/theme-chalk/index.css'

import VueI18n from "vue-i18n";

Vue.use(ElementUI);

Vue.config.productionTip = false;
Vue.use(VueI18n);

const messages = {
  zh: {
    message: require("@/i18n/zh-CN")
  }
};

const i18n = new VueI18n({
  locale: "zh",
  messages
});

const render = ({ component, store }) => {
  const v = new Vue({
    i18n,
    store,
    render(createElement) {
      return createElement(component);
    }
  });

  return v;
};

const createRoot = ({ router, store, root }) => {
  return new Vue({
    el: "#app",
    router,
    store,
    i18n,
    components: { App: root },
    template: "<App/>"
  });
};

export { createRoot, render, i18n };
