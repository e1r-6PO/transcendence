<template>
  
</template>

<script lang="ts">

import Vue from 'vue'

import { io, Socket } from "socket.io-client";

const socket_game = io("http://localhost:3000/game", { withCredentials: true, autoConnect: false });

export default Vue.extend({

  data() {
    return {

    }
  },

  mounted() {
    
  },

  async created() {
    socket_game.on('matchFound', (info) => {
      console.log('match found')
      // this.$router.push('/game/' + info['id'] + '?side=' + info['side'])
    })
    socket_game.on('matchEnd', (info) => {
        console.log('match ended nik saner')
    })
  }
})
</script>

<style>

</style>