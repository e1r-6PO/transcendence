<template>
<v-card
  class="bubble bubble bubble_right" 
  color="#1982FC"
  style="min-width: 70px; max-width: 400px !important; margin-top: 20px; margin-bottom: 5px"
>
  <v-card-subtitle
    style="padding-bottom: 0px; padding-top: 10px; color: white; font-weight: bold"
    v-text="msg.senderNick"
    class="text-left"
  >
  </v-card-subtitle>
  <v-card-text
    style="padding-bottom: 0px; padding-right: 55px; color: white"
    v-text="msg.message"
  />
  <v-card-subtitle
    style="padding-bottom: 5px; padding-top: 0px; color: white; font-style: italic"
    v-text="formateTime(msg.time)"
    class="text-right"
  />
</v-card>
  
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator'
import Vue from 'vue'
import { Messages } from '../../assets/Classes-ts/Messages'

@Component
export default class MyBubbleMsg extends Vue {
  
  @Prop({ type: Object, default: new Messages() })
  msg!: Messages

  formateTime(time: Date): string {
    var newTime: Date = new Date(time)
    return newTime.getHours() + ':' + (newTime.getMinutes() < 10 ? '0' + newTime.getMinutes() : newTime.getMinutes())
  }
}
</script>