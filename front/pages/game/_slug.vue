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
import { Paddle } from '../../assets/Classes-ts/Paddle'

import socket_game from '../../plugins/game.io'

export default Vue.extend({
  data() {
    return {
      game_id: this.$route.params.slug,
      player0: LightUser,
      player1: LightUser,
      mapx: 840,
      mapy: 600,
      balls: new Map<number, Ball>(),
      paddle0: new Paddle(),
      paddle1: new Paddle()
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

    //listener keydown
    window.addEventListener('keydown', (event) => {
      if (event.key == 'W')
        console.log('KeyDown: W');
      else if (event.key == "S")
        console.log('KeyDown: S')
      else if (event.key == 'ArrowUp')
      {
        console.log('KeyDown: ArrowUp');
        // this.paddle0.moveUp();
        //send Update paddle with game_id + mov
        socket_game.emit('updatePaddle', { id: this.game_id, direction: 1})
      }
      else if (event.key == 'ArrowDown')
      {
        console.log('KeyDown: ArrowDown');
        // this.paddle0.moveDown();
        //send Update paddle with game_id + mov
        socket_game.emit('updatePaddle', { id: this.game_id, direction: -1})
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

      var m = <HTMLCanvasElement> document.getElementById("map")
      var maptest = <CanvasRenderingContext2D> m.getContext("2d");

      maptest.clearRect(0, 0, this.mapx, this.mapy);
      maptest.fillStyle = 'white'
      maptest.fillText(info['gameStart'], this.mapx / 2, this.mapy / 2);
    })
    socket_game.on('gameInfo', (info) => {

      var m = <HTMLCanvasElement> document.getElementById("map")
      var maptest = <CanvasRenderingContext2D> m.getContext("2d");

      maptest.clearRect(0, 0, this.mapx, this.mapy);
      maptest.beginPath()
      maptest.fillStyle = 'white'
      for (let i = 0; i < info.length; ++i) {
        if (this.balls.get(info[i].id) == undefined && info[i].status == "normal") { // create a new ball
          this.balls.set(info[i].id, new Ball(info[i]['ball_location'][0], info[i]['ball_location'][1]))
        }
        if (this.balls.get(info[i].id) == undefined && info[i].status == "erased") { // create a new ball
          // do nothing
        }
        else if (info[i].status == "normal"){
          var c_ball = this.balls.get(info[i].id)
          if (c_ball != undefined) {
            c_ball.x = info[i].ball_location[0]
            c_ball.y = info[i].ball_location[1]
            // console.log(this.balls[0].x, this.balls[0].y)
            maptest.rect(c_ball.x - 10, c_ball.y - 10, 18, 18)
          }
        }
        else if (info[i].status == "erased"){
          this.balls.delete(info[i].id)
        }
      }
      //player1
      this.map.rect(this.paddle0.x, this.paddle0.y, this.paddle0.width, this.paddle0.height)
      this.map.rect(this.paddle1.x, this.paddle1.y, this.paddle1.width, this.paddle1.height)
      // drawing balls
      maptest.fill()
    })

    socket_game.on('paddleInfo', (info) => {
      this.paddle0.x = info['paddle0_location'][0]
      this.paddle0.y = info['paddle0_location'][1]
      this.paddle1.x = info['paddle1_location'][0]
      this.paddle1.y = info['paddle1_location'][1]
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