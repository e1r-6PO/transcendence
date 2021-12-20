<template>
<v-container>

  <v-btn
  class="foreground_element neon-button"
  rounded
  text
  color="#ffffff"
  v-if="!in_queue"
  @click="join_matchmaking()"
  >
    find match
  </v-btn>

  <v-btn
  class="foreground_element neon-button"
  rounded
  text
  color="#ffffff"
  v-if="in_queue"
  @click="leave_matchmaking()"
  >
    leave queue
  </v-btn>

  <v-btn
  class="foreground_element neon-button"
  rounded
  text
  color="#ffffff"
  @click="router_push()"
  >
    router push
  </v-btn>

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
      change: false
    }
  },

  methods: {
    async join_matchmaking() {
      this.error_with_server = false

      socket_game.connect()

      var s1 = new Date().getTime() / 1000;
      while (socket_game.connected == false) {
        if ((new Date().getTime() / 1000) - s1 > 2)
          break
        await new Promise(f => setTimeout(f, 50));
      }

      this.in_queue = socket_game.connected

      if (socket_game.connected == false) {
        socket_game.disconnect()
        this.error_with_server = true
      }
    },

    async leave_matchmaking() {
      socket_game.disconnect()
      this.in_queue = socket_game.connected
    },

    closeAlert() {
      this.error_with_server = false
    },

    router_push() {
      this.change = !this.change
    }
  },

  async created() {
    socket_game.on('matchFound', (info) => {
      console.log('match found')
      this.$router.push('/game/' + info['id'] + '?side=' + info['side'])
    })
  }
})

</script>

<style scoped>
@import '../assets/Classes-scss/main_page.scss';
</style>
