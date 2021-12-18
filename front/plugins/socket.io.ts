import Vue from 'vue';
import { io } from 'socket.io-client';
import VueSocketIOExt from 'vue-socket.io-extended';

// export const socket = io('http://localhost:3000', { withCredentials: true, autoConnect: false })
// export const socket2 = io('http://localhost:3000/chat', { withCredentials: true, autoConnect: false })
// export const socket3 = io('http://localhost:3000/game', { withCredentials: true, autoConnect: false })

// export default ({ store }) => {
//     Vue.use(VueSocketIOExt, socket, { store })
// }

const socket_game = io("http://localhost:3000/game", { withCredentials: true, autoConnect: false });

export default socket_game

// export default () => {
    // Vue.use(VueSocketIOExt, socket, socket2);
// }
