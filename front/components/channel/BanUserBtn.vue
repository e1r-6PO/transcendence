<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
    content-class="custom-dialog-card-shadow"
  >
  <template v-slot:activator="{ }">
    <BasicBtn
      v-on:click="ban ? switchBan() : dialog = true"
      :content="ban ? 'mdi-plus' : 'mdi-cancel'"
      :iconSize="22"
      :smaller="small"
    />
  </template>
    <v-card class="dialog_card">
      <v-card-title class="white--text">
        <span class="text-h5">ban time</span>
        <v-spacer />
        <BasicBtn v-on:click="dialog = false" content="mdi-close" neonColor="red" />
      </v-card-title>
      <v-card-text class="pt-4 pb-6 pl-8 pr-8">
        <Select :itemsList="timeList" v-model="timeChoose" placeholder="Ban time" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <BasicBtn v-on:click="switchBan()" :isText="true" content="Comfirm" :disable="timeChoose == ''" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
      
<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator';
import Vue from 'vue'
import { ChannelUser, ChannelUserStatus } from '../../assets/Classes-ts/ChannelUser';

@Component
export default class BanUserBtn extends Vue{
  
  @Prop({ type: String, default: ""})
  userName!: string

  @Prop({ type: Boolean, default: false})
  ban!: Boolean

  @Prop({ type: Boolean, default: false})
  small!: Boolean

  banTime: Date = new Date()
  dialog: boolean = false
  timeChoose: string = ""
  timeList: Array<string> = ['1 minute', '10 minutes', '1 hours', '6 hours', '12 hours', '1 day', '3 day', '1 week', '1 month', '6 month', '1 year']
  
  async switchBan() {
    if (!this.ban)
      this.setTime()
    const ret = await this.$axios.patch('/api/chat/' + this.$route.params.slug + '/action/ban?userName=' + this.userName + '&time=' + this.banTime)
      .catch(function(error) {
        return error.response
    })
    if (ret.status == 403)
      this.activeAlert(ret.data.message)
    else if (ret.status == 404)
      this.$router.push('/chat?error=' + ret.data.message)
    else
    {
      console.log("refresh")
      this.$emit('refreshUser')
    }this.dialog = false
    this.timeChoose = ""
  }

  setTime() {
    this.banTime = new Date()
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
        this.banTime.setMinutes(this.banTime.getMinutes() + value)
    if (type == 'hour')
        this.banTime.setHours(this.banTime.getHours() + value)
    if (type == 'day')
      this.banTime.setDate(this.banTime.getDate() + value)
    if (type == 'month')
      this.banTime.setMonth(this.banTime.getMonth() + value)
    if (type == 'year')
      this.banTime.setFullYear(this.banTime.getFullYear() + value)
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
