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
        align="left"
        justify="center"
      >
        <v-row align="center" justify="start" style="padding-left: 20px; padding-top: 7px">
          <LeaderboardRank :rank="user.rank" :absolute="false"/>
          <ProfilePicture @click="goToProfile(user)" :src="user.picture" :isActive="user.isActive" />
          <v-card-title @click="goToProfile(user)" class="color_text text-h5 font-weight-medium" align="center">{{user.nickName}}</v-card-title>
          <v-card-text class="color_text text-h5 font-weight-medium text-right">W: {{ user.gameWin }} L: {{ user.gameLose }}</v-card-text>
          <!-- <BasicBtn
            style="position: absolute; bottom: -20px; right: 13px"
            @click="edit_friend(relationship, false)"
            :width="40"
            :content="getStatusIcon(relationship)"
            color="black"
            backgroundColor="#18124be0"
          /> -->
        </v-row>
      </v-card>
    </div>
	</div>
</v-container>
</template>

<script lang='ts'>

import Vue from 'vue'
import { LightUser } from '../assets/Classes-ts/User'

export default Vue.extend({

  data() {
    return {
      leaderboard: [LightUser],
    }
  },

  async mounted() {
    this.leaderboard = await this.$axios.$get('/api/leaderboard')
  },

  methods: {
    goToProfile(user: any)
    {
      this.$router.push('/users/' + user.nickName)
    },
  },
})

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
  height: 60px;
  width: 100%;
}

.color_text { 
  color: #ffffff;
}

.friend-button {
  border: 3px solid #e9c8ff !important;
  box-shadow: 0px 0px 15px 3px #9141c7 !important;
}
</style>
