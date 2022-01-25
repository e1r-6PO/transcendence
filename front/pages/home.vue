<template>
<v-container fill-height fluid>
  <AlertError :state="alert" :type="alertType" :textError="alertText" />
  <number-connected-user :amount="playerOnline" />
  <v-row align="center" justify="center">
    <v-col align="center">
      <join-queue-btn @click="switchQueueState()" :inQueue="in_queue" :msg="in_queue ? 'CANCEL' : 'PLAY'"/>
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
      alertText: "Do not refresh the page, we are looking for a match",
      alertType: "warning",
      alert: false,
      playerOnline: 0,
      watchPlayerCount: null as unknown as ReturnType<typeof setTimeout>
    }
  },

  async mounted() {
    let stats = this.$axios.$get('/api/stats', { progress: false }).then((res) => {
      this.playerOnline = res['playerOnline']
    })
    this.watchPlayerCount = setInterval(() => this.getPlayerOnline(), 1000)
  },

  destroyed() {
    clearInterval(this.watchPlayerCount)
  },

  methods: {

    async getPlayerOnline() {
      this.$axios.$get('/api/stats', { progress: false }).then((res) => {
        this.playerOnline = res['playerOnline']
      })
    },

    switchQueueState() {
      if (this.in_queue)
        this.leaveQueue()
      else
        this.joinMatchmaking()
    },

    async joinMatchmaking() {
      this.alert = false
      if (socket_game.connected == false) {
        socket_game.connect()

        var s1 = new Date().getTime() / 1000;
        while (socket_game.connected == false) {
          if ((new Date().getTime() / 1000) - s1 > 2) {
            this.activeAlert("error: could not reach the server", "error")
            return
          }
          await new Promise(f => setTimeout(f, 50));
        }
      }

      socket_game.emit('joinQueue')
      this.activeAlert("Do not refresh the page, we are looking for a match", "warning")

      this.in_queue = true
    },

    async leaveQueue() {
      // socket_game.disconnect()
      socket_game.emit('leaveQueue')
      this.in_queue = false
      this.alert = false
    },

    activeAlert(text: string, type: string) {
      this.alertText = text
      this.alertType = type
      this.alert = true
    }
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
