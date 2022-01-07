<template>
<v-container
  style="overflow-y: hidden !important"
  class="body"
  fluid 
  fill-height
>
  <AlertError style="margin-top: 10px" @end="onEnd" :textError="alertText" :state="alert"> {{ alertText }} </AlertError>
  <v-app-bar
    color="#181818"
    height="130"
    flat
    fixed
    clipped-left
  >
    <BasicBtn
      style="margin-top: 80px"
      content="mdi-forum"
      v-on:click="channelDrawer = !channelDrawer">
    </BasicBtn>
    <v-spacer />
    <img v-if="user.picture != ''"
      v-on:bind="user"
      v-on:change="updateActive"
      :src=user.picture
      style="margin-top: 80px; margin-right: 5px"
      :class="user.isActive == true ? 'profile-picture-active' : 'profile-picture-inActive'"
      width="30"
    />
    <h3 class="neonText" style="color: white; margin-top: 80px">{{ user.nickName }}</h3>

    <v-btn
      class="foreground_element neon-button"
      style="margin-top: 80px; margin-left: 5px"
      rounded
      text
      color="#ffffff"
      @click="initiatePongRequest()"
    >
      Play
    </v-btn>

    <v-spacer />
    <BasicBtn
      style="margin-top: 80px"
      content="mdi-account-group"
      v-on:click="userDrawer = !userDrawer">
    </BasicBtn>
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
          <BasicBtn content="mdi-close" v-on:click="channelDrawer = !channelDrawer"></BasicBtn>
          <v-spacer />
          <CreateChannelBtn @error="activeAlert" class="pr-5 pb-3"/>
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
      style="padding-top: 70px"
    >
    <v-row align="center" justify="center" class="pl-4 pr-5 pt-7">
      <ChannelLeaveBtn @refreshUser="updateToken" class="pl-5 pb-3"> </ChannelLeaveBtn>
      <v-spacer/>
      <BasicBtn content="mdi-close" v-on:click="userDrawer = !userDrawer"></BasicBtn>
    </v-row>
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
            @click="isYourMsg(msg) ? '' : redirectToUserProfile(msg.senderNick)"
            :style="isYourMsg(msg) ? 'float: right; margin-left: 20px !important; right: 0' : 'float: left; margin-right: 20px !important; left: 0px'"
            style="margin-top: 0px; border-radius: 30px; position: absolute; bottom: 0px;"
            width="30"
            :src="msg.picture" 
          />
          <v-card
            v-if="msg.type == 'message'"
            v-on:click="redirectToGame(msg.game_id)"
            class="bubble"
            :class="isYourMsg(msg) ? 'bubble bubble_right' : 'bubble bubble_left'"
            :color="isYourMsg(msg) ? '#1982FC' : '#ffffff'"
            style="min-width: 70px; max-width: 400px !important; margin-top: 20px"
          >
            <v-card-subtitle
              style="padding-bottom: 0px; color: white"
              v-text="msg.sender.nickName"
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
              v-text="formateTime(msg.date)"
              class="text-right"
            >
            </v-card-subtitle>
          </v-card>

          <!-- if the message is a game -->
          <v-card
            v-if="msg.type == 'game'"
            class="bubble"
            :color="getGameColor(msg)"
            style="margin-top: 20px; float: center !important"
          >
            <div v-if="msg.type == 'game'">
              <BasicBtn v-if="msg.game_state == 'pending' && !isYourMsg(msg)" content="mdi-check" v-on:click="acceptGame(msg)"></BasicBtn>
              <BasicBtn v-if="msg.game_state == 'pending'" content="mdi-close" v-on:click="denyGame(msg)"></BasicBtn>
            </div>
            <v-card-subtitle
              style="padding-bottom: 5px; padding-top: 0px; color: white"
              v-text="formateTime(msg.date)"
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
import { PrivateMessages } from '../../assets/Classes-ts/PrivateMessages'
import { LightUser, User } from '../../assets/Classes-ts/User'
import { ChannelUser } from '../../assets/Classes-ts/ChannelUser'
import { io, Socket } from "socket.io-client";
import ChannelList from '../../components/channel/ChannelList.vue';
import ChannelUserList from '../../components/channel/ChannelUserList.vue';
import CreateChannelBtn from '../../components/channel/CreateChannelBtn.vue';
import BasicBtn from '../../components/channel/button/BasicBtn.vue';
import ChannelLeaveBtn from '../../components/channel/ChannelLeaveBtn.vue';
import AlertError from '../../components/AlertError.vue';
import { ChannelUserStatus } from '../../assets/Classes-ts/ChannelUser';
import ChannelSettings from '../../components/channel/ChannelSettings.vue';

import socket_chat from '../../plugins/chat.io';
import socket_active from '../../plugins/active.io';
import socket_game from '../../plugins/game.io';

