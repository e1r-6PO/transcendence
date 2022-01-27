<template>
<v-container
  fluid 
  fill-height
 >
  <AlertError @end="onEnd" :textError="alertText" :state="alert" :type="alertType"></AlertError>
  <v-row style="height: 100%">

    <v-col cols="12" sm="3" md="2" class="border">
      <h3 align="center" justify="center" class="white--text pb-3 pt-3 neonText" style="font-family: OrbitronM"> Your channels </h3>
    <v-divider class="mt-4 mb-4 divider" style="border-color: #f27719;"> </v-divider>
      <CreateChannelBtn @error="activeAlert" class="pb-2"/>
      <JoinChannelBtn @error="activeAlert" />

     
    <v-divider class="mt-4 mb-6 divider" style="border-color: #f27719;"> </v-divider>
      <ChannelList :state="true" />
    </v-col>

    <v-col cols="12" sm="5" md="7" class="border d-flex align-center">

    <iframe width="100%" height="315" src="https://www.youtube.com/embed/SqSuRdkglxM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </v-col>

    <v-col cols="12" sm="4" md="3">
      <ConnectedFriends />
    </v-col>
  </v-row>
</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { ChannAccess, Messages } from '../../assets/Classes-ts/Messages'
import { LightUser, User } from '../../assets/Classes-ts/User'
import CreateChannelBtn from '../../components/channel/CreateChannelBtn.vue'
import JoinChannelBtn from '../../components/channel/JoinChannelBtn.vue';
import ChannelList from '../../components/channel/ChannelList.vue';
import AlertError from '../../components/AlertError.vue';

import { Component } from 'nuxt-property-decorator';

@Component({
  // components: { CreateChannelBtn, JoinChannelBtn, ChannelList },
  middleware: 'login',
  head: { title: 'Chat'}
})
export default class extends Vue {

  alertText = ""
  alert = false
  alertType = "error"

  async mounted() {
    if (this.$route.query['error'] && this.$route.query['error'] != "")
      this.activeAlert(this.$route.query['error'])
    else if (this.$route.query['success'] && this.$route.query['success'] != "")
      this.activeSucess(this.$route.query['success'])
    else if (this.$route.query['event'] && this.$route.query['event'] != "")
      this.activeEvent(this.$route.query['event'])
  }

    redirectToChannel(channName: string) {
        this.$router.push('/chat/' + channName)
    }
    
    activeAlert(error: any) {
      this.alertText = error
      this.alertType = "error"
      this.alert = true
      if (this.$route.path != '/chat')
        this.$router.replace('/chat')
    }

    activeSucess(success: any) {
      this.alertText = success
      this.alertType = "success"
      this.alert = true
      this.$router.replace('/chat')
    }
    
    activeEvent(success: any) {
      this.alertText = success
      this.alertType = "info"
      this.alert = true
      this.$router.replace('/chat')
    }

    onEnd() {
      this.alert = false
    }
}
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
