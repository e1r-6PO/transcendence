<template>
  <v-list-item
    @click="sendClick()"
    v-on:mouseover="focus()"
    v-on:mouseleave="leave()"
  >
      <v-list-item-icon style="margin-right: 10px; padding-top: 4px">
        <ProfilePicture :src="user.picture" :isActive="user.isActive" disable size="42"/>
      </v-list-item-icon>
      <v-list-item-content class="pb-0">
        <v-list-item-title v-text="user.nickName" style="font-size: 15px; margin-top: 14px" :style="'color:' + getUserTextColor()" />
        <v-list-item-subtitle v-text="user.status" align="right" class="mt-5" style="font-size: 12px;" :style="'color:' + getUserTextColor()" />
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
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator'
import Vue from 'vue'
import { ChannelUserStatus } from '../../assets/Classes-ts/ChannelUser'
import { User } from '../../assets/Classes-ts/User'

@Component
export default class ChannelUserCard extends Vue{
  @Prop({ type: Object, default: new User() })
  user!: User

  @Prop({ type: Boolean, default: false })
  ownerAction!: Boolean

  @Prop({ type: String, default: ChannelUserStatus.DEFAULT})
  status!: ChannelUserStatus

  @Prop({ type: Boolean, default: false })
  small!: Boolean

  @Prop({ type: Boolean, default: false })
  updateActive!: Boolean

  userFocus: boolean = false

  getUserTextColor(): string {
    if (this.userFocus)
      return '#9142c7'
    return 'white'
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