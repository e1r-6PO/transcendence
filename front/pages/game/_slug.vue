<template>
<div>
  <AlertError :textError="alertText" :state="alert" :type="alertType"></AlertError>
  <v-row justify="center">
    <v-col cols="3" class="d-flex flex-column justify-center align-center" style="padding-top: 200px">
      <ProfilePicture :src="player0.picture" :neonColor="player0.paddleColor" size="100" />
      <p class="text-h5 pt-10 pl-3" style="color: #ffffff;">{{player0.nickName}}</p>
      <p class="text-h5 pt-10 pl-3" style="color: #ffffff;">{{ score_p0 }}</p>
    </v-col>

    <v-col cols="6">
      <div justify="center" align="center" class="pt-10 pb-10">
        <BasicBtn v-if="matchStatus == 'running' && (me.id == player0.id || me.id == player1.id) && alert == false" content="forfeit" @click="forfeit" :isText="true" color="#ffffff" class="foreground_element"/>
      </div>
      <canvas id="map" width="840" height="600"></canvas>
    </v-col>

    <v-col cols="3" class="d-flex flex-column justify-center align-center" style="padding-top: 200px">
      <ProfilePicture :src="player1.picture" disble :neonColor="player1.paddleColor" size="100" />
      <p class="text-h5 pt-10 pl-3" style="color: #ffffff;">{{player1.nickName}}</p>
      <p class="text-h5 pt-10 pl-3" style="color: #ffffff;">{{ score_p1 }}</p>
    </v-col>
  </v-row>
</div>
</template>

<script lang="ts">

import Vue from 'vue'
import { LightUser, User } from '../../assets/Classes-ts/User'

import { Ball } from '../../assets/Classes-ts/Ball'
import { Paddle } from '../../assets/Classes-ts/Paddle'
import { Particle } from '../../assets/Classes-ts/Particle'
import { Match } from '../../assets/Classes-ts/Match'
// import { gsap } from 'gsap'
import socket_game from '../../plugins/game.io'

export default Vue.extend({
  data() {
    return {
      match_res: Match,
      matchStatus: "",
      alertText: "",
      alert: false,
      alertType: "error",
      game_id: this.$route.params.slug,
      me: User,
      player0: new LightUser(),
      player1: new LightUser(),
      mapx: 840,
      mapy: 600,
      balls: new Map<number, Ball>(),
      paddle0: Object(),
      paddle1: Object(),
      m : Object(),
      maptest : Object(),
      particles: [Object()],
      updatePage: false,
      score_p0: 0,
      score_p1: 0
    }
  },

  async mounted() {
    this.$axios.$get('/api/profile/me').then(data => this.me = data)
    this.matchStatus = "running"
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
    this.particles = new Array
    
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
      this.matchStatus = 'finished'
      this.match_res = await this.$axios.$get('/api/games/' + this.game_id)
      console.log(this.match_res.scorep1)
      this.score_p0 = this.match_res.scorep0
      this.score_p1 = this.match_res.scorep1
      this.player0 = this.match_res.player0
      this.player1 = this.match_res.player1
    })

    socket_game.on('matchInfo', (info) => {
        this.player0 = info['player0']
        this.player1 = info['player1']
        this.paddle0 = new Paddle(this.player0.paddleColor)
        this.paddle1 = new Paddle(this.player1.paddleColor)
    })

    socket_game.on('matchEnd', async (info) => {
        socket_game.off('matchInfo')
        socket_game.off('matchEnd')
        socket_game.off('matchSetup')
        socket_game.off('gameInfo')
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
      var color = ""

      maptest.clearRect(0, 0, this.mapx, this.mapy);
      if (info['gameStart'] == 3)
        color = this.player0.paddleColor
      else if (info['gameStart'] == 2)
        color = this.player1.paddleColor
      else
        color = 'white'
      maptest.fillStyle = color
      if (color == 'purple')
		  	maptest.shadowColor = 'rebeccapurple'
      else if (color == 'yellow')
        maptest.shadowColor = 'goldenrod'
      else if (color == 'pink')
        maptest.shadowColor = 'darkviolet'
      else if (color == 'white')
        maptest.shadowColor = 'grey'
      else
		  	maptest.shadowColor = 'dark' + color
      maptest.shadowBlur = 20
      maptest.shadowOffsetY = 25
      maptest.shadowOffsetX = 25
      maptest.font = '150px OrbitronM'
      maptest.textAlign = 'center'
      if (info['gameStart'] == 0)
        maptest.fillText("GO!", this.mapx / 2, 320);
      else
        maptest.fillText(info['gameStart'], this.mapx / 2, 320);
    })

    socket_game.on('gameInfo', (info) => {
      this.m = <HTMLCanvasElement> document.getElementById("map")
      this.maptest = <CanvasRenderingContext2D> this.m.getContext("2d");

      this.maptest.shadowOffsetY = 0
      this.maptest.shadowOffsetX = 0
      this.maptest.shadowColor = 'black'
      this.maptest.shadowBlur = 0;
      this.maptest.fillStyle = 'rgba(0, 0, 0, 0.25)'
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
            c_ball.color = info[i].ball_info[5]
            //draw Ball
            //if coll in ball
            if (info[i].ball_info[4] > 0)
            {
              for(let i = 0; i < 10; i++)
              {
                let p_x = (c_ball.x > this.mapx - 50) ? c_ball.x + c_ball.width / 2 : c_ball.x
                let p_y = (c_ball.y > this.mapy - 50) ? c_ball.y + c_ball.height / 2 : c_ball.y
                this.particles.push(new Particle(p_x, p_y, 2, c_ball.color))
              }
            }
            c_ball.draw(this.maptest)
          }
        }
        else if (info[i].status == "erased"){
          this.balls.delete(info[i].id)
        }
      }
      //draw player left
      this.paddle0.draw(this.maptest) 
      
      //draw player right
      this.paddle1.draw(this.maptest)

      this.particles.forEach((particle : Particle, index : number) => {
        particle.update(this.maptest)
        if (particle.ttl == 0){
          this.particles.splice(index, 1)
        }
      });
    })

    socket_game.on('paddle0Info', (info) => {
      this.paddle0.x = info['paddle0_info'][0]
      this.paddle0.y = info['paddle0_info'][1]
      this.paddle0.width = info['paddle0_info'][2]
      this.paddle0.height = info['paddle0_info'][3]
    })

    socket_game.on('paddle1Info', (info) => {
      this.paddle1.x = info['paddle1_info'][0]
      this.paddle1.y = info['paddle1_info'][1]
      this.paddle1.width = info['paddle1_info'][2]
      this.paddle1.height = info['paddle1_info'][3]
    })

    socket_game.on('score_p0', (info) => {
      this.score_p0++
    })

    socket_game.on('score_p1', (info) => {
      this.score_p1++
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
  width: 100%;
  height: 80%;
  border: 1px solid white;
}
</style>