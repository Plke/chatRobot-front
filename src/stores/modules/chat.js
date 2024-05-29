import { defineStore } from "pinia";
import { ref } from "vue";
export const useChatStore = defineStore(
  "chatRobot-chat",
  () => {
    const chatId = ref("");
    const messageList = ref([]);
    const setChat = (Id, message) => {
      chatId.value = Id;
      messageList.value = message;
    };
    const addMessage = (data) => {
      messageList.value.push(data);
    };
    const removeChat = () => {
      chatId.value = null;
      messageList.value = [];
    };

    return {
      chatId,
      messageList,
      setChat,
      removeChat,
      addMessage,
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
