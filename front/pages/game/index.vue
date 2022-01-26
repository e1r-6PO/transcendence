<template>
	<v-container>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { io } from 'socket.io-client'
import { Messages } from '../../assets/Classes-ts/Messages'
import { LightUser } from '../../assets/Classes-ts/User'

const socket_game = io('http://localhost:3000/game', { withCredentials: true })

export default Vue.extend({
  middleware: 'login',

  async created() {
    socket_game.on('connect', () => {
    })
	}
})

</script>
