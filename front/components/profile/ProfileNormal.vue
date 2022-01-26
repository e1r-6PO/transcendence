<template>
	<div justify="center" align="center" class="mt-n10">
		<LeaderboardRank @click="gotoleaderboard" :rank="'RANK ' + rank" style="left: 50px; top: 110px; width: 250px; height: 50px; text-align: center"/>
		<LeaderboardRank @click="gotoleaderboard" :rank="'RATING: ' + user.elo" style="left: 50px; top: 120px; width: 250px; height: 50px; text-align: center"/>
		<v-avatar class="overflow-visible" style="right: 100px" size="128">
			<ProfilePicture :src="user.picture" disable neonColor="light-blue" :size="140" />
			<v-btn
				color="#8124be"
				class="edit-button"
				fab
				small
				@click="switchEditing()"
				style="z-index: 6"
				absolute
				bottom
				right
			>
				<v-icon color="#ffffff">
					mdi-pencil
				</v-icon>
			</v-btn>
		</v-avatar>

		<v-card class="foreground_element card_profile-purple mt-10">
			<v-card-text align="center">
				<p class="color_text text-h4 font-weight-medium" align="center" style="font-family: OrbitronM !important">{{ user.nickName }}</p>
				<p class="color_text text-h5" align="center" style="font-family: OrbitronM !important">{{ user.email }}</p>
				<p class="color_text text-h6 mb-4" align="center" style="font-family: OrbitronM !important">Connected via :</p>
				<icon-github v-if="user.provider === 'github'"
					width="50"
					height="50"
					class="pb-5"
				/>
				<icon-42 v-if="user.provider === '42'"
					width="50"
					height="50"
				/>
				<icon-google v-if="user.provider === 'google'"
					color="black"
					width="50"
					height="50"
				/>
			</v-card-text>
		</v-card>
		<div class="flex-container-row mt-10" style="margin-bottom: 1%">
			<v-card class="foreground_element card_game-purple flex-item" margin-top="5%">
				<h1 class="color_win" align="center" style="font-family: OrbitronM !important">Win</h1>
				<h3 class="color_text" align="center" style="font-family: OrbitronM !important">{{ user.gameWin }} </h3>
			</v-card>
			<v-card class="foreground_element card_game-purple flex-item" margin-top="5%">
				<h1 class="color_lose" align="center" style="font-family: OrbitronM !important">Lose</h1>
				<h3 class="color_text" align="center" justify="center" style="font-family: OrbitronM !important"> {{ user.gameLose }} </h3>
			</v-card>
		</div>
  <v-row class="pt-4 d-flex flex-row">
    	<v-col xs="12" sm="12" md="6">
    		<GameHistory justify="center" align="center" :matchHistory="matchHistory" :user="user"/>
			</v-col>
    	<v-col xs="12" sm="12" md="6">
				<OwnAchievements v-if="user.id != 0"  align="center" :user="user" class=""/>
			</v-col>
		</v-row>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'nuxt-property-decorator';
import Vue from 'vue'
import { Match } from '../../assets/Classes-ts/Match';
import { LightUser, User } from '../../assets/Classes-ts/User';
import timeSince from '../../plugins/timeSince'

@Component
export default class ProfileNormal extends Vue {

  @Prop({ type: Array, default: Array })
  matchHistory!: Array<Match>

	@Prop({ type: Object, default: new User() })
	user!: User

	@Prop({ type: Boolean, default: false })
	pictureEdited!: boolean

	@Prop({ type: Number, default: false })
	rank!: number

	async mounted() {
		this.user.elo = parseFloat(parseFloat(this.user.elo as any).toFixed(0)) //truncate elo to 0
	}

	switchEditing() {
		this.$emit('updateState')
	}

	gotoleaderboard() {
		this.$router.push('/leaderboard')
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

.card_profile-light-blue {
	border: 3px solid #a5fafa !important;
	box-shadow: inset 0px 0px 150px 20px #0affff, 0px 0px 25px 0px #0affff !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	min-width: 400px;
	height: 250px;
	width: 33%;
}

.card_profile-purple {
	border: 3px solid #cd78ff !important;
	box-shadow: inset 0px 0px 150px 20px #a200ff, 0px 0px 25px 0px #a200ff !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	min-width: 400px;
	height: 250px;
	width: 33%;
}

.card_profile-yellow {
	border: 3px solid #f7e687 !important;
	box-shadow: inset 0px 0px 150px 20px #b8a435, 0px 0px 25px 0px #b8a435 !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	min-width: 400px;
	height: 250px;
	width: 33%;
}

.card_gameWin {
	border: 3px solid #f7e687 !important;
	box-shadow: inset 0px 0px 500px 20px #b8a435, 0px 0px 40px 0px #b8a435 !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	min-width: 400px;
	height: 250px;
	width: 30%;
}

.card_gameLose {
	border: 3px solid #c7401e !important;
	box-shadow: inset 0px 0px 500px 20px #c7401e, 0px 0px 40px 0px #c7401e !important;
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

.card_game {
	border: 3px solid #a5fafa !important;
	box-shadow: inset 0px 0px 110px 0px #0affff, 0px 0px 20px 2px #0affff !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	min-width: 260px;
	width: 275px;
}

.card_game-purple {
	border: 3px solid #cd78ff !important;
	box-shadow: inset 0px 0px 110px 0px #a200ff, 0px 0px 20px 2px #a200ff !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	min-width: 260px;
	width: 275px;
}

.card_game-yellow {
	border: 3px solid #f7e687 !important;
	box-shadow: inset 0px 0px 110px 0px #b8a435, 0px 0px 20px 2px #b8a435 !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	min-width: 260px;
	width: 275px;
}

.color_lose {
	z-index: 6;
	color: #c7401e;
	// color: #fc6500;
	// color: #0affff;
}

.color_win {
	z-index: 6;
	// color: #b8a435; 
	color: #0affff;
}

</style>