export default Vue.extend({
  components: { CreateChannelBtn, ChannelList, ChannelUserList, BasicBtn,
      ChannelLeaveBtn, ChannelSettings, AlertError },
  middleware: 'login',

  data() {
    return {
      message: '',
      messagesArray: new Array<PrivateMessages>(),
      me: new User(),
      nbMsg: -1,
      userDrawer: false,
      channelDrawer: false,
      userFocus: false,
      channelFocus: false,
      createFocus: false,
      alert: false,
      alertText: "",
      tokenUser: 1,
      user: new LightUser(),
      updateActive: false,
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
    var ret = await this.$axios.$get('/api/users/' + this.$route.params.slug)
    this.user = ret
    socket_chat.connect();
    this.me = await this.$axios.$get('/api/profile/me')
    this.messagesArray = await this.$axios.$get('/api/mp/' + this.$route.params.slug + '/messages')
    this.scrollToEnd()
    socket_chat.on('privateMessage', (msg: PrivateMessages) => {
      this.messagesArray.push(msg)
      this.nbMsg = this.messagesArray.length
    })
    socket_game.on('privateMessage', (msg: PrivateMessages) => {
      this.messagesArray.push(msg)
      this.nbMsg = this.messagesArray.length
    })
    socket_game.on('updateMessage', (msg: PrivateMessages) => {
      if (msg.type == "game") { // en theorie tout le temps game
        var c_msg: PrivateMessages | undefined = this.messagesArray.find(element => element.id == msg.id)
        if (c_msg != undefined)
          c_msg.game_state = msg.game_state
      }
    })
    socket_active.on("active", (userChange: LightUser) => {
          if (userChange.id == this.user.id)
          {
            this.user.isActive = true        
            this.updateActive = !this.updateActive
          }
      })
      socket_active.on("inactive", (userChange: LightUser) => {
          if (userChange.id == this.user.id)
          {
            this.user.isActive = false        
            this.updateActive = !this.updateActive
          }
      })
  },

  methods: {
    sendMessage(): void {
      var newMsg = new PrivateMessages()
      newMsg.sender = this.me
      newMsg.picture = this.me.picture
      newMsg.message = this.message
      newMsg.date = new Date()
      newMsg.target = new User()
      newMsg.type = "message"
      this.messagesArray.push(newMsg)
      socket_chat.emit('privateMessageToServer', this.message, this.$route.params.slug)
      socket_chat.on('MuteError', (msg: string) => {
        this.activeAlert(msg)
      })
      this.message = ''
    },

    initiatePongRequest() {
      if (socket_game.connected == false)
        socket_game.connect()
      socket_game.emit('newPrivate', this.user)
    },

    acceptGame(msg: PrivateMessages) {
      socket_game.emit('acceptGame', {id: msg.game_id})
    },

    denyGame(msg: PrivateMessages) {
      socket_game.emit('denyGame', {id: msg.game_id})
    },

    formateTime(time: Date): string {
      var newTime: Date = new Date(time)
      return newTime.getHours() + ':' + (newTime.getMinutes() < 10 ? '0' + newTime.getMinutes() : newTime.getMinutes())
    },

    getGameColor(msg: PrivateMessages) {
      if (msg.game_state == "pending")
        return "#FFA500"
      if (msg.game_state == "finish") {
        if (msg.winner.id == this.me.id)
          return "#b8a435"
        return "#c7401e"
      }
      return "#FF0000"
    },

    isYourMsg(msg: PrivateMessages): boolean {
      if (this.me.nickName == msg.sender.nickName)
        return (true)
      return (false)
    },

    redirectToUserProfile(userNick: string) {
      this.$router.push("/users/" + this.$route.params.slug)
    },

    redirectToGame(game_id: string) {
      this.$router.push("/game/" + game_id)
    },

    scrollToEnd() {    	
      window.scrollTo(0, document.body.scrollHeight);
    },

    redirectToChannel(channName: string) {
      this.$router.push('/chat/' + channName)
    },

    clearMessage() {
      this.message = ""
    },

    activeAlert(error: any)
    {
        this.alertText = error
        this.alert = true
    },

    onEnd() {
      this.alert = false
    },

    updateUser() {
    },

    updateToken() {
      this.tokenUser += 1
      socket_chat.emit('refreshUser', this.$route.params.slug)
    },
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

.neonText {
  color: #e6ffff;
  text-shadow:
    0 0 7px #f27719,
    0 0 8px #f27719,
    0 0 9px #f27719 !important;
}

.profile-picture {
  border: 2px solid #a5fafa !important;
  box-shadow: 0px 0px 10px 0px #63f3f3 !important;
  border-radius: 100%
}

</style>
