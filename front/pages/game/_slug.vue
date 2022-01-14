<template>
<v-container>
  <AlertError :textError="alertText" :state="alert" :type="alertType"></AlertError>
  <div>
    <v-btn
    class="foreground_element neon-button"
    rounded
    text
    color="#ffffff"
    @click="forfeit()"
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
import { Particle } from '../../assets/Classes-ts/Particle'
import { Match } from '../../assets/Classes-ts/Match'
import { gsap } from 'gsap'
import socket_game from '../../plugins/game.io'

export default Vue.extend({
  data() {
    return {
      match_res: Match,
      alertText: "",
      alert: false,
      alertType: "error",
      game_id: this.$route.params.slug,
      player0: new LightUser(),
      player1: new LightUser(),
      mapx: 840,
      mapy: 600,
      balls: new Map<number, Ball>(),
      paddle0: new Paddle(),
      paddle1: new Paddle(),
      m : Object(),
      maptest : Object(),
      particles: [Particle]
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
      
      }
    }
    this.m = document.getElementById("map")
    this.maptest = this.m.getContext("2d")

    socket_game.emit('join', { id: this.game_id })
    //Keydown listener
    window.addEventListener('keydown', (event) => {
      if (event.key == 'W')
        console.log('KeyDown: W');
      else if (event.key == "S")
        console.log('KeyDown: S')
      else if (event.key == 'ArrowUp')
      {
        console.log('KeyDown: ArrowUp');
        socket_game.emit('updatePaddle', { id: this.game_id, direction: 1 })
      }
      else if (event.key == 'ArrowDown')
      {
        console.log('KeyDown: ArrowDown');
        socket_game.emit('updatePaddle', { id: this.game_id, direction: -1 })
      }
    })
    //Keyup listener
    window.addEventListener('keyup', (event) => {
      if (event.key == 'W')
        console.log('KeyUp: W');
      else if (event.key == "S")
        console.log('KeyUP: S')
      else if (event.key == 'ArrowUp')
      {
        console.log('KeyUp: ArrowUp');
        socket_game.emit('updatePaddle', { id: this.game_id, direction: 0 })
      }
      else if (event.key == 'ArrowDown')
      {
        console.log('KeyUp: ArrowDown');
        socket_game.emit('updatePaddle', { id: this.game_id, direction: 0 })

      }
    })
  },

  methods: {
    forfeit() {
      socket_game.emit('forfeit', { id: this.game_id })
      const urlParams = new URLSearchParams(window.location.search);
      const myParam = urlParams.get('next');
      if (myParam != null)
        this.$router.push(myParam)
      else
        this.$router.push('/home')
    },
  },

  async created() {
    socket_game.on('oldGame', async (info: null) => {
      this.match_res = await this.$axios.$get('/api/games/' + this.game_id)
    })

    socket_game.on('matchInfo', (info) => {
        // console.log(info)
        this.player0 = info['player0']
        this.player1 = info['player1']
        this.paddle0.color = this.player0.paddleColor
        this.paddle1.color = this.player1.paddleColor
    })

    socket_game.on('matchEnd', async (info) => {
        socket_game.off('matchInfo')
        socket_game.off('matchEnd')
        socket_game.off('matchSetup')
        socket_game.off('gameInfo')
        // console.log(info)
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('next');
        if (myParam != null)
          var next = myParam
        else
          var next = '/home'
        this.alert = true
        for (let i: number = 3; i >= 0; --i) {
          this.alertText = "Returning to " + next + ' in ' + i
          await new Promise(f => setTimeout(f, 1000))  // countdown
        }
        this.$router.push(next)
    })

    socket_game.on('matchSetup', (info) => {
      var m = <HTMLCanvasElement> document.getElementById("map")
      var maptest = <CanvasRenderingContext2D> m.getContext("2d");

      maptest.clearRect(0, 0, this.mapx, this.mapy);
      maptest.fillStyle = 'white'
      maptest.fillText(info['gameStart'], this.mapx / 2, this.mapy / 2);
    })

    socket_game.on('gameInfo', (info) => {
      this.m = <HTMLCanvasElement> document.getElementById("map")
      this.maptest = <CanvasRenderingContext2D> this.m.getContext("2d");

      this.maptest.shadowColor = 'black'
      this.maptest.shadowBlur = 0;
      this.maptest.fillStyle = 'black'
      this.maptest.fillStyle = 'rgba(0, 0, 0, 0.1)'
      this.maptest.fillRect(0, 0, this.mapx, this.mapy);
      for (let i = 0; i < info.length; ++i) {
        if (this.balls.get(info[i].id) == undefined && info[i].status == "normal") { // create a new ball
          this.balls.set(info[i].id, new Ball(info[i]['ball_info'][0], info[i]['ball_info'][1], info[i]['ball_info'][2], info[i]['ball_info'][3]))
        }
        if (this.balls.get(info[i].id) == undefined && info[i].status == "erased") { // create a new ball
          // do nothing
        }
        else if (info[i].status == "normal"){
          var c_ball = this.balls.get(info[i].id)
          if (c_ball != undefined) {
            c_ball.x = info[i].ball_info[0]
            c_ball.y = info[i].ball_info[1]
            c_ball.width = info[i].ball_info[2]
            c_ball.height = info[i].ball_info[3]

            //draw Ball
            //if coll in ball
            c_ball.draw(this.maptest)
          }
        }
        else if (info[i].status == "erased"){
          this.balls.delete(info[i].id)
        }
      }
      //draw player left
      this.maptest.beginPath()
      this.maptest.fillStyle = '#ff7b1c';
      this.maptest.shadowColor = '#ff7b1c';
      this.maptest.shadowBlur = 8;
      this.maptest.fillRect(this.paddle0.x, this.paddle0.y, this.paddle0.width, this.paddle0.height)
      this.maptest.closePath()
      
      //draw player right
      this.maptest.beginPath()
      this.maptest.fillStyle = 'darkred'
      this.maptest.shadowColor = 'red';
      this.maptest.shadowBlur = 8;
      this.maptest.fillRect(this.paddle1.x, this.paddle1.y, this.paddle1.width, this.paddle1.height)  
      this.maptest.closePath()    
    })

    socket_game.on('paddle0Info', (info) => {
      this.paddle0.x = info['paddle0_info'][0]
      this.paddle0.y = info['paddle0_info'][1]
      this.paddle0.width = info['paddle0_info'][2]
      this.paddle0.height = info['paddle0_info'][3]
      console.log(info)
    })

    socket_game.on('paddle1Info', (info) => {
      this.paddle1.x = info['paddle1_info'][0]
      this.paddle1.y = info['paddle1_info'][1]
      this.paddle1.width = info['paddle1_info'][2]
      this.paddle1.height = info['paddle1_info'][3]
      console.log(info)
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