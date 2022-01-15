<template>
<v-container>
	<div justify="center" align="center" style="padding-top: 20px">
		<v-card-text class="color_text text-h5 font-weight-medium">
      🏆 Leaderboard 🏆
    </v-card-text>

    <div v-for="user in leaderboard" :key="user.id"
      style="padding-top:10px"
      v-on:bind="leaderboard"
    >
      <v-card
        class="foreground_element card_profile"
        height="60"
      >
        <v-row align="center"  style="padding-left: 20px; padding-top: 7px">
          <LeaderboardRank :rank="user.rank" :absolute="false"/>
          <ProfilePicture @click="goToProfile(user)" :src="user.picture" :isActive="user.isActive" />
          <v-card-title @click="goToProfile(user)" class="color_text text-h5 font-weight-medium" align="center">{{user.nickName}}</v-card-title>
          <v-spacer />
          <v-card-subtitle class="white--text text-left pr-10 font-italic">
            <span class=" font-weight-regular" style="color: #b8a435">W: {{ user.gameWin }} /</span>
            <span style="color: #c7401e">L: {{ user.gameLose }}</span>
          </v-card-subtitle>
        </v-row>
      </v-card>
    </div>
	</div>
</v-container>
</template>

<script lang='ts'>

import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'
import { LightUser } from '../assets/Classes-ts/User'

import socket_active from '../plugins/active.io'

@Component({})
export default class extends Vue {

  leaderboard: Array<LightUser> = new Array<LightUser>()

  async mounted() {
    this.leaderboard = await this.$axios.$get('/api/leaderboard')

    socket_active.on("active", (user: LightUser) => {
      var find = this.leaderboard.findIndex((el) => el.id == user.id)
      if (find != -1)
        this.leaderboard[find].isActive = true
    })
    socket_active.on("inactive", (user: LightUser) => {
      var find = this.leaderboard.findIndex((el) => el.id == user.id)
      if (find != -1)
        this.leaderboard[find].isActive = false
    })
  }

  goToProfile(user: any)
  {
    this.$router.push('/users/' + user.nickName)
  }
}

</script>

<style scoped>
@import '../assets/Classes-scss/neon_effects.scss';
@import '../assets/Classes-scss/main_page.scss';
.card_profile {
  border: 3px solid #a5fafa !important;
	box-shadow: inset 0px 0px 20px 0px #0affff, 0px 0px 20px 0px #0affff !important;
  /* box-shadow: 0px 0px 40px 0px #0affff !important; */
  border-radius: 15px !important;
  background-color: #181818 !important;
  /* height: 60px; */
  /* width: 100%; */
}

.color_text { 
  color: #ffffff;
}

.friend-button {
  border: 3px solid #e9c8ff !important;
  box-shadow: 0px 0px 15px 3px #9141c7 !important;
}
</style>
