<template>
  <v-list-item
    @click="sendClick()"
    v-on:mouseover="focus()"
    v-on:mouseleave="leave()"
  >
      <v-list-item-icon style="margin-right: 10px; padding-top: 4px">
        <ProfilePicture :src="user.picture" :isActive="user.isActive" :currentGame="getGameState()" disable size="42"/>
      </v-list-item-icon>
      <v-list-item-content class="pb-0">
        <v-list-item-title v-text="user.nickName" align="start" style="font-size: 15px; margin-top: 14px" :style="'color:' + getUserTextColor()" class="mb-7" />
        <v-list-item-subtitle v-text="userStatus" align="right" style="font-size: 12px; position: absolute; bottom: -15px; right: 20px" :style="'color:' + getUserTextColor()" />
      </v-list-item-content>
      <v-list-item-icon v-if="ownerAction && isUserOwner() && userStatus != isOwner()" class="mt-3">
        <DeleteUserBtn style="margin-right: 5px" :small="small" @refreshUser="refreshUser" :userName="user.nickName" />
        <ChangeGradeUserBtn style="margin-right: 5px" :small="small" :grade="userStatus" @refreshUser="refreshUser" :userName="user.nickName" />
      </v-list-item-icon>
      <v-list-item-icon v-if="ownerAction && isUserOwnerOrAdmin() && userStatus != isOwner()" class="mt-3">
        <MuteUserBtn style="margin-right: 0px" :userName="user.nickName" @refreshUser="refreshUser" :mute="user.isMute" />
        <BanUserBtn :userName="user.nickName" @refreshUser="refreshUser" :ban="user.isBan" />
      </v-list-item-icon>
    </v-list-item>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'nuxt-property-decorator'
import Vue from 'vue'
import { ChannelUser, ChannelUserStatus } from '../../assets/Classes-ts/ChannelUser'
import { LightUser, User } from '../../assets/Classes-ts/User'

@Component
export default class ChannelUserCard extends Vue{
  @Prop({ type: Object, default: new User() })
  user!: LightUser

  @Prop({ type: Boolean, default: false })
  ownerAction!: Boolean

  @Prop({ type: String, default: ChannelUserStatus.DEFAULT})
  status!: ChannelUserStatus

  @Prop({ type: String, default: ChannelUserStatus.DEFAULT})
  userStatus!: ChannelUserStatus

  @Prop({ type: Boolean, default: false })
  small!: Boolean

  @Prop({ type: Boolean, default: false })
  updateActive!: Boolean

  userFocus: boolean = false

  mounted() {
    console.log("check status")
    console.log(this.user)
    console.log(this.userStatus)
  }

  getGameState(): string {
    return this.user.currentGame
  }

  getUserTextColor(): string {
    if (this.userFocus)
      return '#9142c7'
    return 'white'
  }

  @Watch('user', { immediate: true })
  async userUpdate() {
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

  sendClick() {
    this.$emit("clicked", this.user.id)
  }

  focus() {
    this.userFocus = true
    this.$emit("focus", this.user.id)
  }

  leave() {
    this.userFocus = false
    this.$emit("leave", this.user.id)
  }

  refreshUser() {
    this.$emit('refreshUser')
  }
}
</script>