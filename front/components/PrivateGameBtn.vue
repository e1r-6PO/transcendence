<template>
  <div>
    <v-dialog
      v-model="dialogPrivateGameSetup"
      max-width="600px"
      content-class="custom-dialog-card-shadow"
    >
      <template v-slot:activator="{}">
        <v-row align="center" justify="center" style="margin-top: 20px; margin-bottom: 20px">
          <v-btn
            class="foreground_element neon-button"
            style="margin-top: 0px; margin-left: 15px"
            rounded
            text
            color="#ffffff"
            @click="dialogPrivateGameSetup = true"
          >
            Play
          </v-btn>
        </v-row>
      </template>
      <v-card class="dialog_card">
        <v-card-title class="white--text justify-center">
          <span class="text-h5">Configure game</span>
          <v-spacer />
          <BasicBtn @click="dialogPrivateGameSetup = false" content="mdi-close" neonColor="red" />
        </v-card-title>

        <v-card-text class="pt-4 pb-6 pl-8 pr-8">
          <v-card-title class="white--text justify-left" style="padding-left: 0px; padding-bottom: 0px">
            Ball number:
          </v-card-title>
          <v-slider :min="1" :max="9" color="#0affff" track-color="#f27719" ticks="always" :tick-labels="tickLabel" dark v-model="ballNumber"></v-slider>
          <v-card-title class="white--text justify-left" style="padding-left: 0px; padding-bottom: 0px">
            Points to win:
          </v-card-title>
          <v-slider :min="1" :max="50" color="#0affff" track-color="#f27719" thumb-color="#0aadad" :thumb-label="true" v-model="pointsToWin"></v-slider>
          <v-card-title class="white--text justify-left" style="padding-left: 0px; padding-bottom: 0px">
            Paddle size:
          </v-card-title>
          <v-slider :min="1" :max="15" color="#0affff" track-color="#f27719" ticks="always" :tick-labels="tickLabel" dark v-model="paddleSize"></v-slider>

        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <BasicBtn @click="initiatePongRequest()" :isText="true" content="invite" color="#ffffff" :disable="false" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator';
import Vue from 'vue'
import { LightUser } from '../assets/Classes-ts/User';
import socket_game from '../plugins/game.io'

@Component
export default class PrivateGameBtn extends Vue{

  @Prop({ type: Object })
  user!: Object

  tickLabel = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]
  ballNumber: number = 1
  pointsToWin: number = 5
  paddleSize: number = 4

  dialogPrivateGameSetup: boolean = false

  initiatePongRequest() {
    if (socket_game.connected == false)
      socket_game.connect()
    socket_game.emit('newPrivate', {user: this.user, ballNumber: this.ballNumber, pointsToWin: this.pointsToWin, paddleSize: this.paddleSize})
    this.dialogPrivateGameSetup = false
  }
}
</script>

<style>
@import '../assets/Classes-scss/main_page.scss';
@import '../assets/Classes-scss/neon_effects.scss';

</style>