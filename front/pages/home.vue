<template>
<v-container>
  <v-row style="align: center">
    <v-col align="center">

      <BasicBtn @click="leaveQueue()" content="mdi-close" neonColor="red" :disable="!in_queue"/>

      <join-queue-btn @click="joinMatchmaking()" :inQueue="in_queue" msg="PLAY"/>

      <v-alert
        v-model="error_with_server"
        outlined
        type="error"
        text
        dismissible
        @input="closeAlert"
      >
        error: could not reach the server
      </v-alert>

      <v-alert
        v-model="in_queue"
        outlined
        type="warning"
        text
      >
        Do not refresh the page, we are looking for a match
      </v-alert>
    </v-col>
  </v-row>
</v-container>
</template>

<script lang='ts'>

import Vue from 'vue'

import socket_game from '../plugins/game.io'

export default Vue.extend({

  data() {
    return {
      in_queue: false,
      error_with_server: false,
    }
  },

  methods: {

    async joinMatchmaking() {
      this.error_with_server = false
      if (socket_game.connected == false) {
        socket_game.connect()

        var s1 = new Date().getTime() / 1000;
        while (socket_game.connected == false) {
          if ((new Date().getTime() / 1000) - s1 > 2) {
            this.error_with_server = true
            return
          }
          await new Promise(f => setTimeout(f, 50));
        }
      }

      socket_game.emit('joinQueue')

      this.in_queue = true
    },

    async leaveQueue() {
      // socket_game.disconnect()
      socket_game.emit('leaveQueue')
      this.in_queue = false
    },

    closeAlert() {
      this.error_with_server = false
    },
  },

  async created() {
    if (!socket_game.hasListeners('matchFound')) {
    socket_game.on('matchFound', (info) => {
      this.$router.push('/game/' + info['id'])
    })}
  }
})

</script>

<style scoped>
@import '../assets/Classes-scss/main_page.scss';
</style>
