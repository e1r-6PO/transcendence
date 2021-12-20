<template>
<v-container
  style="overflow-y: hidden !important"
  class="body"
  fluid 
  fill-height
>
  <v-app-bar
    color="#181818"
    height="130"
    flat
    fixed
    clipped-left
  >
    <CloseBtn
      style="margin-top: 80px"
      customMdi="mdi-forum"
      v-on:click="channelDrawer = !channelDrawer">
    </CloseBtn>
    <v-spacer />
    <h3 class="neonText" style="color: white; margin-top: 80px">{{ $route.params.slug }}</h3>
    <v-spacer />
    <CloseBtn
      style="margin-top: 80px"
      customMdi="mdi-account-group"
      v-on:click="userDrawer = !userDrawer">
    </CloseBtn>
  </v-app-bar>
  <v-row style="height: 100%; margin-top: 2.5%">

    <v-navigation-drawer
      v-model="channelDrawer"
      app
      left
      temporary
      style="padding-top: 65px"
      color="#181818"
    >
      <ChannelList class="mt-4" :state="true">
         <v-subheader class="mt-3 mb-8">
          <CloseBtn customMdi="mdi-close" v-on:click="channelDrawer = !channelDrawer"></CloseBtn>
          <v-spacer />
          <CreateChannelBtn class="pr-5 pb-3"/>
        </v-subheader>
        <v-divider class="mt-4 mb-4 divider" style="border-color: #f27719;"> </v-divider>
      </ChannelList>
    </v-navigation-drawer>

    <v-navigation-drawer
      v-model="userDrawer"
      app
      right
      temporary
      color="#181818"
      style="padding-top: 65px"
    >
      <ChannelUserList class="mt-4">
        <v-subheader class="mt-3 mb-8">
          <ChannelSettingBtn class="pl-5 pb-3"> </ChannelSettingBtn>
          <v-spacer />
          <CloseBtn customMdi="mdi-close" v-on:click="userDrawer = !userDrawer"></CloseBtn>
         </v-subheader>
        <v-divider class="mt-4 mb-4 divider" style="border-color: #f27719;"> </v-divider>
      </ChannelUserList>
    </v-navigation-drawer>

    <v-spacer />
    <v-col cols="12" sm="11">
      <v-card
        color="#181818"
        flat
        class="pt-4"
      >
        <div v-for="(msg, i) in messagesArray"
          :key="i"
          class="overflow-y-auto"
          style="margin-top: 0px; position: relative; padding-right: 45px; padding-left: 45px; padding-bottom: 15px"
        >
          <v-img
            :style="isYourMsg(msg) ? 'float: right; margin-left: 20px !important; right: 0' : 'float: left; margin-right: 20px !important; left: 0'"
            style="margin-top: 0px; border-radius: 30px; position: absolute; bottom: 0px;"
            width="30"
            :src="msg.picture"
            @click="redirectToUserProfile(msg.senderNick)"
          >
          </v-img>
          <v-card
            class="bubble"
            :class="isYourMsg(msg) ? 'bubble bubble_right' : 'bubble bubble_left'"
            :color="isYourMsg(msg) ? '#1982FC' : '#ffffff'"
            style="min-width: 70px; max-width: 400px !important; margin-top: 20px"
          >
            <v-card-subtitle
              style="padding-bottom: 0px; color: white"
              v-text="msg.senderNick"
              class="text-left"
            >

            </v-card-subtitle>
          <v-card-text
            style="padding-bottom: 0px; padding-right: 55px; color: white"
            v-text="msg.message"
          >
          </v-card-text>
          <v-card-subtitle
            style="padding-bottom: 5px; padding-top: 0px; color: white"
            v-text="formateTime(msg.time)"
            class="text-right"
          >
          </v-card-subtitle>
          </v-card>
        </div>
      </v-card>
    </v-col>
    <v-spacer />
  </v-row>
  
  <v-footer app inset color="#181818">
    <v-text-field
      v-model="message"
      class="text-field-nick-neon custom-placeholder-color custom-input-color"
      style="margin-top: 3%"
      placeholder="Message"
      background-color="#181818"
      color="blue"
      hide-details
      filled
      dense
      rounded
      autofocus
      @keypress.enter="sendMessage"
    >
    <template v-slot:append>
      <v-icon v-if="message.length > 0" @click="clearMessage()" color="#b8a435"> mdi-close-circle </v-icon>
    </template>
      <v-icon slot="append-outer" color="#b8a435" class="mr-2"> mdi-send </v-icon>
    </v-text-field>
  </v-footer>
