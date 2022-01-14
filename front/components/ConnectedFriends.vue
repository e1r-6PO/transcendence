<template>
  <v-list>
    <h3 align="center" justify="center" class="white--text pb-4 pt-2 neonText"> Connected friends </h3>
    <v-divider class="mt-4 mb-8 divider" style="border-color: #f27719;"> </v-divider>
    <div
      v-for="(friend, i) in activeUser"
      :key="`activeUser-${i}`"
      @change="update"
      @mouseover="focusCard(friend.peer.id)"
      @mouseleave="leaveCard(friend.peer.id)"
      class="neon-button text-center mb-2"
      justify-content="center"
      style="border-radius: 15px"
    >
    <v-list-item
      @click="openPreview(friend.peer.id)"
      class="pr-0 pl-0"
    >
    <v-list-item-icon class="mr-4 ml-4">
        <ProfilePicture :src="friend.peer.picture" :isActive="friend.peer.isActive" disable size="42"/>
      </v-list-item-icon>
      <v-list-item-content class="pb-0">
        <v-list-item-title
          v-text="friend.peer.nickName"
          align="start"
          style="font-size: 15px; margin-top: 14px;"
          :style="'color: ' + (userFocus == friend.peer.id ? '#9142c7' : 'white')"
          class="mb-7"
        />
      </v-list-item-content>
      <!-- <v-list-item-action style="position: absolute; right: 10px; bottom: 0px">
        <BasicBtn width="30" :iconSize="18" content="mdi-message" />
      </v-list-item-action> -->
    <v-btn
        @mouseover="focusCard(friend.peer.id)"
        @mouseleave="leaveCard(friend.peer.id)"
        icon
        width="20"
        height="20"
        style="background-color:#18181801; position: asbolute !important; top: 27px; right: 44%"
      >
          <!-- @click="openPreview(friend.peer.id)" -->
      <v-icon
        :color="userFocus == friend.peer.id ? '#9142c7' : 'white'"
      >
        {{ userId == friend.peer.id ? 'mdi-menu-up' : 'mdi-menu-down' }}
      </v-icon>
    </v-btn>
    </v-list-item>
      <ProfilePreview v-if="userId == friend.peer.id"
        @closeCard="userId = -1"
        :user="friend.peer"
        :meId="-1"
      />
    </div>
  </v-list>
  
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'
import { LightUser } from '../assets/Classes-ts/User'
import { Friendship } from '../assets/Classes-ts/friendship'

import socket_active from '../plugins/active.io'

@Component
export default class ConnectedFriends extends Vue{
  
  activeUser: Array<Friendship> = new Array<Friendship>()
  friendList: Array<Friendship> = new Array<Friendship>()
  update: boolean = false
  userId: number = -1
  userFocus: number = -1

  async mounted() {
    var allRelation = await this.$axios.get('/api/profile/me/friends')

    this.friendList = allRelation.data
    for (var i = 0; i < this.friendList.length; i++)
    {
      if (this.friendList[i].status == "completed" && this.friendList[i].peer.isActive)
        this.activeUser.push(this.friendList[i])
    }
    socket_active.on("active", (user: LightUser) => {
      var find = this.findUser(user)
      if (find != -1)
      {
        this.update = !this.update
        this.switchToActive(user.id)
      }
    })
    socket_active.on("inactive", (user: LightUser) => {
      var find = this.findUser(user)
      if (find != -1)
      {
        this.switchToInactive(user.id)
        this.update = !this.update
      }
    })
  }

  findUser(user: LightUser): number {
    for (var i = 0; i < this.friendList.length; i++)
    {
      if (this.friendList[i].peer.id == user.id)
        return (this.friendList[i].peer.id)
    }
    return (-1)
  }

  switchToInactive(userId: number) {
    for (var i = 0; i < this.activeUser.length; i++)
    {
      if (this.activeUser[i].peer.id == userId)
      {
        this.activeUser.splice(i, 1)
        return
      }
    }
  }

  switchToActive(userId: number) {
    for (var i = 0; i < this.friendList.length; i++)
    {
      if (this.friendList[i].peer.id == userId)
      {
        if (this.activeUser.find((friend) => friend.peer.id == this.friendList[i].peer.id))
          return
        this.friendList[i].peer.isActive = true
        this.activeUser.push(this.friendList[i])
        return
      }
    }
  }

  goToPrivateMessage(nickName: string) {
    this.$router.push('privateMessage/' + nickName)
  }

  openPreview(id: number) {
    console.log(id)
    if (this.userId == id)
      this.userId = -1
    else
      this.userId = id
  }

  focusCard(id: number) {
    this.userFocus = id
  }

  leaveCard(id: number) {
    this.userFocus = -1
  }
}
</script>