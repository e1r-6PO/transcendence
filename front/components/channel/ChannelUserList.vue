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
        <v-list-item-title v-text="user.nickName" class="text-h6" style="margin-top: 14px" :style="'color:' + getUserTextColor(i)" />
          <v-list-item-subtitle v-text="user.channelStatus" align="right" style="margin-top: 0px" :style="'color:' + getUserTextColor(i)" />
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator';
import Vue from 'vue'
import { ChannelUser } from '../../assets/Classes-ts/ChannelUser';

@Component
export default class ChannelUserList extends Vue {
  

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
  }

  redirectToUserProfile(userNick: string) {
    this.$router.push("/users/" + userNick)
  }

  getUserTextColor(i: number): string {
    if (i == this.userFocus)
      return '#9142c7'
    return 'white'
  }
}
</script>