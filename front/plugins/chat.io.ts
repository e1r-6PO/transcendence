import Vue from 'vue';
import { io } from 'socket.io-client';
import VueSocketIOExt from 'vue-socket.io-extended';

const socket_chat = io("http://localhost:3000/chat", { withCredentials: true});

export default socket_chat
