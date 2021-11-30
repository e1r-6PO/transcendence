<template>
<v-main>
  <div justify="center" align="center" style="padding-top: 3%">
    <v-avatar class="overflow-visible" size="128">
      <img v-if="user.picture != ''"
        class="round_card item profile-picture"
        :src=user.picture
      />
      <v-btn v-if="self.id != user.id"
        color="#8124be"
        class="friend-button"
        fab
        small
        @click="friend()"
        style="z-index: 6"
        absolute
        bottom
        right
      >
        <v-icon v-if="friendStatus == status.null" color="green">
          mdi-account-plus
        </v-icon>
        <v-icon v-if="friendStatus == status.completed" color="red">
          mdi-account-minus
        </v-icon>
        <v-icon v-if="friendStatus == status.sent" color="yellow">
          mdi-account-clock
        </v-icon>
        <v-icon v-if="friendStatus == status.incomming" color="yellow">
          mdi-account-arrow-down
        </v-icon>
        <v-icon v-if="friendStatus == status.blocked" color="red">
          mdi-account-cancel
        </v-icon>
      </v-btn>
    </v-avatar>
    </div>
    <div class="flex-container-editing" style="padding-top: 3%">
      <v-card class="foreground_element card_profile">
        <v-card-text align="center">
          <p class="color_text text-h4 font-weight-medium" align="center">{{ user.nickName }}</p>
        </v-card-text>
      </v-card>
    </div>
    <div class="flex-container">
      <v-card class="foreground_element card_game flex-item" margin-top="5%">
        <h1 class="color_win" align="center">Win</h1>
        <h3 class="color_text" align="center">{{ user.gameWin }} </h3>
      </v-card>
      <v-card class="foreground_element card_game flex-item" margin-top="5%">
        <h1 class="color_lose" align="center">Lose</h1>
        <h3 class="color_text" align="center" justify="center"> {{ user.gameLose }} </h3>
      </v-card>
  </div>
</v-main>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import login from '../../middleware/login'
import { User, LightUser } from '../../assets/User';

const All_Friend_Status = {
  null: "null",
  completed: "completed",
  sent: "sent",
  incomming: "incomming",
  blocked: "blocked",
}

@Component({
  middleware: login
})
export default class extends Vue {

  status = All_Friend_Status
  user : LightUser = new LightUser
  friendStatus : string = All_Friend_Status.null
  isFriend : boolean = false
  self : User = new User

  async mounted() {
    const { params: { slug } } = this.$route

    this.self = await this.$axios.$get('/api/profile/me')
    this.user = await this.$axios.$get('/api/users/' + slug)
    this.friendStatus = (await this.$axios.$get('/api/users/friend?id=' + this.user.id)).status
  }

  async friend() {
    this.isFriend = !this.isFriend

    await this.$axios.$post('/api/users/friend?id=' + this.user.id)
    this.friendStatus = (await this.$axios.$get('/api/users/friend?id=' + this.user.id)).status
  }

  $refs!: {
    uploader: HTMLFormElement
  }

}
</script>

<style scoped>
@import '../../assets/main_page.scss';

.friend-button {
  /* border: 3px solid #e9c8ff !important;
  box-shadow: 0px 0px 10px 0px #9141c7 !important; */
  border: 3px solid #e9c8ff !important;
  box-shadow: 0px 0px 15px 3px #9141c7 !important;
}

.profile-picture {
  border: 3px solid #a5fafa !important;
  /* border: 3px solid #e7b3ff !important; */
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
  color: #b8a435; 
}

.color_text { 
  z-index: 6;
  color: #ffffff;
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
  /* border-radius:17px!important; */
  box-shadow: inset 0px 0px 110px 0px #0affff, 0px 0px 40px 0px #0affff !important;
  border-radius: 15px !important;
  background-color: #181818 !important;
  min-width: 260px;
  width: 275px;
  /* box-shadow: 0px 0px 20px 0px rgba(58, 189, 182, 0.7) !important;  */
}

.card_profile {
  border: 3px solid #a5fafa !important;
  /* border: 3px solid #e7b3ff !important; */
  box-shadow: inset 0px 0px 100px 10px #0affff, 0px 0px 40px 0px #0affff !important;
  /* box-shadow: inset 0px 0px 1000px 0px #cb5cff, 0px 0px 40px 0px #cb5cff !important; */
  border-radius: 15px !important;
  background-color: #181818 !important;
  /* background-color: #35b4b2 !important; */
  /* box-shadow: 0px 0px 20px 0px rgba(58, 189, 182, 0.7) !important;  */
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

.flex-container {
  /* We first create a flex layout context */
  display: flex;
  
  /* Then we define the flow direction 
     and if we allow the items to wrap 
   * Remember this is the same as:
   * flex-direction: row;
   * flex-wrap: wrap;
   */
  flex-flow: row wrap;
  
  /* Then we define how is distributed the remaining space */
  justify-content: space-evenly;
  align-content: center;
  list-style: none;

}

.flex-container-editing {
  /* We first create a flex layout context */
  display: flex;
  
  /* Then we define the flow direction 
     and if we allow the items to wrap 
   * Remember this is the same as:
   * flex-direction: row;
   * flex-wrap: wrap;
   */
  flex-flow: column wrap;
  
  /* Then we define how is distributed the remaining space */
  justify-content: center;
  align-content: center;
  list-style: none;
  padding-top: 1%;
  column-gap: 100px !important;
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
