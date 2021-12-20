<template>
  <v-list 
    color="rgb(255, 0, 0, 0)"
    dense
    >
    <slot></slot>
    <v-list-item
      class="neon-button text-center mb-2"
      style="border-radius: 15px"
      v-for="(channel, i) in channList"
      :key="channList[i]"
      link
      v-on:mouseover="channelFocus = i"
      v-on:mouseleave="channelFocus = -1"
      @click="redirectToChannel(channel)"
    >
      <v-list-item-content>
        <h4 :style="'color:' + getChannelTextColor(i)" >{{ channel }}</h4>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import CreateChannelBtn from '../../components/channel/CreateChannelBtn.vue'
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class ChannelList extends Vue {

  @Prop({ type: Boolean, default: false })
  state!: boolean
  
  channList: Array<string> = []
  channelFocus: number = -1

  async mounted() {
    var myChannelRet = await this.$axios.get('/api/chat/myChannel')
    this.channList = myChannelRet.data
  }

  redirectToChannel(channName: string) {
    this.$router.push('/chat/' + channName)
  }

  getChannelTextColor(i: number) : string {
    if (this.channelFocus == i)
      return '#9141c7'
    return 'white'
  }
}
</script>

<style>
@import '../../assets/Classes-scss/main_page.scss';
</style>