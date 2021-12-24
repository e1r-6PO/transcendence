<template>
<v-container>
  <div>
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
  <canvas id="map" width="840" height="600"></canvas>
</v-container>
</template>

<script lang="ts">

import Vue from 'vue'
import { LightUser } from '../../assets/Classes-ts/User'

import { Ball } from '../../assets/Classes-ts/Ball'

import socket_game from '../../plugins/game.io'

export default Vue.extend({

  data() {
    return {
      game_id: this.$route.params.slug,
      player0: LightUser,
      player1: LightUser,
      mapx: 840,
      mapy: 600,
      map: CanvasRenderingContext2D,
      balls: new Array<Ball>()
    }
  },

  async mounted() {
    if (socket_game.connected == false) {
      // check if game has ended
      socket_game.connect()
      var s1 = new Date().getTime() / 1000;
      while (socket_game.connected == false) {
        if ((new Date().getTime() / 1000) - s1 > 2)
          break
        await new Promise(f => setTimeout(f, 50));
      // socket_game.emit('spectate', {})
      }
    }

    var m = <HTMLCanvasElement> document.getElementById("map")
    var ctx = m.getContext("2d");
    this.map = ctx

    // this.balls.push(new Ball(50, 50))
    // this.map.fillStyle = 'white'
    // this.map.rect(0, 0, 10, 10)
    // this.map.fill()
  },

  methods: {
    leave() {
      socket_game.emit('leave')
      this.$router.push('/home')
    }
  },

  async created() {
      socket_game.on('matchInfo', (info) => {
        console.log(info)
        this.player0 = info['player0']
        this.player1 = info['player1']
    })
    socket_game.on('matchEnd', (info) => {
        new Promise(f => setTimeout(f, 1000))
        console.log('match ended nik saner', info)
        this.$router.push('/home')
    })
    socket_game.on('matchSetup', (info) => {
      console.log(info)
      this.map.clearRect(0, 0, this.mapx, this.mapy);
      this.map.fillStyle = 'white'
      this.map.fillText(info['gameStart'], this.mapx / 2, this.mapy / 2);
    })
    socket_game.on('gameInfo', (info) => {
      for (let i = 0; i < info.length; ++i) {
        if(this.balls[i] == undefined) {
          this.balls.push(new Ball(info[0]['ball_location'][0], info[0]['ball_location'][1]))
        }
        else {
          this.balls[i].x = info[0]['ball_location'][0]
          this.balls[i].y = info[0]['ball_location'][1]
        }
      }
      // drawing balls
      this.map.clearRect(0, 0, this.mapx, this.mapy);
      this.map.beginPath()
      this.map.fillStyle = 'white'
      console.log(this.balls[0].x, this.balls[0].y)
      this.map.rect(this.balls[0].x - 10, this.balls[0].y - 10, 18, 18)
      this.map.fill()
    })
  },
  beforeRouteLeave (to, from , next) {
    socket_game.off('matchInfo')
    socket_game.off('matchEnd')
    socket_game.off('matchSetup')
    socket_game.off('gameInfo')
    socket_game.emit('leave')
    next()
  }
})
</script>

<style scoped>
@import '../../assets/Classes-scss/main_page.scss';

#map {
  width: 150;
  height: 150;
  border: 1px solid white;
}
</style>