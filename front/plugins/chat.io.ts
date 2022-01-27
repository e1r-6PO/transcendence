import Vue from 'vue';
import { io } from 'socket.io-client';
import VueSocketIOExt from 'vue-socket.io-extended';

const socket_chat = io("http://" + process.env.BACKHOST + "/chat", { withCredentials: true, autoConnect: false });

export default socket_chat
