<template>
  
</template>

<script lang="ts">

import Vue from 'vue'

import socket_game from '../../plugins/game.io'

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