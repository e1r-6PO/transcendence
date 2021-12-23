<template>
<v-container>
  <div if="has_load == true">
    <v-btn
    class="foreground_element neon-button"
    rounded
    text
    color="#ffffff"
    @click="leave()"
    >
      forfeit
    </v-btn>
  </div>
</v-container>
</template>

<script lang="ts">

import Vue from 'vue'
import { LightUser } from '../../assets/Classes-ts/User'

import socket_game from '../../plugins/game.io'
import FaVue from '../2fa.vue'

export default Vue.extend({

  data() {
    return {
      player0: LightUser,
      player1: LightUser,
      has_load: false
    }
  },

  async mounted() {
    if (socket_game.connected == false) {
      socket_game.connect()
      var s1 = new Date().getTime() / 1000;
      while (socket_game.connected == false) {
        if ((new Date().getTime() / 1000) - s1 > 2)
          break
        await new Promise(f => setTimeout(f, 50));
      // socket_game.emit('spectate', {})
      }
    }
  },

  methods: {
    leave() {
      socket_game.emit('leave')
      this.$router.push('/home')
    }
  },

  async created() {
    if (!socket_game.hasListeners('matchInfo')) {
      socket_game.on('matchInfo', (info) => {
        console.log(info)
        this.player0 = info['player0']
        this.player1 = info['player1']
        this.has_load = true
    })}
    if (!socket_game.hasListeners('matchEnd')) {
    socket_game.on('matchEnd', (info) => {
        new Promise(f => setTimeout(f, 1000))
        console.log('match ended nik saner', info)
        this.$router.push('/home')
    })}
  },
  beforeRouteLeave (to, from , next) {
    socket_game.off('matchInfo')
    socket_game.off('matchEnd')
    next()
  }
})
</script>

<style scoped>
@import '../../assets/Classes-scss/main_page.scss';
</style>