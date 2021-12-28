<template>
<v-container style="padding-top: 50px">
  <v-row align="center" justify="space-around">
    <p v-for="i in 4" :key="i">
      <v-badge
        color="error"
        :content="getNumberNotif(displayFriend[i - 1])"
        :value="getNumberNotif(displayFriend[i - 1])"
        overlap
        disable
      >
      <BasicBtn @click="changeSelectedStatus(displayFriend[i - 1])" :width="150" :content="displayFriend[i - 1]" :isText="true" />
      <!-- <v-btn width="200" @click="changeSelectedStatus(displayFriend[i - 1])"> -->
        <!-- {{ displayFriend[i - 1] }} -->
      <!-- </v-btn> -->
      </v-badge>
    </p>
  </v-row>
  <div align="center" style="padding-top: 30px">
  <v-text-field
    class="foreground_element text-field-nick-neon custom-placeholder-color custom-input-color neonTextYellow"
    placeholder="Nickname"
    color="#e6ffff"
    v-model="search_string"
    prepend-inner-icon="mdi-magnify"
    hide-details
    filled
    rounded
    dense
    @input="filter()"
    counter="20"
    width=50
    ref="nickname_field"
  >
  </v-text-field>
  </div>
    <v-row v-if="filterRelationships != []" justify="space-around" style="padding-top: 20px">
      <v-col justify="center" align="left">
      <div v-for="relationship in filterRelationships" :key="relationship.id"
        style="padding-top:30px"
        v-on:bind="filterRelationships"
        v-on:change="update"
      >
        <!-- <p v-if="matchSearch(relationship.peer)"> -->
        <v-card
          class="foreground_element card_profile"
          align="left"
          justify="center"
        >
        <v-row align="center" justify="start" style="padding-left: 20px; padding-top: 7px">
          <img
            width="40"
            @click="goToProfile(relationship)"
            style="border-radius: 100% !important;"
            :class="relationship.peer.isActive == true ? 'profile-picture-active' : 'profile-picture-inActive'"
            :src="relationship.peer.picture"
          />
          <v-card-title @click="goToProfile(relationship)" class="color_text text-h5 font-weight-medium" align="center">{{relationship.peer.nickName}}</v-card-title>
          <BasicBtn
            v-if="selectedStatus == 'Pending' && relationship.status == status.incomming"
            style="position: absolute; bottom: -20px; right: 58px"
            @click="edit_friend(relationship, true)"
            :width="40"
            content="mdi-account-remove"
            color="black"
            backgroundColor="#18124be0"
          />
          <BasicBtn
            style="position: absolute; bottom: -20px; right: 13px"
            @click="edit_friend(relationship, false)"
            :width="40"
            :content="getStatusIcon(relationship)"
            color="black"
            backgroundColor="#18124be0"
          />
          <!-- <v-btn
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
          </v-btn> -->
        </v-row>
        </v-card>
        <!-- </p> -->
        </div>
      </v-col>
    </v-row>
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
import { LightUser } from '../assets/Classes-ts/User'
import socket_active from '../plugins/active.io'

