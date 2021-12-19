<template>
<v-container
  fluid 
  fill-height
 >
      <AlertError :state="alert"> {{ alertText }} </AlertError>
  <v-row style="height: 100%">

    <v-col cols="12" sm="3" class="border">
      <CreateChannelBtn class="pb-2"/>
      <JoinChannelBtn />
      <v-divider
        class="side-bar" 
        color="#ffa768"
        style="margin-bottom: 14.5px; max-height: 5px; height: 3px"
      >
      </v-divider>
      
      <ChannelList class="mt-4" :state="true" />
      <!-- <v-card v-for="(channel, i) in channList" :key="channList[i]"
        tile
        @click="redirectToChannel(channel)"
      >
        <v-card-text>
          {{ channel }}
        </v-card-text>
        <v-divider></v-divider>
      </v-card> -->
    </v-col>

    <v-col cols="12" sm="6" class="border">

    </v-col>

    <v-col cols="12" sm="3">
      <!-- <v-card v-for="(channel, i) in channList" :key="channList[i]"
        tile
        @click="redirectToChannel(channel)"
      >
        <v-card-text>
          {{ channel }}
        </v-card-text>
        <v-divider></v-divider>
      </v-card> -->
    </v-col>
  </v-row>
</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { ChannAccess, Messages } from '../../assets/Messages'
import { LightUser, User } from '../../assets/User'
import CreateChannelBtn from '../../components/channel/CreateChannelBtn.vue'
import JoinChannelBtn from '../../components/channel/JoinChannelBtn.vue';
import ChannelList from '../../components/channel/ChannelList.vue';
import AlertError from '../../components/AlertError.vue';

export default Vue.extend({
  components: { CreateChannelBtn, JoinChannelBtn, ChannelList },
  middleware: 'login',

  data() {
    return {
      channList: [],
      alertText: "",
      alert: false,
    }
  },

  async mounted() {
    if (this.$route.query['error'] && this.$route.query['error'] != "")
      this.activeAlert(this.$route.query['error'])
    var ret = await this.$axios.get('/api/chat/myChannel')
    this.channList = ret.data
  },

  methods: {

    redirectToChannel(channName: string) {
        this.$router.push('/chat/' + channName)
    },
    
    activeAlert(error: any)
    {
        this.alertText = error
        this.alert = true
        setTimeout(() => {
          this.alert = false
      }, 2000)
    }
  },
})
</script>

<style scoped>

.border {
  border-right: 1px solid grey;
}

.side-bar {
  border-right: 3px solid #ffa768 !important;
  box-shadow: inset -50px 0px 17px -45px #fc6500, 0px 0px 17px 7px #fc6500 !important;
}

</style>
