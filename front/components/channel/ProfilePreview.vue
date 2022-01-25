<template>
    <div>
    <v-divider class="mt-4 mb-4 divider" style="border-color: #f27719;"> </v-divider>
    <v-list
      style="background-color: rgba(24, 24, 24, 0) !important; border-radius: 18px; z-index: 0"
    >
      <v-list-item align="center" v-if="meId == user.id">
        <v-list-item-title style="color: white"> Hello It's you </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-action>
          <BasicBtn @click="redirectToUserProfile(user.nickName)" :iconSize="25" content="mdi-account" />
        </v-list-item-action>
        <v-list-item-title  style="color: white">See {{ meId == user.id ? 'your' : '' }} profile</v-list-item-title>
      </v-list-item>
      <v-list-item v-if="meId != user.id">
        <v-list-item-action>
          <PrivateGameBtn
            style="padding-left: 14px"
            :user="user"
            location="profilePreview"
          />
        </v-list-item-action>
        <v-list-item-title  style="color: white">Play Pong</v-list-item-title>
      </v-list-item>
      <v-list-item v-if="meId != user.id">
        <v-list-item-action>
          <BasicBtn @click="goToMessage(user.nickName)" :iconSize="20" content="mdi-message" />
        </v-list-item-action>
        <v-list-item-title  style="color: white">Send message</v-list-item-title>
      </v-list-item>
      <v-list-item align="center">
        <v-list-item-title style="color: white">Win {{user.gameWin}}</v-list-item-title>
        <v-list-item-title style="color: white">Lose {{user.gameLose}}</v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator'
import Vue from 'vue'
import { LightUser, User } from '../../assets/Classes-ts/User'
import socket_game from '../../plugins/game.io'

@Component
export default class ProfilePreview extends Vue {
  
  @Prop({ type: Object, default: new User() })
  user!: LightUser

  @Prop({ type: Number, default: -1 })
  meId!: Number

  redirectToUserProfile(userNick: string) {
    if (userNick)
      this.$router.push("/users/" + userNick)
  }

  initiatePongRequest() {
    if (socket_game.connected == false)
      socket_game.connect()
    socket_game.emit('newPrivate', this.user)
  }

  goToMessage(userNick: string) {
    if (userNick)
      this.$router.push("/privateMessage/" + userNick)
  }

  closeCard() {
    this.$emit("closeCard")
  }
}
</script>