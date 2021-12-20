<template>
	<v-container>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { io } from 'socket.io-client'
// import VueSocketIOExt from 'vue-socket.io-extended'
import { Messages } from '../../assets/Classes-ts/Messages'
import { LightUser } from '../../assets/Classes-ts/User'

const socket_game = io('http://localhost:3000/game', { withCredentials: true })
// Vue.use(VueSocketIOExt, socket) 

export default Vue.extend({
  middleware: 'login',
 
//   sockets:{
//     connect(){
//       console.log('Connected');
//     },
//     disconnect(){
//       this.$socket.$unsubscribe('Disconnected');
//     }
//   },

  async created() {
    console.log('Created()');
		console.log(socket_game.connect());
    socket_game.on('connect', () => {
      console.log('Hello')
    })
	}
})

</script>
