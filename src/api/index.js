import request from "@/utils/request";

export const getChatListService = () => request.get("/chatlist");

export const chatDeleteService = (chatid) => request.delete(`/${chatid}`);

export const addChatService = () => request.post("/chatlist");

export const chatRenameService = (data) => request.put(`/chatlist`, data);

export const getChatContentService = (chatid) => request.get(`/${chatid}`);

export const loginService = (data) =>
  request.get(`/login?username=${data.username}&password=${data.password}`);

export const registerService = (data) =>
  request.post(`/register?username=${data.username}&password=${data.password}`);

export const sendNewMessage = (data) => request.post(`/chat`, data);

export const getUserAvater = () => request.get("/avater/{userId}");
