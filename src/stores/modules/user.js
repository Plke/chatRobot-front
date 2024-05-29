// import { getUserAvater } from "@/api/user";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore(
  "chatRobot-user",
  () => {
    const token = ref("");
    const robotAvater = ref("");
    const userAvater = ref("");
    const setToken = (newToken) => {
      token.value = newToken;
    };
    const removeUser = () => {
      robotAvater.value = "";
      token.value = "";
      userAvater.value = "";
    };
    const setRobotAvater = (newAvater) => {
      robotAvater.value = newAvater;
    };
    const setUserAvater = (newAvater) => {
      userAvater.value = newAvater;
    };

    return {
      token,
      setToken,
      removeUser,
      robotAvater,
      userAvater,
      setRobotAvater,
      setUserAvater,
    };
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: "all", //存储的key值，默认为store名，如本例：commonStore
          storage: localStorage, //存储的位置，默认为sessionStorage
          path: ["info"], //需要存储的state状态，默认为所有
        },
      ],
    },
  }
);
