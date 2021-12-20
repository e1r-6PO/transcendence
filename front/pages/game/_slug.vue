<template>
<v-container>
  <v-btn
  class="foreground_element neon-button"
  rounded
  text
  color="#ffffff"
  @click="leave()"
  >
    forfeit
  </v-btn>
</v-container>
</template>

<script lang="ts">

import Vue from 'vue'

import socket_game from '../../plugins/game.io'

export default Vue.extend({

  data() {
    return {

    }
  },

  async mounted() {
    if (socket_game.connected == false) {
      socket_game.connect()
    }
    var s1 = new Date().getTime() / 1000;
    while (socket_game.connected == false) {
      if ((new Date().getTime() / 1000) - s1 > 2)
        break
      await new Promise(f => setTimeout(f, 50));
    }
  },

  methods: {
    leave() {
      socket_game.emit('leave')
      this.$router.push('/home')
    }
  },

  async created() {
    socket_game.on('matchFound', (info) => {
      console.log('match found')
      // this.$router.push('/game/' + info['id'] + '?side=' + info['side'])
    })
    socket_game.on('matchEnd', (info) => {
        console.log('match ended nik saner')
        this.$router.push('/home')
    })
  }
})
</script>

<style scoped>
@import '../../assets/Classes-scss/main_page.scss';
</style>