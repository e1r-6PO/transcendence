<template>
<v-container fluid>
  <div justify="center" align="center" style="padding-top: 0%">
    <LeaderboardRank @click="gotoleaderboard" :rank="'RANK ' + rank" style="left: 50px; top: 110px; width: 250px; height: 50px; text-align: center"/>
    <LeaderboardRank @click="gotoleaderboard" :rank="'RATING: ' + user.elo" style="left: 50px; top: 120px; width: 250px; height: 50px; text-align: center"/>
    <v-avatar class="overflow-visible" style="right: 100px" size="128">
      <ProfilePicture :src="user.picture" disable neonColor="light-blue" :size="130" />
      <v-btn v-if="self.id != user.id"
        color="#8124be"
        class="friend-button"
        fab
        small
        @click="mouseOverFriendOption = !mouseOverFriendOption"
        style="z-index: 6"
        absolute
        bottom
        right
      >
        <v-icon :color="getIconStatus() == 'mdi-account-cancel' ? 'black' : getIconStatus() == 'mdi-account-check' ? 'green' : 'yellow'">            
          {{ getIconStatus() }}
        </v-icon>
      </v-btn>
      <div v-if="mouseOverFriendOption == true"
        @mouseleave="mouseLeaveFriendOption()"
        style="z-index: 7; position: absolute; right: -56px; top: 108px; flex-direction: column; width: 80px"
        color="#ffffff"
        flat
      >
        <v-btn v-if="friendStatus == status.null || friendStatus == status.completed"
          @click="friendStatus == status.null ? addFriend() : deleteFriend()"
          class="friend-button"
          color="#8124be"
          height="40"
        >
          <v-icon :color="friendStatus == status.null ? 'green' : 'red'">
            {{ friendStatus == status.null ? 'mdi-account-plus' : 'mdi-account-minus'}}
          </v-icon>
        </v-btn>
        <v-btn v-if="friendStatus == status.incomming"
          color="#8124be"
          class="friend-button"
          @click="acceptFriendRequest()"
          height="40"
        >
          <v-icon color="green">
            mdi-account-check
          </v-icon>
        </v-btn>
        <v-btn v-if="friendStatus == status.incomming || friendStatus == status.sent"
          color="#8124be"
          class="friend-button"
          @click="denyFriendRequest()"
          height="40"
        >
          <v-icon color="red">
              mdi-account-remove
          </v-icon>
        </v-btn>
        <v-btn
          color="#8124be"
          @click="friendStatus != status.blocked ? blockUser() : unblockUser()"
          class="friend-button"
          height="40"
        >
          <v-icon :color="friendStatus != status.blocked ? 'black' : 'green'">
            {{ friendStatus != status.blocked ? 'mdi-account-cancel' : 'mdi-lock-open-variant' }}
          </v-icon>
        </v-btn>
      </div>
    </v-avatar>
    <v-row v-if="self.id != user.id" justify="center" class="mt-10">
      <BasicBtn @click="redirectToPrivateMessage()" style="font-family: OrbitronM !important; font-size: 80% !important" :isText="true" content="Send Message" />
      <BasicBtn v-if="user.currentGame != ''" @click="watchGame()" :isText="true" content="Watch live game" style="margin-left: 50px" neonColor="red" />
    </v-row>
  </div>
  <div class="flex-container-editing" style="padding-top: 50px">
    <v-card class="foreground_element card_profile-purple">
      <v-card-text align="center">
				<p class="color_text text-h4 font-weight-medium" align="center" style="font-family: OrbitronM !important">{{ user.nickName }}</p>
      </v-card-text>
    </v-card>
  </div>
  <v-row class="d-flex justify-space-around flex-row">
    <v-card class="foreground_element card_game-purple flex-item" margin-top="5%">
      <h1 class="color_win" align="center" style="font-family: OrbitronM !important">Win</h1>
			<h3 class="color_text" align="center" style="font-family: OrbitronM !important">{{ user.gameWin }} </h3>
    </v-card>
    <v-card class="foreground_element card_game-purple flex-item" margin-top="5%">
			<h1 class="color_lose" align="center" style="font-family: OrbitronM !important">Lose</h1>
			<h3 class="color_text" align="center" justify="center" style="font-family: OrbitronM !important"> {{ user.gameLose }} </h3>
    </v-card>
  </v-row>
  <v-row class="pt-4 d-flex flex-row justify-center">
    <v-col xs="12" sm="12" md="6">
      <GameHistory justify="center" align="center" :matchHistory="matchHistory" :user="user" v-if="user.id != 0"/>
    </v-col>
    <v-col xs="12" sm="12" md="6">
		  <OwnAchievements v-if="user.id != 0" align="center" :user="user" completedOnly />
    </v-col>
  </v-row>
