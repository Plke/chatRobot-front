import { getUserAvatar, getRobotAvatar } from "@/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore(
  "chatRobot-user",
  () => {
    const token = ref("");
    const robotAvatar = ref("");
    const userAvatar = ref("");
    const isLogin = ref(false);
    const setToken = (newToken) => {
      token.value = newToken;
      setUserAvatar();
      setRobotAvatar();
    };
    const removeUser = () => {
      robotAvatar.value = "";
      token.value = "";
      userAvatar.value = "";
      isLogin.value = false;
    };
    const setRobotAvatar = async () => {
      const avatar = await getRobotAvatar();
      robotAvatar.value = avatar.data.data;
    };
    const setUserAvatar = async () => {
      const avatar = await getUserAvatar();
      userAvatar.value = avatar.data.data;
    };
    const setIsLogin = (newIsLogin) => {
      isLogin.value = newIsLogin;
    }

    return {
      token,
      isLogin,
      setToken,
      removeUser,
      robotAvatar,
      userAvatar,
      setRobotAvatar,
      setUserAvatar,
      setIsLogin
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
