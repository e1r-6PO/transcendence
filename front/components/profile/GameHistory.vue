<template>
  <div>
    <v-card-text class="color_text text-h5 font-weight-medium" style="font-family: OrbitronM !important">
      Game history
    </v-card-text>
    <div class="d-flex flex-column align-center">
      <v-card
        v-for="match in matchHistory" :key="match.id"
        v-on:bind="matchHistory"
        class="mt-5 foreground_element"
        :class="isProfileWinner(match) ? 'card_gameWin' : 'card_gameLose'"
        @click="goToGame(match)"
        width="550"
        height="60"
      >
        <v-row align="center flex-nowrap" style="padding-left: 20px; padding-top: 7px">
          <ProfilePicture @click="goToProfile(getOpenent(match))" :src="getOpenent(match).picture" :isActive="getOpenent(match).isActive" />
          <v-card-text @click="goToProfile(getOpenent(match))" class="color_text text-h5 font-weight-medium" align="center" style="font-family: OrbitronM !important; font-size: 120% !important">{{getOpenent(match).nickName}}</v-card-text>
          <v-card-text class="white--text text-center pr-10 font-italic d-flex flex-row" style="padding-right: 50px; font-family: OrbitronM !important"> {{ thistimeSince(match.date) }} ago</v-card-text>
          <v-card-text class="white--text text-center pr-10 font-italic d-flex flex-row" style="color: #ffffff; font-family: OrbitronM !important">{{ getSelfScore(match) }} - {{ getOpenentScore(match) }}</v-card-text>
        </v-row>
      </v-card>
    </div>
    <div
      style="padding-top:10px"
    >
      <v-btn
        class="foreground_element neon-button"
        style="margin-top: 0px; margin-left: 15px; font-family: OrbitronM !important"
        rounded
        text
        color="#ffffff"
        @click="fetchMoreGames()"
        v-if="fetchBtnEnable"
      >
        fetch more
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'nuxt-property-decorator';
import Vue from 'vue'
import { Match } from '../../assets/Classes-ts/Match';
import { LightUser, User } from '../../assets/Classes-ts/User';
import timeSince from '../../plugins/timeSince'

@Component
export default class GameHistory extends Vue {

	@Prop({ type: Object, default: new User() })
	user!: User

  matchHistory: Array<Match> = new Array

  fetchBtnEnable: boolean = true

  async mounted() {
    this.matchHistory = await this.$axios.$get('/api/users/' + this.user.id + '/matchs')
  }

  async fetchMoreGames() {
    var ret: Array<Match> = await this.$axios.$get('/api/users/' + this.user.id + '/matchs?page=' + this.matchHistory.length)
    this.matchHistory = this.matchHistory.concat(ret)

    if (ret.length == 0)
      this.fetchBtnEnable = false
  }

  goToGame(match: Match) {
    this.$router.push('/game/' + match.id)
  }

  goToProfile(user: LightUser) {
    this.$router.push('/users/' + user.nickName)
  }

  getSelf(match: Match) {
    if (match.player0.id == this.user.id)
      return match.player0
    return match.player1
  }

  getOpenent(match: Match) {
    if (match.player0.id == this.user.id)
      return match.player1
    return match.player0
  }

  getSelfScore(match: Match) {
    if (match.player0.id == this.user.id)
      return match.scorep0
    return match.scorep1
  }

  getOpenentScore(match: Match) {
    if (match.player0.id == this.user.id)
      return match.scorep1
    return match.scorep0
  }

  isProfileWinner(match: Match) {
    if (match.winner.id == this.user.id)
      return true
    return false
  }

  thistimeSince(date:string ) {
    return timeSince(new Date(date))
  }
}

</script>

<style scoped lang="scss">
@import '../../assets/Classes-scss/main_page.scss';
@import '../../assets/Classes-scss/custom_flexBox.scss';

.profile-picture {
	border-radius:100% !important;
	border: 3px solid #a5fafa !important;
	box-shadow: 0px 0px 15px 0px #63f3f3 !important;
}

.edit-button {
	border: 3px solid #e9c8ff !important;
	box-shadow: 0px 0px 10px 0px #9141c7 !important;
}

.card_profile {
	border: 3px solid #a5fafa !important;
	box-shadow: inset 0px 0px 500px 20px #0affff, 0px 0px 40px 0px #0affff !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	min-width: 400px;
	height: 250px;
	width: 30%;
}

.card_gameWin {
	border: 3px solid #f7e687 !important;
	box-shadow: inset 0px 0px 500px 20px #b8a435, 0px 0px 40px 5px #b8a435 !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	min-width: 400px;
	height: 250px;
	width: 30%;
}

.card_gameLose {
	border: 3px solid #ff997d !important;
	box-shadow: inset 0px 0px 500px 20px #c7401e, 0px 0px 40px 5px #c7401e !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	min-width: 400px;
	height: 250px;
	width: 30%;
}

.color_text { 
	z-index: 6;
	color: #ffffff;
}

.rank-card {
	border: 3px solid #fff7c8 !important;
	box-shadow: 0px 0px 10px 0px #ffdc17 !important;
}

.card_game {
	border: 3px solid #a5fafa !important;
	box-shadow: inset 0px 0px 110px 0px #0affff, 0px 0px 40px 0px #0affff !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	min-width: 260px;
	width: 275px;
}

.color_lose {
	z-index: 6;
	color: #c7401e;
}

.color_win {
	z-index: 6;
	color: #b8a435; 
}

</style>