</v-container>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Messages } from '../../assets/Classes-ts/Messages'
import { LightUser, User } from '../../assets/Classes-ts/User'
import { ChannelUser } from '../../assets/Classes-ts/ChannelUser'
import { io, Socket } from "socket.io-client";
import ChannelList from '../../components/channel/ChannelList.vue';
import ChannelUserList from '../../components/channel/ChannelUserList.vue';
import CreateChannelBtn from '../../components/channel/CreateChannelBtn.vue';
import CloseBtn from '../../components/channel/button/CloseBtn.vue';
import ChannelSettingBtn from '../../components/channel/ChannelSettingBtn.vue';

const socket_chat = io("http://localhost:3000/chat", { withCredentials: true});

export default Vue.extend({
  components: { CreateChannelBtn, ChannelList, ChannelUserList, CloseBtn, ChannelSettingBtn },
  middleware: 'login',

  data() {
    return {
      message: '',
      messagesArray: new Array<String>(),
      usersNick: new Map(),
      me: new User(),
      nbMsg: -1,
      channList: [],
      userList: new Array<ChannelUser>(),
      userDrawer: false,
      channelDrawer: false,
      userFocus: false,
      channelFocus: false,
      createFocus: false,
    }
  },

  updated() {
    if (this.nbMsg == this.messagesArray.length || this.nbMsg == -1)
    {
      this.scrollToEnd();
      this.nbMsg = 0;
    }
  },

  async mounted() {
    const ret = await this.$axios.$get('/api/chat/' + this.$route.params.slug + '/access')
      .catch(function (error) {
        return error.response
      })
    if (ret.status == 404)
      this.$router.push('/chat?error=Channel%20does%20not%20exist')
    else if (ret.status == 201)
    {
      socket_chat.connect();
      socket_chat.emit('joinChannel', this.$route.params.slug);
      this.me = await this.$axios.$get('/api/profile/me')
      this.messagesArray = await this.$axios.$get('/api/chat/' + this.$route.params.slug + '/messages')
      
      socket_chat.on('msgToClient', (msg: string) => {
        this.messagesArray.push(msg)
        this.nbMsg = this.messagesArray.length
      })
      var myChannelRet = await this.$axios.$get('/api/chat/myChannel')
      this.channList = myChannelRet.data
      var userListRet = await this.$axios.$get('/api/chat/' + this.$route.params.slug + '/users')
        .catch(function(error) {
          return error.response
        })
      if (userListRet.status == 403)
        this.$router.push('/chat')
      else
        this.userList = userListRet.data
    }
  },

  methods: {
    sendMessage(): void {
      socket_chat.emit('msgToServer', this.message, this.$route.params.slug)
      this.message = ''
    },

    formateTime(time: Date): string {
      var newTime: Date = new Date(time)
      return newTime.getHours() + ':' + (newTime.getMinutes() < 10 ? '0' + newTime.getMinutes() : newTime.getMinutes())
    },

    isYourMsg(msg: Messages): boolean {
      if (this.me.nickName == msg.senderNick)
        return (true)
      return (false)
    },

    redirectToUserProfile(userNick: string) {
      this.$router.push("/users/" + userNick)
    },

    scrollToEnd() {    	
      window.scrollTo(0, document.body.scrollHeight);
    },

    redirectToChannel(channName: string) {
      this.$router.push('/chat/' + channName)
    },

    clearMessage() {
      this.message = ""
    }
  }
})
</script>

<style scoped>
@import '../../assets/Classes-scss/main_page.scss';
@import '../../assets/Classes-scss/chat_bubble.scss';

body {
  overscroll-behavior: none !important;
  overflow-y: hidden !important;
}

.border {
  border-right: 1px solid grey;
}

.scrollable {
  overflow-y: scroll !important;
}

.neon-button {
  border: 3px solid #cd78ff !important;
  box-shadow: inset 0px 0px 20px 0px #a200ff, 0px 0px 20px 0px #a200ff !important;
}

.divider {
  border-bottom: 1px solid #ffa768 !important;
  height: 69px !important;
  box-shadow: inset 0px -5px 5px -5px #fc6500, 0px 0px 7px 1px #fc6500 !important;
}

.neonText {
  color: #e6ffff;
  text-shadow:
    0 0 7px #f27719,
    0 0 8px #f27719,
    0 0 9px #f27719 !important;
}

</style>
