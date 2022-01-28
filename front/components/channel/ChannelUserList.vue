<template>
  <v-list v-if="userList.length > 0" dense align="center">
    <slot> </slot>
    <div v-for="(user, i) in userList"
      class="neon-button "
      style="border-radius: 15px; margin-top: 10px;"
      :style="widthCard > 0 ? 'width: ' + widthCard + '%': ''"
      justify="center"
      :key="`user-${i}`"
      link
      v-bind="userList"
    >
      <ChannelUserCard
        @clicked="openPreview"
        @focus="focusCard"
        @leave="leaveCard"
        @muteUser="emitMuteUser"
        @banUser="emitBanUser"
        :ownerAction="ownerAction"
        :status="status"
        :userStatus="user.channelStatus"
        :user="user.user"
        :isBan="user.isBan"
        :isMute="user.isMute"
        :muteTime="user.muteTime"
        :banTime="user.banTime"
        style="font-family: OrbitronM"
      />
      <div
        v-on:mouseover="focusCard(user.id)"
        v-on:mouseleave="leaveCard(user.id)"
        align="center"
        justify="center"
      >
        <v-icon
          @click="openPreview(user.id)"
          :color="userFocus == user.id ? '#9142c7' : 'white'"
        >
          {{ userId == user.id ? 'mdi-menu-up' : 'mdi-menu-down' }}
        </v-icon>
      </div>
      <ProfilePreview v-if="userId == user.id"
        @closeCard="userId = -1"
        :user="user.user"
        :meId="meId"
      />
    </div>
  </v-list>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'nuxt-property-decorator';
import Vue from 'vue'
import { ChannelUser, ChannelUserStatus } from '../../assets/Classes-ts/ChannelUser';
import { LightUser } from '../../assets/Classes-ts/User';
import socket_active from '../../plugins/active.io';
import socket_chat from '../../plugins/chat.io';

import copyLightUser from '../../plugins/copyUser'

@Component
export default class ChannelUserList extends Vue {
  
  @Prop({ type: Boolean, default: false })
  ownerAction!: Boolean

  @Prop({ type: Number, default: 0 })
  refresh!: Number
  
  @Prop({ type: Boolean, default: false })
  small!: Boolean

  @Prop({ type: String, default: ChannelUserStatus.DEFAULT})
  status!: ChannelUserStatus

  @Prop({ type: Number, default: 0 })
  meId!: Number

  @Prop({ default: 0 })
  widthCard!: Number | String
  
  userList: Array<ChannelUser> = new Array<ChannelUser>()
  userFocus: number = -1
  userId: number = -1

  async mounted() {
    var userListRet = await this.$axios.get('/api/chat/' + this.$route.params.slug + '/users')
    .catch(function(error) {
      return error.response
    })
    if (userListRet.status == 403 || userListRet.status == 404)
      this.$router.push('/chat?error=' + userListRet.data.message)
    else
    {
      this.userList = userListRet.data
      socket_active.on('stateChanged', (user: LightUser) => {
        this.switchState(user)
      })
      socket_chat.on('newUser', (user: LightUser) => {
        this.newUser(user)
      })
      socket_chat.on('removeUser', (user: LightUser) => {
        this.removeUser(user)
      })
      socket_chat.on('muteUser', (userId: number) => {
        var ret = this.userList.findIndex(el => el.user.id == userId)

        if (ret != -1)
        {
          console.log("here : " + ret)
          this.userList[ret].isMute = !this.userList[ret].isMute
        }
      })
      socket_chat.on('banUser', (userId: number) => {
        var ret = this.userList.findIndex(el => el.user.id == userId)

        console.log("this.meId")
        console.log(this.meId)
        console.log(userId)
        if (ret != -1)
          this.userList[ret].isBan = !this.userList[ret].isBan
        if (userId == this.meId)
          this.$router.push('/chat?event=' + 'you have been ban of the channel ' + this.$route.params.slug + '.')
      })
      socket_chat.on('switchGrade', (userId: number) => {
        var ret = this.userList.findIndex(el => el.user.id == userId)
        this.userList[ret].channelStatus
        if (ret != -1)
          this.userList[ret].channelStatus = this.userList[ret].channelStatus == ChannelUserStatus.DEFAULT ? ChannelUserStatus.ADMINISTRATOR: ChannelUserStatus.DEFAULT
      })
    }
  }

  switchState(user: LightUser) {
    for (var i = 0; i < this.userList.length; i++)
    {
      if (user.id == this.userList[i].user.id)
      {
        this.userList[i].user.nickName = user.nickName
        this.userList[i].user.picture = 'http://' + process.env.HOST + '/api/users/' + user.id + '/picture'
        this.userList[i].user.isActive = user.isActive;
        this.userList[i].user.currentGame = user.currentGame
        return
      }
    }
  }

  newUser(user: LightUser) {
    var newUser = new ChannelUser()

    newUser.user = user
    this.userList.push(newUser)
  }

  removeUser(user: LightUser) {
    var newUser = new ChannelUser()

    var id = this.userList.findIndex(el => el.user.id == user.id)
    if (id != -1)
      this.userList.splice(id, 1)
    if (user.id == this.meId)
      this.$router.push('/chat')
  }

  openPreview(id: number) {
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

  emitMuteUser(username: string) {
    socket_chat.emit('muteUser', this.$route.params.slug, username)
  }

  
  emitBanUser(username: string) {
    socket_chat.emit('banUser', this.$route.params.slug, username)
  }

  // refreshUser() {
  //   this.$emit("refreshUser")
  // }
}
</script>

<style>
@import '../../assets/Classes-scss/neon_effects.scss';

</style>