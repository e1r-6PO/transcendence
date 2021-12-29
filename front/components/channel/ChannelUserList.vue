<template>
  <v-list dense>
    <slot> </slot>
    <v-list-item
      class="neon-button"
      style="border-radius: 15px; margin-top: 10px"
      v-for="(user, i) in userList"
      :key="`user-${i}`"
      link
      v-on:mouseover="userFocus = i"
      v-on:mouseleave="userFocus = -1"
      v-on:change="refreshList()"
      v-on:bind="userList"
      @click="redirectToUserProfile(user.nickName)"
    >
      <v-list-item-icon style="margin-right: 10px; padding-top: 4px">
      <v-avatar size="36">
        <img
          alt="user"
          :class="user.isActive == true ? 'profile-picture-active' : 'profile-picture-inActive'"
          :src="user.picture"
          v-on:bind="user"
          v-on:change="updateActive"
        >
      </v-avatar>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title v-text="user.nickName" style="font-size: 15px; margin-top: 14px" :style="'color:' + getUserTextColor(i)" />
        <v-list-item-subtitle v-text="user.status" align="right" class="mt-5" style="font-size: 12px;" :style="'color:' + getUserTextColor(i)" />
      </v-list-item-content>
      <v-list-item-icon v-if="ownerAction && isUserOwner() && user.status != isOwner()" class="mt-3">
        <DeleteUserBtn style="margin-right: 5px" :small="small" @refreshUser="refreshUser" :userName="user.nickName" />
        <ChangeGradeUserBtn style="margin-right: 5px" :small="small" :grade="user.status" @refreshUser="refreshUser" :userName="user.nickName" />
      </v-list-item-icon>
      <v-list-item-icon v-if="ownerAction && isUserOwnerOrAdmin() && user.status != isOwner()" class="mt-3">
        <MuteUserBtn style="margin-right: 0px" :userName="user.nickName" @refreshUser="refreshUser" :mute="user.isMute" />
        <BanUserBtn :userName="user.nickName" @refreshUser="refreshUser" :ban="user.isBan" />
      </v-list-item-icon>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'nuxt-property-decorator';
import Vue from 'vue'
import { ChannelUser, ChannelUserStatus } from '../../assets/Classes-ts/ChannelUser';
import { LightUser } from '../../assets/Classes-ts/User';
import socket_active from '../../plugins/active.io';


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
  
  userList: Array<ChannelUser> = []
  activeUser: Map<number, LightUser> = new Map()
  userFocus: number = -1
  updateActive: boolean = false

  async mounted() {
    var userListRet = await this.$axios.get('/api/chat/' + this.$route.params.slug + '/users')
    .catch(function(error) {
      return error.response
    })
    if (userListRet.status == 403)
      this.$router.push('/chat')
    else
    {
      console.log(userListRet.data)
      this.userList = userListRet.data
      socket_active.on("active", (user: LightUser) => {
        this.activeUser.set(user.id, user)
        // var find = this.findUser(user)
        // if (find != -1)
        // {
          console.log("coucou")
          this.switchState(user, true)
          this.updateActive = !this.updateActive
        // }
      })
      socket_active.on("inactive", (user: LightUser) => {
          console.log("au revoir")
        this.activeUser.delete(user.id)
        // var find = this.findUser(user)
        // if (find != -1)
        // {
          this.switchState(user, false)
            this.updateActive = !this.updateActive
        // }
      })
    }
  }

  @Watch('refresh', { immediate: true })
  async refreshList()
  {
    var userListRet = await this.$axios.get('/api/chat/' + this.$route.params.slug + '/users')
    .catch(function(error) {
      return error.response
    })
    if (userListRet.status == 403)
      this.$router.push('/chat')
    else
      this.userList = userListRet.data
  }

  redirectToUserProfile(userNick: string) {
    this.$router.push("/users/" + userNick)
  }

  getUserTextColor(i: number): string {
    if (i == this.userFocus)
      return '#9142c7'
    return 'white'
  }

  refreshUser() {
    this.$emit('refreshUser')
  }

  isOwner() {
    return ChannelUserStatus.OWNER
  }

  isUserOwnerOrAdmin() {
    return this.status != ChannelUserStatus.DEFAULT
  }
  
  isUserOwner() {
    return this.status == ChannelUserStatus.OWNER
  }

  switchState(user: LightUser, state: boolean) {
    for (var i = 0; i < this.userList.length; i++)
    {
      if (user.id == this.userList[i].id)
      {
        this.userList[i].nickName = user.nickName
        this.userList[i].picture = 'http://localhost:8000/api/users/' + user.id + '/picture'
        this.userList[i].isActive = state;
        return
      }
    }
  }
}
</script>

<style>
@import '../../assets/Classes-scss/neon_effects.scss';

</style>