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
          :src="user.picture"
        >
      </v-avatar>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title v-text="user.nickName" style="font-size: 15px; margin-top: 14px" :style="'color:' + getUserTextColor(i)" />
        <v-list-item-subtitle v-text="user.channelStatus" align="right" class="mt-5" style="font-size: 12px;" :style="'color:' + getUserTextColor(i)" />
      </v-list-item-content>
      <v-list-item-icon v-if="ownerAction && user.channelStatus != isOwner()" class="mt-3">
        <DeleteUserBtn style="margin-right: 5px" :small="small" @refreshUser="refreshUser" :userName="user.nickName" />
        <ChangeGradeUserBtn :small="small" :grade="user.channelStatus" @refreshUser="refreshUser" :userName="user.nickName" />
        <MuteUserBtn :userName="user.nickName" @refreshUser="refreshUser" :mute="user.isMute" />
        <MuteUserBtn :userName="user.nickName" @refreshUser="refreshUser" :ban="user.isBan" />
        <!-- <DeleteUserBtn :small="small" @refreshUser="refreshUser" :userName="user.nickName" />
        <DeleteUserBtn :small="small" @refreshUser="refreshUser" :userName="user.nickName" />
        <DeleteUserBtn :small="small" @refreshUser="refreshUser" :userName="user.nickName" /> -->
      </v-list-item-icon>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'nuxt-property-decorator';
import Vue from 'vue'
import { ChannelUser, ChannelUserStatus } from '../../assets/Classes-ts/ChannelUser';

@Component
export default class ChannelUserList extends Vue {
  
  @Prop({ type: Boolean, default: true})
  owner!: Boolean

  @Prop({ type: Number, default: 0 })
  refresh!: Number
  
  @Prop({ type: Boolean, default: false})
  small!: Boolean

  @Prop({ type: Boolean, default: false})
  ownerAction!: Boolean
  
  userList: Array<ChannelUser> = []
  userFocus: number = -1

  async mounted() {
    var userListRet = await this.$axios.get('/api/chat/' + this.$route.params.slug + '/users')
    .catch(function(error) {
      return error.response
    })
    if (userListRet.status == 403)
      this.$router.push('/chat')
    else
      this.userList = userListRet.data
    console.log(this.userList)
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

  directToUserProfile(userNick: string) {
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
}
</script>