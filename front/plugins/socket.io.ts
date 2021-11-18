import Vue from 'vue';
import { io } from 'socket.io-client';
import VueSocketIOExt from 'vue-socket.io-extended';

const socket = io('http://localhost:3000')

// export default ({ store }) => {
//     Vue.use(VueSocketIOExt, socket, { store })
// }

export default () => {
    Vue.use(VueSocketIOExt, socket)
}
