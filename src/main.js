import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import pinia from "./stores";

import App from "./App.vue";

const app = createApp(App);
app.use(pinia);
app.use(ElementPlus);
app.mount("#app");
