<template>
  <div>
    <v-card-text class="color_text text-h5 font-weight-medium" style="font-family: OrbitronM !important">
      Game history
    </v-card-text>
    <div class="d-flex flex-column align-center">
      <v-card
        v-for="match in matchHistory" :key="match.id"
        v-on:bind="matchHistory"
        class="mt-6 foreground_element"
        :class="isProfileWinner(match) ? 'card_gameWin' : 'card_gameLose'"
        @click="goToGame(match)"
        width="550"
        height="62"
      >
        <div align="center" class="flex-nowrap row" style="padding-left: 20px;">
          <ProfilePicture class="pt-10" align="center" @click="goToProfile(getOpenent(match))" :src="getOpenent(match).picture" :isActive="getOpenent(match).isActive" />
          <v-card-text @click="goToProfile(getOpenent(match))" class="color_text text-h5 font-weight-medium pt-7" style="font-family: OrbitronM !important; font-size: 120% !important">{{getOpenent(match).nickName}}</v-card-text>
          <v-card-text class="white--text font-italic pt-8" style="font-family: OrbitronM !important"> {{ thistimeSince(match.date) }} ago</v-card-text>
          <v-card-text class="white--text pr-10 font-italic pt-8" style="color: #ffffff; font-family: OrbitronM !important">{{ getSelfScore(match) }} - {{ getOpenentScore(match) }}</v-card-text>
        </div>
      </v-card>
    </div>
    <div>
      <v-pagination
        v-model="page"
        class="pt-5"
        :length="Math.ceil((user.gameWin + user.gameLose) / 5)"
        :total-visible="4"
        @input="fetchMoreGames()"
        circle
      ></v-pagination>
      <span v-if="matchHistory.length == 0" class="white--text text-h7" style="font-family: OrbitronM">No game played</span>
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
  totalMatch: Array<Match> = new Array

  fetchBtnEnable: boolean = true

  page: number = 1

  async mounted() {
    this.matchHistory = await this.$axios.$get('/api/users/' + this.user.id + '/matchs?offset=0&count=5')
    this.totalMatch = await this.$axios.$get('/api/users/' + this.user.id + '/matchs')
    if (this.matchHistory.length == 0)
      this.fetchBtnEnable = false
    console.log(this.matchHistory)
  }

  async fetchMoreGames() {
    var ret: Array<Match> = await this.$axios.$get('/api/users/' + this.user.id + '/matchs?offset=' + (this.page - 1) * 5 + '&count=5')
    // this.matchHistory = this.matchHistory.concat(ret)
    console.log("ret")
    this.matchHistory = ret
    console.log(this.matchHistory)
    console.log(this.totalMatch)

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

.card_gameWin {
	border: 3px solid #f7e687 !important;
	box-shadow: inset 0px 0px 500px 20px #b8a435, 0px 0px 40px 5px #b8a435 !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	// min-width: 400px;
	// height: 250px;
	// width: 30%;
}

.card_gameLose {
	border: 3px solid #ff997d !important;
	box-shadow: inset 0px 0px 500px 20px #c7401e, 0px 0px 40px 5px #c7401e !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	// min-width: 400px;
	// height: 250px;
  // width: 30%;
  // max-width: 600px;
}

.color_text { 
	z-index: 6;
	color: #ffffff;
}

</style>