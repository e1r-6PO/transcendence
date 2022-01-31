<template>
  <div>
    <v-dialog
      v-model="endDialog"
      max-width="600px"
      content-class="custom-dialog-card-shadow"
    >
      <v-card class="dialog_card">
        <v-card-title class="white--text justify-center">
          <span class="text-h5 pb-3" style="font-family: OrbitronM !important">Game ended</span>
          <v-spacer />
          <BasicBtn @click="closeEndGameDialog()" content="mdi-close" neonColor="red" />
        </v-card-title>

        <v-card-text class="pt-4 pb-6 pl-8 pr-8">
          <v-row justify="center">
            <p class="text-h5 pl-3 pb-5 neonText-gold" style="font-family: OrbitronM !important" color="goldenrod"> WINNER </p>
          </v-row>
          <v-row justify="center">
            <ProfilePicture @click="redirectToUserProfile(winner.nickName)" :src="winner.picture" :neonColor="winner.paddleColor" size="100" />
          </v-row>
          <v-row justify="center">
            <p class="text-h5 pt-10 pl-3 neonText-silver" style="font-family: OrbitronM !important">{{winner.nickName}}</p>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <BasicBtn @click="goToPage()" :isText="true" content="LEAVE" color="#ffffff" :disable="false" />
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
export default class EndGameDialog extends Vue{

  @Prop({ type: String })
  next!: string

  @Prop({ type: Object })
  winner!: LightUser

  @Prop({ type: Boolean })
  endDialog!: boolean

  dialogEndgame: boolean = false

  goToPage() {
    this.$router.push(this.next)
  }

  closeEndGameDialog() {
    this.$emit('closeEndGameDialog')
  }

  redirectToUserProfile(playerNick: string) {
    this.$router.push("/users/" + playerNick)
  }
}
</script>

<style>
@import '../assets/Classes-scss/main_page.scss';
@import '../assets/Classes-scss/neon_effects.scss';

</style>