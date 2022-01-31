<template>
<div>
  <v-row justify="center">
    <v-col cols="3" class="d-flex flex-column justify-center align-center" style="padding-top: 100px">
      <p v-if="matchStatus == 'finished' && winner.nickName == player0.nickName" class="text-h5 pl-3 pb-5 neonText-gold" style="font-family: OrbitronM !important" color="goldenrod"> WINNER </p>
      <p v-else-if="matchStatus == 'finished'" class="text-h5 pl-3 pb-5 neonText-red" style="font-family: OrbitronM !important" color="red"> LOSER </p>
      <ProfilePicture :disable="matchStatus != 'finished'" @click="redirectToUserProfile(player0.nickName)" :src="player0.picture" :neonColor="player0.paddleColor" size="100" />
      <p class="text-h5 pt-10 pl-3 neonText-silver" style="font-family: OrbitronM !important">{{player0.nickName}}</p>
      <p class="text-h5 pt-10 pl-3 neonText-silver" style="font-family: OrbitronM !important">{{ score_p0 }}</p>
    </v-col>

    <v-col cols="6">
      <div justify="center" align="center" class="pt-10 pb-10">
        <BasicBtn v-if="matchStatus == 'running' && (me.id == player0.id || me.id == player1.id)" content="forfeit" @click="forfeit" :isText="true" color="#ffffff" class="foreground_element"/>
        <BasicBtn v-else content="LEAVE" @click="redirectToNext" :isText="true" color="#ffffff" class="foreground_element"/>
      </div>
      <end-game-dialog :next="next" v-model="endDialog" @closeEndGameDialog="endDialog = false" :winner="winner" />
      <canvas id="map" width="840" height="600"></canvas>
    </v-col>

    <v-col cols="3" class="d-flex flex-column justify-center align-center" style="padding-top: 100px">
      <p v-if="matchStatus == 'finished' && winner.nickName == player1.nickName" class="text-h5 pl-3 pb-5 neonText-gold" style="font-family: OrbitronM !important"> WINNER </p>
      <p v-else-if="matchStatus == 'finished'" class="text-h5 pl-3 pb-5 neonText-red" style="font-family: OrbitronM !important" color="red"> LOSER </p>
      <ProfilePicture :disable="matchStatus != 'finished'" @click="redirectToUserProfile(player1.nickName)" :src="player1.picture" disble :neonColor="player1.paddleColor" size="100" />
      <p class="text-h5 pt-10 pl-3 neonText-silver" style="color: #ffffff; font-family: OrbitronM !important">{{player1.nickName}}</p>
      <p class="text-h5 pt-10 pl-3 neonText-silver" style="color: #ffffff; font-family: OrbitronM !important">{{ score_p1 }}</p>
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
import Render  from '../../assets/Classes-ts/Render'
import socket_game from '../../plugins/game.io'

