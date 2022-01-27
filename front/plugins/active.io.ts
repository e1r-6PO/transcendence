import Vue from 'vue';
import { io } from 'socket.io-client';
import VueSocketIOExt from 'vue-socket.io-extended';

const socket_active = io("http://" + process.env.BACKHOST + "/active", { withCredentials: true, autoConnect: false });

export default socket_active
