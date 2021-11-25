<template>
<v-container>
  <v-text-field
  class="foreground_element text-field-nick-neon custom-placeholder-color custom-input-color"
  placeholder="Nickname"
  color="#e6ffff"
  @keydown.enter="changer"
  hide-details
  filled
  rounded
  dense
  counter="20"
  ref="nickname_field"
  >
  </v-text-field>
  <div v-if="friends_list != []" >
    <v-row>
      <v-col justify="center" align="center">
        <v-card class="foreground_element card_profile" v-for="friend in friends_list" :key="friend.id">
          <p class="color_text text-h5 font-weight-medium" align="center">{{friend.peer.nickName}}</p>
          <v-btn
            color="#8124be"
            class="friend-button"
            fab
            small
            @click="friend()"
            absolute
            bottom
            right
          >
            <v-icon v-if="friend.status == status.null" color="green">
              mdi-account-plus
            </v-icon>
            <v-icon v-if="friend.status == status.completed" color="red">
              mdi-account-minus
            </v-icon>
            <v-icon v-if="friend.status == status.sent" color="yellow">
              mdi-account-clock
            </v-icon>
            <v-icon v-if="friend.status == status.incomming" color="yellow">
              mdi-account-arrow-down
            </v-icon>
            <v-icon v-if="friend.status == status.blocked" color="red">
              mdi-account-cancel
            </v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </div>
</v-container>
</template>

<script lang="ts">

const All_Friend_Status = {
  null: "null",
  completed: "completed",
  sent: "sent",
  incomming: "incomming",
  blocked: "blocked",
}

import Vue from 'vue'

export default Vue.extend({

  middleware: 'login',

  data() {
    return {
      status: All_Friend_Status,
      friends_list: [{
        id: 0,
        peer: {
          id: 0,
          picture: '',
          nickName: '',
          gameWin: 0,
          gameLose: 0,
        },
        status: ''
      }]
    }
  },

  async mounted() {
    this.friends_list = await this.$axios.$get('/api/profile/me/friends')
  }

})
</script>

<style scoped>
@import '../assets/main_page.scss';

.card_profile {
  border: 3px solid #a5fafa !important;
  /* border: 3px solid #e7b3ff !important; */
  box-shadow: 0px 0px 40px 0px #0affff !important;
  /* box-shadow: inset 0px 0px 1000px 0px #cb5cff, 0px 0px 40px 0px #cb5cff !important; */
  border-radius: 15px !important;
  background-color: #181818 !important;
  /* background-color: #35b4b2 !important; */
  /* box-shadow: 0px 0px 20px 0px rgba(58, 189, 182, 0.7) !important;  */
  height: 50px;
  width: 80%;
}

.color_text { 
  /* z-index: 6; */
  /* padding-top: 0.5%;
  padding-right: 85%; */
  color: #ffffff;
}

.friend-button {
  /* border: 3px solid #e9c8ff !important;
  box-shadow: 0px 0px 10px 0px #9141c7 !important; */
  border: 3px solid #e9c8ff !important;
  box-shadow: 0px 0px 15px 3px #9141c7 !important;
}

</style>