</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import login from '../../middleware/login'
import { User, LightUser } from '../../assets/Classes-ts/User';
import socket_active from '../../plugins/active.io';
import copyLightUser from '../../plugins/copyUser'

const All_Friend_Status = {
  null: "null",
  completed: "completed",
  sent: "sent",
  incomming: "incomming",
  blocked: "blocked",
}

export default Vue.extend({
    
  middleware: login,

  head() {
    return {
      title: this.$route.params.slug
    }
  },
  
  data() {

    return {
      status: All_Friend_Status,
      user : new LightUser(),
      friendStatus : All_Friend_Status.null,
      self : new User,
      mouseOverButton : false,
      mouseOverFriendOption : false,
      rank : 0,
      matchHistory : Array,
    }
  },

  async mounted() {
    const { params: { slug } } = this.$route

    this.self = await this.$axios.$get('/api/profile/me')
    this.user = await this.$axios.$get('/api/users/' + slug)
    this.rank = await this.$axios.$get('/api/leaderboard/' + this.user.id)
    this.friendStatus = (await this.$axios.$get('/api/friends/' + this.user.id)).status
    this.matchHistory = await this.$axios.$get('/api/users/' + this.user.id + '/matchs')

    this.user.elo = parseFloat(parseFloat(this.user.elo as any).toFixed(0)) // truncate the elo to 0 digit

    socket_active.on('stateChanged', (user: LightUser) => {
      if (user.id == this.user.id)
        copyLightUser(this.user, user)
    })
  },

  methods: {

  async watchGame() {
    this.$router.push('/game/' + this.user.currentGame)
  },

  async friend() {
    if (this.friendStatus == this.status.null)
      await this.$axios.$post('/api/friends/' + this.user.id)
    else if (this.friendStatus == this.status.completed)
      await this.$axios.$delete('/api/friends/' + this.user.id)
    else if (this.friendStatus == this.status.sent)
      await this.$axios.$delete('/api/friends/' + this.user.id)
    else if (this.friendStatus == this.status.incomming)
      await this.$axios.$patch('/api/friends/' + this.user.id + '/accept')
    else if (this.friendStatus == this.status.blocked)
      await this.$axios.$post('/api/friends/' + this.user.id + '/unblock')
    this.friendStatus = (await this.$axios.$get('/api/friends/' + this.user.id)).status
  },

  async addFriend() {
    await this.$axios.$post('/api/friends/' + this.user.id)
    this.friendStatus = this.status.sent
    this.mouseOverFriendOption = false
  },

  async deleteFriend() {
    await this.$axios.$delete('/api/friends/' + this.user.id)
    this.friendStatus = this.status.null
      this.mouseOverFriendOption = false
  },

  async acceptFriendRequest() {
    await this.$axios.$patch('/api/friends/' + this.user.id + '/accept')
    this.friendStatus = this.status.completed
    this.mouseOverFriendOption = false
  },

  async denyFriendRequest() {
    await this.$axios.$delete('/api/friends/' + this.user.id)
    this.friendStatus = this.status.null
    this.mouseOverFriendOption = false
  },

  async blockUser() {
    await this.$axios.$post('/api/friends/' + this.user.id + '/block')
    this.friendStatus = this.status.blocked
    this.mouseOverFriendOption = false
  },

  async unblockUser() {
    await this.$axios.$post('/api/friends/' + this.user.id + '/unblock')
    this.friendStatus = this.status.null
    this.mouseOverFriendOption = false
  },

	gotoleaderboard() {
		this.$router.push('/leaderboard')
	},

  async mouseLeaveFriendOption() {
      this.mouseOverFriendOption = false
  },

    async mouseLeaveButton() {
    await new Promise(d => setTimeout(d, 300));
      this.mouseOverButton = false
  },

  redirectToPrivateMessage() {
    this.$router.push('/privateMessage/' + this.user.nickName)
  },

  getIconStatus(): string {
    if (this.friendStatus == this.status.blocked)
      return 'mdi-account-cancel'
    if (this.friendStatus == this.status.completed)
      return 'mdi-account-check'
    if (this.friendStatus == this.status.sent)
      return 'mdi-account-clock'
    return 'mdi-account-question'
  },
  }

})
</script>

