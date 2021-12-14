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
  <!-- <div v-if="filterRelationships != []" style="padding-top: 50px; padding-left: 30px"> -->
    <v-row v-if="filterRelationships != []" justify="space-around" style="padding-top: 20px">
      <v-col justify="center" align="left">
      <div v-for="relationship in filterRelationships" :key="relationship.id" style="padding-top:30px">
        <!-- <v-card v-for="relationship in filterRelationships" :key="relationship.id" -->
        <!-- <div style="padding-top: 15px"> -->
        <v-card
          class="foreground_element card_profile"
          align="left"
          justify="center"
        >
        <v-row align="center" justify="start" style="padding-left: 20px; padding-top: 7px">
            <v-avatar size="40" @click="goToProfile(relationship)">
          <v-img style="border-radius: 15px" :src="relationship.peer.picture" />
            </v-avatar>
          <v-card-title @click="goToProfile(relationship)" class="color_text text-h5 font-weight-medium" align="center">{{relationship.peer.nickName}}</v-card-title>
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
            <v-icon>
              {{ getStatusIcon(relationship) }}
            </v-icon>
            <!-- <v-icon v-if="relationship.status == status.null" color="green">
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
            </v-icon> -->
          </v-btn>
        </v-row>
        </v-card>
        </div>
      </v-col>
    </v-row>
  <!-- </div> -->
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
        peer: new LightUser(),
        status: ''
      }],
      filterRelationships: [{
        id: 0,
        peer: new LightUser(),
        status: ''
      }],
      selectedStatus: '',
      displayFriend: ['Online', 'All', 'Pending', 'Blocked']
    }
  },

  async mounted() {
    this.fullRelationships = await this.$axios.$get('/api/profile/me/friends')
    console.log(this.fullRelationships)
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
          var test = new LightUser();
          test = this.filterRelationships[i].peer;
          console.log(test.nickName)
          if (this.filterRelationships[i].peer.nickName.search(this.search_string) == -1)
            this.filterRelationships.splice(i, 1)
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
        else if (status == 'Pending' && (this.fullRelationships[i].status == 'sent' || this.fullRelationships[i].status == 'incomming'))
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

    getStatusIcon(relationship : any) : string
    {
        if (relationship.status == this.status.completed)
          return ('mdi-account-minus')
        else if (relationship.status == this.status.blocked)
          return ('mdi-lock-open-variant')
        else if (relationship.status == this.status.sent)
          return ('mdi-account-remove')
        else if (relationship.status == this.status.incomming)
          return ('mdi-account-plus')
        else
          return ('mdi-account-minus')
    },

    async edit_friend(relationship: any) {
      if (relationship.status == this.status.completed)
        await this.$axios.$delete('/api/friends/' + relationship.peer.id)
      else if (relationship.status == this.status.incomming)
        await this.$axios.$patch('/api/friends/' + relationship.peer.id + '/accept')
      else if (relationship.status == this.status.blocked)
        await this.$axios.$post('/api/friends/' + relationship.peer.id + '/unblock')
      else if (relationship.status == this.status.sent)
        await this.$axios.$delete('/api/friends/' + relationship.peer.id)
      
      this.fullRelationships = await this.$axios.$get('/api/profile/me/friends')
        this.filterByStatus(this.selectedStatus)
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
  height: 60px;
  width: 100%;
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