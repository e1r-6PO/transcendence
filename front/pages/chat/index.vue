<template>
<v-container
  fluid 
  fill-height
 >
  <AlertError @end="onEnd" :textError="alertText" :state="alert" :type="alertType"></AlertError>
  <v-row style="height: 100%">

    <v-col cols="12" sm="3" class="border">
      <CreateChannelBtn @error="activeAlert" class="pb-2"/>
      <JoinChannelBtn @error="activeAlert" />
      <v-divider
        class="side-bar" 
        color="#ffa768"
        style="margin-bottom: 14.5px; max-height: 5px; height: 3px"
      >
      </v-divider>
      
      <ChannelList class="mt-4" :state="true" />
    </v-col>

    <v-col cols="12" sm="6" class="border">

    </v-col>

    <v-col cols="12" sm="3">
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

export default Vue.extend({
  components: { CreateChannelBtn, JoinChannelBtn, ChannelList },
  middleware: 'login',

  data() {
    return {
      alertText: "",
      alert: false,
      alertType: "error",
    }
  },

  async mounted() {
    if (this.$route.query['error'] && this.$route.query['error'] != "")
      this.activeAlert(this.$route.query['error'])
    else if (this.$route.query['success'] && this.$route.query['success'] != "")
      this.activeSucess(this.$route.query['success'])
    else if (this.$route.query['event'] && this.$route.query['event'] != "")
      this.activeEvent(this.$route.query['event'])
  },

  methods: {

    redirectToChannel(channName: string) {
        this.$router.push('/chat/' + channName)
    },
    
    activeAlert(error: any) {
      this.alertText = error
      this.alertType = "error"
      this.alert = true
    },

    activeSucess(success: any) {
      this.alertText = success
      this.alertType = "success"
      this.alert = true
    },
    
    activeEvent(success: any) {
      this.alertText = success
      this.alertType = "info"
      this.alert = true
    },

    onEnd() {
      this.alert = false
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