<style scoped>
@import '../../assets/Classes-scss/main_page.scss';
@import '../../assets/Classes-scss/custom_flexBox.scss';

.friend-button {
  border: 3px solid #d5a5f5 !important;
  box-shadow: 0px 0px 15px 3px #9141c7 !important;
}

.profile-picture {
  border: 3px solid #a5fafa !important;
  box-shadow: 0px 0px 15px 0px #63f3f3 !important;
}

.text-field_style input {
  color: #7DFDFE !important; /* blue tron color */
}

.color_lose {
  z-index: 6;
  color: #c7401e;
}

.color_win {
  z-index: 6;
  /* color: #b8a435; */
  color: #0affff;
}

.color_text { 
  z-index: 6;
  color: #ffffff;
}

.rank-card {
	border: 3px solid #fff7c8 !important;
	box-shadow: 0px 0px 10px 0px #ffdc17 !important;
}

.round_card {
  border-radius:100%!important;
}

.btn_camera {
  border-radius: 100%!important;
  box-shadow: 0px 0px 20px 0px rgba(31, 31, 50, 0.89);
  color: #38393b;
  min-width: 200px;
  width: 200px;
  min-height: 200px;
  height: 200px;
}

.card_game {
  border: 3px solid #a5fafa !important;
  box-shadow: inset 0px 0px 110px 0px #0affff, 0px 0px 40px 0px #0affff !important;
  border-radius: 15px !important;
  background-color: #181818 !important;
  min-width: 260px;
  width: 275px;
}

.card_game-purple {
  border: 3px solid #cd78ff !important;
  box-shadow: inset 0px 0px 80px 0px #a200ff, 0px 0px 40px 0px #a200ff !important;
  border-radius: 15px !important;
  background-color: #181818 !important;
  min-width: 260px;
  width: 275px;
}

.card_profile {
  border: 3px solid #a5fafa !important;
  box-shadow: inset 0px 0px 100px 10px #0affff, 0px 0px 40px 0px #0affff !important;
  border-radius: 15px !important;
  background-color: #181818 !important;
  height: 80px;
  width: 550px;
}

.card_profile-purple {
  border: 3px solid #cd78ff !important;
  box-shadow: inset 0px 0px 65px 10px #a200ff, 0px 0px 40px 0px #a200ff !important;
  border-radius: 15px !important;
  background-color: #181818 !important;
  height: 80px;
  width: 550px;
}


.editing_card {
  height: 10%;
  width: 25% !important;
  min-width: 20%;
  border-radius: 15px !important;
  box-shadow: 0px 0px 20px 0px rgba(224, 185, 10, 0.89) !important;
  background-color: #f27719 !important;
}

.item {
  align-self: flex-end;
}

.flex-item {
  margin-top: 5%;
  color: white;
  font-weight: bold;
  text-align: center;
}

.cross-item {
  margin-left: 90%;
  margin-bottom: 2%;
  border: 3px solid #cd78ff !important;
  box-shadow: 0px 0px 25px 0px #a200ff !important;
}

.save-item {
  margin-left: 90%;
}

.v-input--reverse .v-input__slot {
  flex-direction: row-reverse;
  justify-content: flex-end;
  margin-right: 2px;
}

</style>
