<script setup>
import { ref } from "vue";
import {
  getChatListService,
  chatDeleteService,
  addChatService,
  chatRenameService,
  getChatContentService,
  loginService,
  registerService,
} from "@/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";
import { useUserStore, useChatStore } from "@/stores";

const chatNameList = ref();
const userStore = useUserStore();
const chatStore = useChatStore();
const loading = ref(false);
// 新建一个对话
const onAddChat = async () => {
  console.log("创建新的对话");
  const res = await addChatService();
  getChatNameList();
};
// 获取对话列表
const getChatNameList = async () => {
  console.log("获取对话列表");
  const res = await getChatListService();
  chatNameList.value = res.data.data;
};

// 删除对话
const onDelChat = async (row) => {
  await ElMessageBox.confirm("你确认要删除该对话吗", "温馨提示", {
    type: "warning",
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  });
  console.log(row.chatId);
  await chatDeleteService(row.chatId);
  ElMessage("删除成功");
  getChatNameList();
};
// 对话重命名
const onRename = async (row) => {
  // 弹出对话框，让用户输入新的名字
  const newName = window.prompt("请输入新的名字：", row.chatName);

  // 如果用户点击了取消按钮或者没有输入任何内容，则不进行任何操作
  if (!newName) return;

  row.chatName = newName;
  console.log(row);
  const data = {
    chatId: row.chatId,
    chatName: row.chatName,
  };
  await chatRenameService(data);
};

// TODO 修改用户
const onGetContentList = async (row) => {
  console.log("开始获取对话内容");
  const res = await getChatContentService(row.chatId);
  chatStore.setChat(row.chatId, res.data.data.messageList);
};
const dialogVisible = ref(false);

const loginForm = ref({
  username: "",
  password: "",
});

// 登陆
const onLogin = async () => {
  console.log(loginForm);
  dialogVisible.value = false;
  const data = {
    username: loginForm.value.username,
    password: loginForm.value.password,
  };
  const res = await loginService(data);
  const token = res.data.data;
  userStore.setToken(token);
  ElMessage.success("登录成功");
  getChatNameList();
  isLogin.value = true;
};

// 注册
const onRegister = async () => {
  dialogVisible.value = false;

  const data = {
    username: loginForm.value.username,
    password: loginForm.value.password,
  };
  const res = await registerService(data);
  const token = res.data.data;
  userStore.setToken(token);
  ElMessage.success("注册成功");
  getChatNameList();
  isLogin.value = true;
};
//退出登录
const onLogout = () => {
  userStore.removeUser();
  chatStore.removeChat();
  isLogin.value = false;
  chatNameList.value = null;
};

const isLogin = ref(false);

if (userStore.token) {
  isLogin.value = true;
  getChatNameList();
}

getChatNameList();
</script>
<template>
  <el-col :span="5" class="sidebar">
    <el-row class="top">
      <div style="margin: auto">
        <el-button @click="onAddChat"> 新的对话 </el-button>
      </div>
    </el-row>
    <el-row class="middle">
      <el-menu>
        <el-menu-item v-for="row in chatNameList" class="chat-item">
          <div @click="onGetContentList(row)" class="chat-name">
            {{ row.chatName }}
          </div>
          <div class="chat-option">
            <el-dropdown>
              <el-button type="primary">
                操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <div @click="onDelChat(row, $index)">删除</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="onRename(row, $index)">重命名</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-menu-item>
        <template #empty>
          <el-empty description="没有数据"></el-empty>
        </template>
      </el-menu>
    </el-row>
    <el-row class="buttom">
      <!-- 已登录模块 -->
      <div v-if="isLogin" class="user-info">
        <div class="user-avatar">
          <img src="http://localhost:8080/img/1.jpg" />
        </div>
        <div class="option">
          <el-button type="primary" @click="onLogout"> 退出登录 </el-button>
        </div>
      </div>
      <!-- 未登录模块 -->
      <div v-else>
        <el-button type="primary" @click="dialogVisible = true">
          登陆
        </el-button>

        <el-dialog v-model="dialogVisible" title="登录" center>
          <el-form :model="loginForm">
            <el-form-item label="用户名">
              <el-input v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input type="password" v-model="loginForm.password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onRegister"
                >注册并登陆</el-button
              >
              <el-button type="primary" @click="onLogin">登录</el-button>
              <el-button @click="dialogVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </el-row>
  </el-col>
</template>
<style scoped>
.sidebar {
  background-color: #f4f4f5;
  height: 100%;
  position: relative;
  .top {
    height: 15%;
  }
  .middle {
    height: 70%;
    overflow-y: scroll;
    width: 100%;
    .chat-item {
      display: flex;
      width: 100%;
      justify-content: space-between;
      .chat-name {
        max-width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        margin: auto 0;
      }
      .chat-option {
        margin: auto 0;
      }
    }
  }
  .buttom {
    .user-info {
      background-color: black;
      display: flex;
      justify-content: space-between; /* 左右分布 */
      align-items: center; /* 垂直居中，可选 */
      .user-avatar {
        width: 35%;
        img {
          height: 100%;
          width: 100%;
          border-radius: 50%;
        }
      }
      .option {
      }
    }
  }
}
</style>