export default Vue.extend({

  middleware: 'login',

  data() {
    return {
      search_string: "",
      status: All_Friend_Status,
      fullRelationships: [{
        id: 0,
        peer: new LightUser(),
        status: '',
        isActive: false
      }],
      filterRelationships: [{
        id: 0,
        peer: new LightUser(),
        status: '',
        isActive: false
      }],
      onlineRelationships: [{
        id: 0,
        peer: new LightUser(),
        status: '',
        isActive: false
      }],
      allRelationships: [{
        id: 0,
        peer: new LightUser(),
        status: '',
        isActive: false
      }],
      pendingRelationships: [{
        id: 0,
        peer: new LightUser(),
        status: '',
        isActive: false
      }],
      blockedRelationships: [{
        id: 0,
        peer: new LightUser(),
        status: '',
        isActive: false
      }],
      selectedStatus: '',
      displayFriend: ['Online', 'All', 'Pending', 'Blocked'],
      activeUser: new Map<number, LightUser>(),
      update: false
    }
  },

  async mounted() {
    socket_active.on("active", (user: LightUser) => {
      this.activeUser.set(user.id, user)
      var find = this.findUser(user)
      if (find != -1)
      {
        this.update = !this.update
        this.switchState(user.id)
      }
    })
    socket_active.on("inactive", (user: LightUser) => {
      this.activeUser.delete(user.id)
      var find = this.findUser(user)
      if (find != -1)
      {
        this.switchState(user.id)
        this.update = !this.update
      }
    })
    this.fullRelationships = await this.$axios.$get('/api/profile/me/friends')
    this.initTab()
    for (var i = 0; i < this.fullRelationships.length; i++)
    {
      if (this.activeUser.has(this.fullRelationships[i].peer.id))
        this.fullRelationships[i].peer.isActive = true
      if (this.fullRelationships[i].status == this.status.blocked)
        this.blockedRelationships.push(this.fullRelationships[i])
      else if (this.fullRelationships[i].status == this.status.sent)
        this.pendingRelationships.push(this.fullRelationships[i])
      else if (this.fullRelationships[i].status == this.status.incomming)
        this.pendingRelationships.push(this.fullRelationships[i])
      else if (this.fullRelationships[i].status == this.status.completed)
      {
        this.allRelationships.push(this.fullRelationships[i])
        if (this.fullRelationships[i].peer.isActive)
          this.onlineRelationships.push(this.fullRelationships[i])
      }
    }
    this.changeSelectedStatus('All')
    this.selectedStatus = 'All'
  },

  methods: {
    async initTab() {
      this.blockedRelationships = []
      this.pendingRelationships = []
      this.allRelationships = []
      this.onlineRelationships = []
    },

    matchSearch(peer: LightUser): boolean
    {
      if (peer.nickName.search(this.search_string) != -1)
        return true
      return false
    },

    filter() {
      this.changeSelectedStatus(this.selectedStatus)
      if (this.search_string != '')
        this.filterRelationships = this.filterRelationships.filter(relationship => relationship.peer.nickName.search(this.search_string) != -1)
    },

    changeSelectedStatus(changeStatus: string)
    {
      if (changeStatus == 'All')
        this.filterRelationships = this.allRelationships
      else if (changeStatus == 'Blocked')
        this.filterRelationships = this.blockedRelationships
      else if (changeStatus == 'Pending')
        this.filterRelationships = this.pendingRelationships
      else if (changeStatus == 'Online')
        this.filterRelationships = this.onlineRelationships
      this.selectedStatus = changeStatus
    },

    goToProfile(relationship: any)
    {
      this.$router.push('/users/' + relationship.peer.nickName)
    },

    getNumberNotif(type: string) : number
    {
      if (type == 'All')
        return (this.allRelationships.length)
      if (type == 'Blocked')
        return (this.blockedRelationships.length)
      if (type == 'Pending')
        return (this.pendingRelationships.length)
      if (type == 'Online')
        return (this.onlineRelationships.length)
      else
        return 0
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

    async edit_friend(relationship: any, isRemove: boolean) {
      if (isRemove)
        await this.$axios.$delete('/api/friends/' + relationship.peer.id)
      else if (relationship.status == this.status.completed)
        await this.$axios.$delete('/api/friends/' + relationship.peer.id)
      else if (relationship.status == this.status.incomming)
        await this.$axios.$patch('/api/friends/' + relationship.peer.id + '/accept')
      else if (relationship.status == this.status.blocked)
        await this.$axios.$post('/api/friends/' + relationship.peer.id + '/unblock')
      else if (relationship.status == this.status.sent)
        await this.$axios.$delete('/api/friends/' + relationship.peer.id)
      
      this.fullRelationships = await this.$axios.$get('/api/profile/me/friends')
      this.initTab()
      for (var i = 0; i < this.fullRelationships.length; i++)
      {
        if (this.fullRelationships[i].status == this.status.blocked)
          this.blockedRelationships.push(this.fullRelationships[i])
        else if (this.fullRelationships[i].status == this.status.sent)
          this.pendingRelationships.push(this.fullRelationships[i])
        else if (this.fullRelationships[i].status == this.status.incomming)
          this.pendingRelationships.push(this.fullRelationships[i])
        else if (this.fullRelationships[i].status == this.status.completed)
        {
          this.allRelationships.push(this.fullRelationships[i])
          if (this.fullRelationships[i].peer.isActive)
           this.onlineRelationships.push(this.fullRelationships[i])
        }
      }
      this.changeSelectedStatus(this.selectedStatus)
    },

    findUser(user: LightUser): number {
      for (var i = 0; i < this.fullRelationships.length; i++)
      {
        if (this.fullRelationships[i].peer.id == user.id)
          return (i)
      }
      return (-1)
    },

    switchState(userId: number) {
        var id = this.allRelationships.findIndex(el => el.peer.id == userId)
        if (id != -1)
        {
          this.allRelationships[id].peer.isActive = !this.allRelationships[id].peer.isActive
          if (this.allRelationships[id].peer.isActive)
          {
          console.log(this.allRelationships[id])
            this.onlineRelationships.push(this.allRelationships[id])
          console.log(this.onlineRelationships)
          }
          else
          {
            var onlineId = this.onlineRelationships.findIndex(el => el.peer.id == userId)
            if (onlineId != -1)
              this.onlineRelationships.splice(onlineId, 1)
            this.changeSelectedStatus(this.selectedStatus)
          }
        }
    },

    test() {
      console.log("catch change")
    },
  }
})
</script>

<style scoped>
@import '../assets/Classes-scss/main_page.scss';
@import '../assets/Classes-scss/main_page.scss';
.card_profile {
  border: 3px solid #a5fafa !important;
  box-shadow: 0px 0px 40px 0px #0affff !important;
  border-radius: 15px !important;
  background-color: #181818 !important;
  height: 60px;
  width: 100%;
}

.color_text { 
  color: #ffffff;
}

.friend-button {
  border: 3px solid #e9c8ff !important;
  box-shadow: 0px 0px 15px 3px #9141c7 !important;
}

.profile-picture {
  border: 2px solid #a5fafa !important;
  box-shadow: 0px 0px 10px 0px #63f3f3 !important;
  border-radius: 100%
}

.profile-picture-active {
  border: 2px solid #92d6a6 !important;
  box-shadow: 0px 0px 10px 1px #03cf41 !important;
  border-radius: 100%
}

.profile-picture-inActive {
  border: 2px solid #b33b3b !important;
  box-shadow: 0px 0px 10px 1px #aa0909 !important;
  border-radius: 100%
}

</style>