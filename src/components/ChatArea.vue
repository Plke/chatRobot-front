<script setup>
import { onBeforeUpdate, onMounted, ref, watch } from "vue";
import { useUserStore, useChatStore } from "@/stores";
import { sendNewMessage, getChatContentService } from "@/api";
const userStore = useUserStore();
const chatStore = useChatStore();

const userAvatar = ref(userStore.userAvatar);
const robotAvatar = ref(userStore.robotAvatar);
const inputRf = ref("");
const chatId = ref();
chatId.value = chatStore.chatId;

// 发送新的消息
const onSendMessage = async () => {
  if (inputRf.value == "") {
    return;
  }
  const userData = {
    content: inputRf.value,
    chatId: chatId.value,
    userId: "",
    createTime: null,
  };
  console.log("用户说", userData);
  chatStore.addMessage(userData);
  inputRf.value = "";

  const res = await sendNewMessage(userData);

  const robotData = {
    content: res.data.data,
    chatId: chatId.value,
    userId: "robot",
    createTime: null,
  };
  console.log("机器人说", robotData);
  chatStore.addMessage(robotData);

  const chatMiddle = document.querySelector(".chat-middle");
  console.log("获取dom：" + chatMiddle);

  chatMiddle.scrollBy(0, chatMiddle.scrollHeight, "smooth");
};
</script>

<template>
  <el-col :span="19" class="chat-content">
    <el-row class="chat-top">等待增加</el-row>
    <el-row class="chat-middle">
      <div v-if="(messageList == null || messageList.length) === 0">
        尝试新建一个对话把
      </div>
      <div
        v-else
        class="message-item"
        v-for="row in chatStore.messageList"
        key="row.id"
      >
        <div class="avatar">
          <img v-if="row.userId == 'robot'" :src="userAvatar" alt="" />
          <img v-else :src="robotAvatar" alt="" />
        </div>
        <div class="time">
          {{ row.createTime }}
        </div>
        <div class="content">{{ row.content }}</div>
      </div>
    </el-row>
    <el-row class="chat-buttom">
      <div>
        <input
          type="text"
          v-model="inputRf"
          placeholder="输入信息..."
          @keyup.enter="onSendMessage"
        />
        <el-button @click="onSendMessage">发送</el-button>
      </div>
    </el-row>
  </el-col>
</template>

<style scoped>
html {
  scroll-behavior: smooth;
}
.chat-content {
  height: 100%;
  position: relative;
  .chat-top {
    height: 10%;
    border: 1px solid #ccc;
  }
  .chat-middle {
    border: 1px solid #ccc;
    height: 75%;
    overflow-y: scroll;
    .message-item {
      height: 80px;
      width: 100%;
      display: flex;
      .avatar {
        /* 不允许被压缩 */
        flex-shrink: 0;
        margin: auto 0;
        height: 50px;
        width: 50px;
        img {
          height: 100%;
          width: 100%;
        }
      }
      .content {
        width: 100%;
        border: 2px solid;
      }
    }
  }
  .chat-buttom {
    border: 1px solid #ccc;
    height: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
