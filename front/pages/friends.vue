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
        <BasicBtn style="font-family: OrbitronM; font-size: 80%" @click="changeSelectedStatus(displayFriend[i - 1])" :width="150" :content="displayFriend[i - 1]" :isText="true" />
      </v-badge>
    </p>
  </v-row>
  <div align="center" style="padding-top: 30px">
    <TextField @input="filter()" v-model="search_string" width="340" autofocus placeholder="Nickname" prepend_inner_icon="mdi-magnify" />
  </div>
    <v-row v-if="filterRelationships != []" justify="space-around" style="padding-top: 20px">
      <v-col justify="center" align="left">
        <div v-for="relationship in filterRelationships" :key="relationship.id"
          style="padding-top:30px"
          v-on:bind="filterRelationships"
          v-on:change="update"
        >
          <v-card
            class="foreground_element card_profile"
            align="left"
            justify="center"
          >
            <v-row align="center" justify="start" style="padding-left: 20px; padding-top: 7px">
              <ProfilePicture @click="goToProfile(relationship)" :src="relationship.peer.picture" :isActive="relationship.peer.isActive" :currentGame="relationship.peer.currentGame" />
              <v-card-title @click="goToProfile(relationship)" class="color_text font-weight-medium" align="center" style="font-family: OrbitronM !important">{{relationship.peer.nickName}}</v-card-title>
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
            </v-row>
          </v-card>
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

import copyLightUser from '../plugins/copyUser'

export default Vue.extend({

  middleware: 'login',

  head() {
    return {
      title: 'Friends'
    }
  },

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
    socket_active.on('stateChanged', (user: LightUser) => {
      var find = this.fullRelationships.findIndex((el) => el.peer.id == user.id)
      if (find != -1) {
        if (user.isActive == true && this.fullRelationships[find].peer.isActive != user.isActive) {
          this.activeUser.set(user.id, user)
          this.switchState(user.id)
        }
        else if (user.isActive == true && this.fullRelationships[find].peer.isActive != user.isActive) {
          this.activeUser.delete(user.id)
          this.switchState(user.id)
        }
        copyLightUser(this.fullRelationships[find].peer, user)
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
            this.onlineRelationships.push(this.allRelationships[id])
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
  }
})
</script>

<style scoped>
@import '../assets/Classes-scss/neon_effects.scss';
@import '../assets/Classes-scss/main_page.scss';
.card_profile {
  border: 3px solid #a5fafa !important;
	box-shadow: inset 0px 0px 20px 0px #0affff, 0px 0px 20px 0px #0affff !important;
  /* box-shadow: 0px 0px 40px 0px #0affff !important; */
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

</style>