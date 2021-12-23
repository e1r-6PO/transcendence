<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
  >
  <template v-slot:activator="{ }">
    <BasicBtn
      v-on:click="mute ? switchMute() : dialog = true"
      :content="mute ? 'mdi-volume-off' : 'mdi-volume-high'"
      :smaller="small"
    />
  </template>
    <v-card style="background-color: #181818">
      <v-card-title class="white--text">
        <span class="text-h5">Mute time</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-select
            v-model="timeChoose"
            :items="timeList"
            class="custom-select-color"
            placeholder="Channel type"
            color="yellow"
            background-color="#181818"
            item-color="yellow"
            hide-details
            filled
            dense
            rounded
          />
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <BasicBtn v-on:click="dialog = false" :isText="true" content="Close" />
        <BasicBtn v-on:click="switchMute()" :isText="true" content="Comfirm" :disable="timeChoose == ''" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
      
<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator';
import Vue from 'vue'
import { ChannelUser, ChannelUserStatus } from '../../assets/Classes-ts/ChannelUser';

@Component
export default class MuteUserBtn extends Vue{
  
  @Prop({ type: String, default: ""})
  userName!: string

  @Prop({ type: Boolean, default: false})
  mute!: Boolean

  @Prop({ type: Boolean, default: false})
  small!: Boolean

  muteTime: Date = new Date()
  dialog: boolean = false
  timeChoose: string = ""
  timeList: Array<string> = ['1 minute', '10 minutes', '1 hours', '6 hours', '12 hours', '1 day', '3 day', '1 week', '1 month', '6 month', '1 year']
  
  async switchMute() {
    if (!this.mute)
      this.setTime()
    
    const ret = await this.$axios.patch('/api/chat/' + this.$route.params.slug + '/mute?userName=' + this.userName + '&time=' + this.muteTime)
      .catch(function(error) {
        return error.response
    })
    if (ret.status == 403)
      this.activeAlert(ret.data.message)
    else if (ret.status == 404)
      this.$router.push('/chat?error=' + ret.data.message)
    else
      this.$emit('refreshUser')
    this.dialog = false
    this.timeChoose = ""
  }

  setTime() {
    this.muteTime = new Date()
    switch (this.timeChoose) {
      case this.timeList[0]:
        this.addTime('minute', 1);
        break;
      case this.timeList[1]:
        this.addTime('minute', 10);
        break;
      case this.timeList[2]:
        this.addTime('hour', 1);
        break;
      case this.timeList[3]:
        this.addTime('hour', 6);
        break;
      case this.timeList[4]:
        this.addTime('hour', 12);
        break;
      case this.timeList[5]:
        this.addTime('day', 1);
        break;
      case this.timeList[6]:
        this.addTime('day', 3);
        break;
      case this.timeList[7]:
        this.addTime('day', 7);
        break;
      case this.timeList[8]:
        this.addTime('month', 1);
        break;
      case this.timeList[9]:
        this.addTime('month', 6);
        break;
      case this.timeList[10]:
        this.addTime('year', 1);
        break;
      default:
        break;
      }
  }

  addTime(type: string, value: number) {
    if (type == 'minute')
        this.muteTime.setMinutes(this.muteTime.getMinutes() + value)
    if (type == 'hour')
        this.muteTime.setHours(this.muteTime.getHours() + value)
    if (type == 'day')
      this.muteTime.setDate(this.muteTime.getDate() + value)
    if (type == 'month')
      this.muteTime.setMonth(this.muteTime.getMonth() + value)
    if (type == 'year')
      this.muteTime.setFullYear(this.muteTime.getFullYear() + value)
  }

  activeAlert(error: string)
  {
    this.$emit('error', error)
  }

  isAdmin() {
    return (ChannelUserStatus.ADMINISTRATOR)
  }
}
</script>
