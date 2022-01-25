<template>
  <v-list 
    color="rgb(255, 0, 0, 0)"
    dense
      @change="channList"
    >
    <slot></slot>
    <v-list-item
      class="neon-button text-center mb-2"
      style="border-radius: 15px"
      v-for="(channel, i) in channList"
      :key="`channList-${i}`"
      link
      @mouseover="channelFocus = i"
      @mouseleave="channelFocus = -1"
      @click="redirectToChannel(channel.channName)"
    >
      <v-list-item-content class="pb-1">
        <h4 class="mb-0 pt-3" style="font-family: OrbitronM" :style="'color:' + getChannelTextColor(i)" >{{ channel.channName }}</h4>
      <v-list-item-subtitle v-text="channel.channAccess" align="right" style="font-size: 10px" :style="'color:' + getChannelTextColor(i)" />
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Channel } from '../../assets/Classes-ts/Channel'
import { LightUser } from '../../assets/Classes-ts/User'
import socket_chat from '../../plugins/chat.io'

@Component
export default class ChannelList extends Vue {

  @Prop({ type: Boolean, default: false })
  state!: boolean
  
  channList: Array<Channel> = new Array<Channel>()
  channelFocus: number = -1
  me = new LightUser()

  async mounted() {
    if (socket_chat.connected == false)
      socket_chat.connect()
    var myChannelRet = await this.$axios.get('/api/profile/me/channels')
    this.channList = myChannelRet.data.channel

    var ret = await this.$axios.get('/api/profile/me')
    this.me = ret.data
    socket_chat.on('kickMe', (userId: number, channName: string) => {
      if (userId == this.me.id)
        this.deleteChannel(channName)
    })
    socket_chat.on('addMe', (userId: number, channel: Channel) => {
      if (userId == this.me.id)
        this.addChannel(channel)
    })
  }

  redirectToChannel(channName: string) {
    console.log(channName)
    this.$router.push('/chat/' + channName)
  }

  getChannelTextColor(i: number) : string {
    if (this.channelFocus == i)
      return '#9141c7'
    return 'white'
  }

  deleteChannel(channName: string) {
    var channId = this.channList.findIndex((channel) => channel.channName == channName);
    if (channId == -1)
      return
    this.channList.splice(channId, 1)
  }

  addChannel(chann: Channel) {
    var channId = this.channList.findIndex((channel) => channel.channName == chann.channName);
    if (channId != -1)
      return
    this.channList.push(chann)
  }
}
</script>

<style>
@import '../../assets/Classes-scss/main_page.scss';
</style>