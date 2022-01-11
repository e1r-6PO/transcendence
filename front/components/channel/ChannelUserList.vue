<template>
  <v-list v-if="userList.length > 0" dense>
    <slot> </slot>
    <div v-for="(user, i) in userList"
      class="neon-button"
      style="border-radius: 15px; margin-top: 10px"
      :key="`user-${i}`"
      link
      v-on:change="refreshList()"
      v-on:bind="userList"

    >
      <ChannelUserCard
        @clicked="openPreview"
        @focus="focusCard"
        @leave="leaveCard"
        @refreshUser="refreshUser"
        :ownerAction="ownerAction"
        :status="status"
        :user="user"
        :updateActive="updateActive" />
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
        :user="user"
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
  
  userList: Array<ChannelUser> = new Array<ChannelUser>()
  activeUser: Map<number, LightUser> = new Map()
  userFocus: number = -1
  updateActive: boolean = false
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
      socket_active.on("active", (user: LightUser) => {
        this.activeUser.set(user.id, user)
          this.switchState(user, true)
          this.updateActive = !this.updateActive
      })
      socket_active.on("inactive", (user: LightUser) => {
        this.activeUser.delete(user.id)
          this.switchState(user, false)
            this.updateActive = !this.updateActive
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

  refreshUser() {
    this.$emit("refreshUser")
  }
}
</script>

<style>
@import '../../assets/Classes-scss/neon_effects.scss';

</style>