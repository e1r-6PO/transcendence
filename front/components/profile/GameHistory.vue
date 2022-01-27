<template>
  <v-card color="rgb(24, 24, 24, 0)" height="558" flat>
    <v-card-text class="white--text text-h5 font-weight-medium" style="font-family: OrbitronM !important">
      Game history
    </v-card-text>
    <div class="d-flex flex-column align-center">
      <span v-if="totalMatch == 0" class="white--text pt-6" style="font-size: 230%; font-family: OrbitronM">No game found</span>
      <v-card
        v-for="match in matchHistory" :key="match.id"
        v-on:bind="matchHistory"
        class="mt-6 foreground_element"
        :class="isProfileWinner(match) ? 'card_gameWin-light-blue' : 'card_gameLose'"
        @click="goToGame(match)"
        width="550"
        height="62"
      >
        <div align="center" class="flex-nowrap row" style="padding-left: 20px">
          <ProfilePicture style="margin-top: 20px" align="center" @click="goToProfile(getOpenent(match))" :src="getOpenent(match).picture" :isActive="getOpenent(match).isActive" />
          <v-card-text @click="goToProfile(getOpenent(match))" class="white--text text-h5 font-weight-medium pt-7" style="font-family: OrbitronM !important; font-size: 120% !important">{{getOpenent(match).nickName}}</v-card-text>
          <v-card-text class="white--text font-italic pt-8" style="font-family: OrbitronM !important"> {{ thistimeSince(match.date) }} ago</v-card-text>
          <v-card-text class="white--text pr-10 font-italic pt-8" style="color: #ffffff; font-family: OrbitronM !important">{{ getSelfScore(match) }} - {{ getOpenentScore(match) }}</v-card-text>
        </div>
      </v-card>
    </div>
    <div v-if="totalMatch != 0" class="custom-position-bottom-center d-flex flex-row mb-2 justify-center">
      <BasicBtn @click="previousPage()" content="mdi-arrow-left" :disable="page <= 1" class="mr-1 mt-1" />
       <span class="mr-1 ml-1 neonText-purple" style="font-size: 180%">{{ page }} </span>
      <BasicBtn @click="nextPage()" content="mdi-arrow-right" :disable="page >= totalPage" class="ml-1 mt-1" />
      <!-- <span v-if="matchHistory.length == 0" class="white--text text-h7" style="font-family: OrbitronM">No achievements started or succeed</span> -->
    </div>
  </v-card>
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
  totalPage: number = 1

  async mounted() {
    this.matchHistory = await this.$axios.$get('/api/users/' + this.user.id + '/matchs?offset=0&count=5')
    this.totalMatch = await this.$axios.$get('/api/users/' + this.user.id + '/matchs')
    if (this.matchHistory.length == 0)
      this.fetchBtnEnable = false
    this.totalPage = Math.ceil((this.user.gameLose + this.user.gameWin) / 5)
  }

  async fetchMoreGames() {
    var ret: Array<Match> = await this.$axios.$get('/api/users/' + this.user.id + '/matchs?offset=' + (this.page - 1) * 5 + '&count=5')
    this.matchHistory = ret

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

  nextPage() {
    this.page = this.page < this.totalPage ? this.page + 1 : this.page;
    this.fetchMoreGames()
  }

  previousPage() {
    this.page = this.page > 1 ? this.page - 1 : this.page;
    this.fetchMoreGames()
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/Classes-scss/main_page.scss';
@import '../../assets/Classes-scss/custom_flexBox.scss';
@import '../../assets/Classes-scss/neonText_colors.scss';

.card_gameWin-light-blue {
	border: 3px solid #a5fafa !important;
	box-shadow: inset 0px 0px 60px 15px #0affff, 0px 0px 30px 1px #0affff !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	// min-width: 400px;
	// height: 250px;
	// width: 30%;
}

.card_gameWin {
	border: 3px solid #f7e687 !important;
	box-shadow: inset 0px 0px 60px 10px #FFC42E, 0px 0px 30px 1px #FFC42E !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	// min-width: 400px;
	// height: 250px;
	// width: 30%;
}

.card_gameLose {
	border: 3px solid #ff997d !important;
	box-shadow: inset 0px 0px 150px 20px #c7401e, 0px 0px 30px 1px #c7401e !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	// min-width: 400px;
	// height: 250px;
  // width: 30%;
  // max-width: 600px;
}

.custom-pagination {
  background-color: red !important;
}

.neon-page {
  border: 3px solid #cd78ff !important;
  box-shadow: inset 0px 0px 20px 3px #a200ff, 0px 0px 20px 3px #a200ff !important;
}
</style>