<template>
  <el-row class="page">
    <Sidebar />
    <ChatArea />
  </el-row>
</template>

<script>
import Sidebar from "./Sidebar.vue";
import ChatArea from "./ChatArea.vue";

export default {
  name: "Chat",
  components: {
    Sidebar,
    ChatArea,
  },
};
</script>

<style scoped>
.page {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
