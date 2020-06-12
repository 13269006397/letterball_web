import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//引入elemen-u控件
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;

//使用use命令后才起作用
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