export default Vue.extend({

  head() {
    return {
      title: 'Pong Game'
    }
  },

  data() {
    return {
      match_res: Match,
      matchStatus: "",
      alertText: "",
      alert: false,
      alertType: "error",
      game_id: this.$route.params.slug,
      me: new User(),
      player0: new LightUser(),
      player1: new LightUser(),
      winner: new LightUser(),
      looser: new LightUser(),
      mapx: 840,
      mapy: 600,
      balls: new Map<number, Ball>(),
      paddle0: Object(),
      paddle1: Object(),
      canvas : Object(),
      ctx : Object(),
      particles: [Object()],
      updatePage: false,
      score_p0: 0,
      score_p1: 0,
      keyUp: false,
      keyDown: false,
      next: (new URLSearchParams(window.location.search).get('next') != null ? new URLSearchParams(window.location.search).get('next') : '/home'),
      endDialog: false,
    }
  },

  async mounted() {
    this.$axios.$get('/api/profile/me').then((data: any) => this.me = data)
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
    this.canvas = document.getElementById("map")
    this.ctx = this.canvas.getContext("2d")
    this.particles = new Array
    
    socket_game.emit('join', { id: this.game_id })
    //Keydown listener
    window.addEventListener('keydown', (event) => {
      if (event.key == 'w' || event.key == 'W' || event.key == 'ArrowUp')
        this.keyUp = true
      else if (event.key == "s" || event.key == 'S' || event.key == 'ArrowDown')
        this.keyDown = true
    })

    //Keyup listener
    window.addEventListener('keyup', (event) => {
      if (event.key == 'w' || event.key == 'W' || event.key == 'ArrowUp')
        this.keyUp = false
      else if (event.key == "s" || event.key == 'S' || event.key == 'ArrowDown')
        this.keyDown = false
    })
  },

  methods: {
    forfeit() {
      socket_game.emit('forfeit', { id: this.game_id })
    },

    redirectToUserProfile(playerNick: string) {
      this.$router.push("/users/" + playerNick)
    },

    redirectToNext() {
      this.$router.push(this.next)
    },

    playStartSound(info: any) {
      if (this.isSoundEnabled) {
        // console.log(info.gameStart)
        switch (info.gameStart) {
          case 3: {
            this.$store.state.sounds.audio3.play()
            break
          }
          case 2: {
            this.$store.state.sounds.audio2.play()
            break
          }
          case 1: {
            this.$store.state.sounds.audio1.play()
            break
          }
          case 0: {
            this.$store.state.sounds.audioGO.play()
            break
          }
        }
      }
    },

    playEndSound() {
      if (this.isSoundEnabled) {
        if (this.me.id == this.winner.id) {
          this.$store.state.sounds.winnerSound.play()
        }
        else if (this.me.id == this.looser.id) {
          this.$store.state.sounds.loserSound.play()
        }
        else {
          this.$store.state.sounds.spectatorSound.play()
        }
      }
    },
  },

  async created() {
    socket_game.on('oldGame', async (info: null) => {
        this.matchStatus = 'finished'
        this.$axios.$get('/api/games/' + this.game_id).then((match_res: any) => {
        this.match_res = match_res
        this.score_p0 = match_res.scorep0
        this.score_p1 = match_res.scorep1
        this.player0 = match_res.player0
        this.player1 = match_res.player1
        this.winner = match_res.winner
        Render.drawGameEnded(this.ctx, this.mapx, this.mapy)
      })
    })

    socket_game.on('matchInfo', (info) => {
        this.player0 = info['player0']
        this.player1 = info['player1']
        this.paddle0 = new Paddle(this.player0.paddleColor)
        this.paddle1 = new Paddle(this.player1.paddleColor)
    })

    socket_game.on('matchEnd', (info) => {
        socket_game.off('matchInfo')
        socket_game.off('matchEnd')
        socket_game.off('matchSetup')
        socket_game.off('gameInfo')
        this.matchStatus = 'finished'
        this.winner = info.winner
        this.looser = info.looser
        this.endDialog = true
        this.playEndSound()
    })

    socket_game.on('matchSetup', (info) => {
      this.playStartSound(info)
      Render.drawCountdown(this.ctx, this.mapx, this.mapy, info, this.player0, this.player1)
    })

    socket_game.on('gameInfo', (info) => {
      Render.clear_canvas(this.ctx, this.mapx, this.mapy)
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
              if (info[i].ball_info[4] == 1 && this.$store.state.isSoundEnabled == true) {
                var tmp = this.$store.state.sounds.wallCollision.cloneNode()
                tmp.volume = this.$store.state.soundVolume / 10
                tmp.play()
              }
              if (info[i].ball_info[4] == 2 && this.$store.state.isSoundEnabled == true) {
                var tmp = this.$store.state.sounds.paddleCollision.cloneNode()
                tmp.volume = this.$store.state.soundVolume / 10
                tmp.play()
              }
              for(let i = 0; i < 10; i++)
              {
                let p_x = (c_ball.x > this.mapx - 50) ? c_ball.x + c_ball.width / 2 : c_ball.x
                let p_y = (c_ball.y > this.mapy - 50) ? c_ball.y + c_ball.height / 2 : c_ball.y
                this.particles.push(new Particle(p_x, p_y, 2, c_ball.color))
              }
            }
            c_ball.draw(this.ctx)
          }
        }
        else if (info[i].status == "erased"){
          this.balls.delete(info[i].id)
        }
      }
      //draw player left
      this.paddle0.draw(this.ctx)
      
      //draw player right
      this.paddle1.draw(this.ctx)

      this.particles.forEach((particle : Particle, index : number) => {
        particle.update(this.ctx)
        if (particle.ttl == 0){
          this.particles.splice(index, 1)
        }
      });
      if (this.keyUp == true)
        socket_game.emit('updatePaddle', { id: this.game_id, direction: 1 })
      else if (this.keyDown == true)
        socket_game.emit('updatePaddle', { id: this.game_id, direction: -1 })
      else if (this.keyDown == false && this.keyDown == false)
        socket_game.emit('updatePaddle', { id: this.game_id, direction: 0 })
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
      this.score_p0 = info
    })

    socket_game.on('score_p1', (info) => {
      this.score_p1 = info
    })
  },

  beforeRouteLeave (to, from , next) {
    socket_game.off('matchInfo')
    socket_game.off('matchEnd')
    socket_game.off('matchSetup')
    socket_game.off('gameInfo')
    socket_game.emit('leave')
    next()
  },

  computed: {
    isSoundEnabled() {
      return this.$store.state.isSoundEnabled;
    },
    isMusicEnabled() {
      return this.$store.state.isMusicEnabled;
    }
  }
})
</script>

<style scoped>
@import '../../assets/Classes-scss/main_page.scss';
@import '../../assets/Classes-scss/neonText_colors.scss';
#map {
  width: 100%;
  height: 80%;
  border: 1px solid white;
}
</style>