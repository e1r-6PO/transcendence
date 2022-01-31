<template>
<v-container fill-height fluid>
  <number-connected-user style="position: absolute; left: 12px; top: 30px;" :amount="playerOnline" />
  <AlertError @end="alert = !alert" :state="alert" :type="alertType" :textError="alertText" />
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
      playerOnline: 0,
      watchPlayerCount: null as unknown as ReturnType<typeof setTimeout>,
      alert: false,
      alertType: "error",
      alertText: "",
    }
  },

  head() {
    return {
      title: "Home"
    };
  },

  async mounted() {
    let stats = this.$axios.$get('/api/stats', { progress: false }).then((res: any) => {
      this.playerOnline = res['playerOnline']
    })
    this.watchPlayerCount = setInterval(() => this.getPlayerOnline(), 1000)
    if (socket_game.connected)
    {
      socket_game.emit('getQueueStatus')
    }
  },

  async created() {
    socket_game.on('queueStatus', (status) => {
      if (status == true) {
        this.in_queue = true
        this.$nuxt.$emit("inQueue")
      }
    })
  },

  destroyed() {
    clearInterval(this.watchPlayerCount)
  },

  methods: {

    async getPlayerOnline() {
      this.$axios.$get('/api/stats', { progress: false }).then((res: any) => {
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
      if (socket_game.connected == false) {
        socket_game.connect()

        var s1 = new Date().getTime() / 1000;
        while (socket_game.connected == false) {
          if ((new Date().getTime() / 1000) - s1 > 2) {
            this.activateAlert('error: could not connect to the game server, try to relog into the website', "error")
            return
          }
          await new Promise(f => setTimeout(f, 50));
        }
      }

      if(this.isSoundEnabled) {
        this.$store.state.sounds.inQueue.play()
      }

      this.in_queue = true
      socket_game.emit('joinQueue')
      this.$nuxt.$emit("inQueue")
    },

    async activateAlert(msg: string, type: string) {
      this.alertText = msg
      this.alertType = type
      this.alert = true
    },

    async leaveQueue() {
      // socket_game.disconnect()\
      if(this.isSoundEnabled) {
        this.$store.state.sounds.offQueue.play()
      }
      socket_game.emit('leaveQueue')
      this.in_queue = false
      this.$nuxt.$emit("leaveQueue")
    },
  },

  computed: {
    isSoundEnabled() {
      return this.$store.state.isSoundEnabled;
    }
  }
})

</script>

<style scoped>
@import '../assets/Classes-scss/main_page.scss';
@import '../assets/Classes-scss/neon_effects.scss';
@import '../assets/Classes-scss/neonText_colors.scss';
</style>
