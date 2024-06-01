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
  setUserAvatar,
} from "@/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";
import { useUserStore, useChatStore } from "@/stores";

const chatNameList = ref();
const userStore = useUserStore();
const chatStore = useChatStore();
const isLogin = ref(userStore.isLogin.value);

// 新建一个对话
const onAddChat = async () => {
  console.log("创建新的对话");
  const res = await addChatService();
  chatStore.setChat(res.data.data, null);

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
// 获取一个对话的内容
const onGetContentList = async (row) => {
  console.log("开始获取对话内容");
  const res = await getChatContentService(row.chatId);
  console.log("对话id" + row.chatId);

  // console.log(res.data.data.messageList);
  chatStore.setChat(row.chatId, res.data.data.messageList);
};
const loginDialogVisible = ref(false);

const loginForm = ref({
  username: "",
  password: "",
});

// 登陆
const onLogin = async () => {
  console.log(loginForm);
  loginDialogVisible.value = false;
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
  loginDialogVisible.value = false;

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
// 更换头像
const avatarDialogVisible = ref(false);
// TODO 上传头像
// const beforeAvatarUpload = () => {
//   if (rawFile.type !== "image/jpeg") {
//     ElMessage.error("Avatar picture must be JPG format!");
//     return false;
//   } else if (rawFile.size / 1024 / 1024 > 5) {
//     ElMessage.error("Avatar picture size can not exceed 2MB!");
//     return false;
//   }
//   return true;
// };

// const handleAvatarSuccess = (response, uploadFile) => {
//   userStore.setUserAvatar(uploadFile.raw);
//   const data = {
//     avater: uploadFile.raw,
//   };
//   setUserAvatar(data);
// };
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
      <el-menu :default-active="chatStore.chatId" style="width: 100%">
        <el-menu-item
          v-for="row in chatNameList"
          :key="row.chatId"
          :index="row.chatId"
          class="chat-item"
        >
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
          <el-avatar :src="userStore.userAvatar" :size="80" :fit="fill" />
        </div>
        <div class="option">
          <el-dropdown>
            <el-button type="primary">
              操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <div @click="avatarDialogVisible = true">更换头像</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="onLogout">退出登录</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <!-- TODO 上传头像 -->
        <el-dialog v-model="avatarDialogVisible" title="更换头像" center>
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8080/upload"
            :show-file-list="false"
            auto-upload="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>

          <el-button type="primary" @click="onLogin">更换</el-button>
          <el-button @click="avatarDialogVisible = false">取消</el-button>
        </el-dialog>
      </div>
      <!-- 未登录模块 -->
      <div v-else>
        <el-button type="primary" @click="loginDialogVisible = true">
          登陆
        </el-button>

        <el-dialog v-model="loginDialogVisible" title="登录" center>
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
              <el-button @click="loginDialogVisible = false">取消</el-button>
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
    height: 15%;
    .user-info {
      background-color: black;
      display: flex;
      height: 100%;
      width: 100%;
      justify-content: space-between; /* 左右分布 */
      align-items: center; /* 垂直居中，可选 */
      .user-avatar {
      }
      .option {
        margin-right: 10%;
      }
    }
  }
}
</style>
