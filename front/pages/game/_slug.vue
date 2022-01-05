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
import { Player } from '../../assets/Classes-ts/Player'

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
      balls: new Map<number, Ball>(),
      paddle1: new Player(20, 300),
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
      }
      if (socket_game.connected == false)
        return // error could not connect
      else {
        // socket_game.emit('join', { id: this.game_id })
      }
    }

    socket_game.emit('join', { id: this.game_id })

    var m = <HTMLCanvasElement> document.getElementById("map")
    var ctx = m.getContext("2d");
    this.map = ctx

    //listener keydown
    window.addEventListener('keydown', (event) => {
      if (event.key == 'W')
        console.log('KeyDown: W');
      else if (event.key == "S")
        console.log('KeyDown: S')
      else if (event.key == 'ArrowUp')
      {
        console.log('KeyDown: ArrowUp');
        this.paddle1.moveUp();
      }
      else if (event.key == 'ArrowDown')
      {
        console.log('KeyDown: ArrowDown');
        this.paddle1.moveDown();
      }
    })

    window.addEventListener('keyup', (event) => {
      if (event.key == 'W')
        console.log('KeyUp: W');
      else if (event.key == "S")
        console.log('KeyUP: S')
      else if (event.key == 'ArrowUp')
        console.log('KeyUp: ArrowUp');
      else if (event.key == 'ArrowDown')
        console.log('KeyUp: ArrowDown');
    })
    // this.balls.push(new Ball(50, 50))
    // this.map.fillStyle = 'white'
    // this.map.rect(0, 0, 10, 10)
    // this.map.fill()
  },

  methods: {
    leave() {
      socket_game.emit('forfeit', { id: this.game_id })
      this.$router.push('/home')
    },
  },

  async created() {
    socket_game.on('matchInfo', (info) => {
        console.log(info)
        this.player0 = info['player0']
        this.player1 = info['player1']
    })
    socket_game.on('matchEnd', (info) => {
        console.log(info)
        this.$router.push('/home')
    })
    socket_game.on('matchSetup', (info) => {
      console.log(info)
      this.map.clearRect(0, 0, this.mapx, this.mapy);
      this.map.fillStyle = 'white'
      this.map.fillText(info['gameStart'], this.mapx / 2, this.mapy / 2);
    })
    socket_game.on('gameInfo', (info) => {
      this.map.clearRect(0, 0, this.mapx, this.mapy);
      this.map.beginPath()
      this.map.fillStyle = 'white'
      for (let i = 0; i < info.length; ++i) {
        if (this.balls.get(info[i].id) == undefined && info[i].status == "normal") { // create a new ball
          this.balls.set(info[i].id, new Ball(info[i]['ball_location'][0], info[i]['ball_location'][1]))
        }
        if (this.balls.get(info[i].id) == undefined && info[i].status == "erased") { // create a new ball
          // do nothing
        }
        else if (info[i].status == "normal"){
          this.balls.get(info[i].id).x = info[i].ball_location[0]
          this.balls.get(info[i].id).y = info[i].ball_location[1]
          // console.log(this.balls[0].x, this.balls[0].y)
          this.map.rect(this.balls.get(info[i].id).x - 10, this.balls.get(info[i].id).y - 10, 18, 18)
          //player1
          this.map.rect (this.paddle1.x, this.paddle1.y, this.paddle1.width, this.paddle1.height)
        }
        else if (info[i].status == "erased"){
          this.balls.delete(info[i].id)
        }
      }
      // drawing balls
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