import { createPinia } from "pinia";

import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;

// import { useUserStore } from './modules/user'
// export {useUserStore}
// import { useCountStore } from './modules/counter'
// export {useCountStore}

export * from "./modules/user";
export * from "./modules/chat";
