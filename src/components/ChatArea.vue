<script setup>
import { ref } from "vue";
import { useUserStore, useChatStore } from "@/stores";
import { sendNewMessage } from "@/api";
const userStore = useUserStore();
const chatStore = useChatStore();
const messageList = chatStore.messageList;
// const avater = ;

const inputRf = ref("");
const onSendMessage = async () => {
  if (inputRf.value == "") {
    return;
  }
  const data = {
    content: inputRf.value,
    chatId: chatStore.chatId,
    userId: "",
    createTime: null,
  };
  chatStore.addMessage(data);
  await sendNewMessage(data);
  inputRf.value = "";
};
</script>

<template>
  <el-col :span="19" class="chat-content">
    <el-row class="top">等待增加</el-row>
    <el-row class="middle">
      <div class="message-item" v-for="row in messageList">
        <div class="avater">
          <img
            v-if="userId == robot"
            src="http://localhost:8080/img/1.jpg"
            alt=""
          />
          <!-- <img v-else src="avater" alt="" /> -->
        </div>
        <div class="time">
          {{ row.createTime }}
        </div>
        <div class="content">{{ row.content }}</div>
      </div>
    </el-row>
    <el-row class="buttom">
      <div>
        <input
          type="text"
          v-model="inputRf"
          placeholder="输入信息..."
          @keyup.enter="onSendMessage"
        />
      </div>
    </el-row>
  </el-col>
</template>

<style scoped>
.chat-content {
  .top {
    height: 10%;
    border: 1px solid #ccc;
  }
  .middle {
    border: 1px solid #ccc;
    height: 75%;
    overflow-y: scroll;

    .message-item {
      height: 80px;
      width: 100%;
      border: 2px solid;
      display: flex;
      .avater {
        margin: auto 0;
        height: 50px;
        width: 50px;
        img {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
  .buttom {
    border: 1px solid #ccc;
    height: 15%;
  }
}
</style>
