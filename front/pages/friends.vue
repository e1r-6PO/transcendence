<template>
<v-container style="padding-top: 50px">
  <v-row align="center" justify="space-around">
    <p v-for="i in 4" :key="i">
      <v-btn width="200" @click="filterByStatus(displayFriend[i - 1])">
        {{ displayFriend[i - 1] }}
      </v-btn>
    </p>
  </v-row>
  <div align="center" style="padding-top: 30px">
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
    width=50
    ref="nickname_field"
  >
  </v-text-field>
  </div>
  <div v-if="filterRelationships != []" style="padding-top: 50px; padding-left: 30px">
    <v-row>
      <v-col justify="center" align="left">
        <v-card v-for="relationship in filterRelationships" :key="relationship.id"
          class="foreground_element card_profile"
          @click="goToProfile(relationship)"
        >
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
      fullRelationships: [{
        id: 0,
        peer: LightUser,
        status: ''
      }],
      filterRelationships: [{
        id: 0,
        peer: LightUser,
        status: ''
      }],
      selectedStatus: '',
      displayFriend: ['Online', 'All', 'En attente', 'Blocked']
    }
  },

  async mounted() {
    this.fullRelationships = await this.$axios.$get('/api/profile/me/friends')
    this.filterByStatus('All')
    this.selectedStatus = 'All'
  },

  methods: {
    filter() {
        this.filterByStatus(this.selectedStatus)
      if (this.search_string != '')
      {
        for (var i = 0; i < this.filterRelationships.length; i++)
          {
            if (this.filterRelationships[i].peer.nickName.search(this.search_string) == -1)
              this.filterRelationships.pop(this.filterRelationships[i])
          }
      }
    },

    filterByStatus(status: string)
    {
      this.selectedStatus = status
      this.filterRelationships = []
      for (var i = 0; i < this.fullRelationships.length; i++)
      {
        if (status == 'All' && this.fullRelationships[i].status == 'completed')
          this.filterRelationships.push(this.fullRelationships[i]);
        else if (status == 'En attente' && (this.fullRelationships[i].status == 'send' || this.fullRelationships[i].status == 'incomming'))
          this.filterRelationships.push(this.fullRelationships[i]);
        else if (status == 'Online' && this.fullRelationships[i].status == 'completed' /* && this.fullRelationshops[i].peer.online */)
          this.filterRelationships.push(this.fullRelationships[i]);
        else if (status == 'Blocked' && this.fullRelationships[i].status == 'blocked')
          this.filterRelationships.push(this.fullRelationships[i]);
      }
    },

    goToProfile(relationship: any)
    {
      this.$router.push('/users/' + relationship.peer.nickName)
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
  width: 20%;
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