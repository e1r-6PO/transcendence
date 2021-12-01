<template>
<v-container>
  <v-text-field
  class="foreground_element text-field-nick-neon custom-placeholder-color custom-input-color"
  placeholder="Nickname"
  color="#e6ffff"
  v-model="search_string"
  @input="filter"
  hide-details
  filled
  rounded
  dense
  counter="20"
  ref="nickname_field"
  >
  </v-text-field>
  <div v-if="relationships != []" >
    <v-row>
      <v-col justify="center" align="center">
        <v-card class="foreground_element card_profile" v-for="relationship in relationships" :key="relationship.id">
          <p class="color_text text-h5 font-weight-medium" align="center">{{relationship.peer.nickName}}</p>
          <v-btn
            color="#8124be"
            class="friend-button"
            fab
            small
            @click="edit_friend(relationship)"
            absolute
            bottom
            right
          >
            <v-icon v-if="relationship.status == status.null" color="green">
              mdi-account-plus
            </v-icon>
            <v-icon v-if="relationship.status == status.completed" color="red">
              mdi-account-minus
            </v-icon>
            <v-icon v-if="relationship.status == status.sent" color="yellow">
              mdi-account-clock
            </v-icon>
            <v-icon v-if="relationship.status == status.incomming" color="yellow">
              mdi-account-arrow-down
            </v-icon>
            <v-icon v-if="relationship.status == status.blocked" color="red">
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
import { LightUser } from '../assets/User'

export default Vue.extend({

  middleware: 'login',

  data() {
    return {
      search_string: "",
      status: All_Friend_Status,
      relationships: [{
        id: 0,
        peer: LightUser,
        status: ''
      }]
    }
  },

  async mounted() {
    this.relationships = await this.$axios.$get('/api/profile/me/friends')
  },

  methods: {
    filter() {
      console.log(this.search_string)
    },

    async edit_friend(relationship: any) {
      await this.$axios.$post('/api/users/friend?id=' + relationship.peer.id)
      const friend_status = (await this.$axios.$get('/api/users/friend?id=' + relationship.peer.id)).status
      if (friend_status == "null")
        this.relationships.splice(this.relationships.findIndex( ({id}) => id === relationship.id ), 1)
    }
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