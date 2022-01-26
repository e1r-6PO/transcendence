<template>
<v-container
  style="overflow-y: hidden !important"
  class="body"
  fluid 
  fill-height
>
  <AlertError style="margin-top: 0px" @end="onEnd" :textError="alertText" :type="alertType" :time="alertTime" :state="alert"> {{ alertText }} </AlertError>
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
    <ProfilePicture @click="redirectToUserProfile" :src="user.picture" :isActive="user.isActive" :currentGame="user.currentGame" size="42" style="margin-top: 80px; margin-right: 5px"/>
    <h3 class="neonText" style="color: white; margin-top: 80px">{{ user.nickName }}</h3>

    <PrivateGameBtn
      style="margin-top: 80px; margin-left: 5px"
      @error="activeAlert" 
      :user="user"
    />

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
          <BasicBtn content="mdi-close" neonColor="red" @click="channelDrawer = !channelDrawer"></BasicBtn>
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
      <v-row align="center" justify="center" class="pl-4 pr-5 pt-7 mb-8">
        <BasicBtn @click="goToChannelHub()" @refreshUser="updateToken" isText content="Chanel hub" :height="50" class="ml-5 mt-2" />
        <v-spacer/>
        <BasicBtn content="mdi-close" neonColor="red" @click="userDrawer = !userDrawer"></BasicBtn>
      </v-row>
      <v-divider class=" mb-4 divider" style="border-color: #f27719;"> </v-divider>
      <div
        class="neon-button"
        style="border-radius: 15px; margin-top: 10px;"
        justify="center"
      >

      <ChannelUserCard @clicked="userPreview = !userPreview" @focus="switchFocusCard" @leave="userPreviewFocus = false" :user="user" isMp />
      <div
        align="center"
        justify="center"
      >
      <v-icon
        @click="!userPreview"
        @focus="switchFocusCard"
        :color="userPreviewFocus? '#9142c7' : 'white'"
        align="center"
      >
        {{ userPreview ? 'mdi-menu-up' : 'mdi-menu-down' }}
      </v-icon>
      </div>
      <ProfilePreview v-if="userPreview" />
      </div>
    </v-navigation-drawer>

    <v-spacer />
    <v-col cols="12" sm="11">
      <v-card
        color="#181818"
        flat
        class="pt-10"
      >
        <div v-for="(msg, i) in messagesArray"
          :key="i"
          class="overflow-y-auto"
          style="margin-top: 0px; position: relative; padding-right: 45px; padding-left: 45px; padding-bottom: 15px"
        >
         <ProfilePicture
            @click="redirectToUserProfile"
            size="30"
            :src="msg.picture"
            v-if="msg.type == 'default'"
            :style="isYourMsg(msg) ? 'float: right; margin-left: 20px !important; right: 0px' : 'float: left; margin-right: 20px !important; left: -10px'"
            style="margin-top: 0px; border-radius: 30px; position: absolute; bottom: 0px;"
          />

          <!-- if the message is a normal message -->
          <OtherBubbleMsg v-if="!isYourMsg(msg) && isNormaMsg(msg)" :msg="msg"/>
          <MyBubbleMsg v-else-if="isYourMsg(msg) && isNormaMsg(msg)" :msg="msg" />
          <GameMessage v-if="isGameMsg(msg)" :msg="msg" :meId="me.id" :ownerMsg="isYourMsg(msg)" />
          <div v-if="!isYourMsg(msg) && isServerMsg(msg)" align="center">
            <v-card class="bubble_server" align="center" justify="center" height="45">
                <v-card-text
                  class="white--text pt-2 pb-0"
                  v-text="msg.message"
                />
                <v-card-subtitle
                  class="text-right white--text mt-n7 font-italic"
                  v-text="formateTime(msg.time)"
                />
            </v-card>
          </div>

        </div>
      </v-card>
    </v-col>
    <v-spacer />
  </v-row>
  
  <v-footer app inset color="#181818">
    <TextField @enterPress="sendMessage" v-model="message" :disable="disableInput()"  :append_outer_icon="disableInput() ? '' : 'mdi-send'" placeholder="Message" class="mb-2" />
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

import copyLightUser from '../../plugins/copyUser'
import formateTime from '../../plugins/formateTime'

import socket_chat from '../../plugins/chat.io';
import socket_active from '../../plugins/active.io';
import socket_game from '../../plugins/game.io';
import { Friendship, FriendshipStatus } from '../../assets/Classes-ts/Friendship';

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
      alertType: "error",
      alertTime: 4,
      tokenUser: 1,
      user: new LightUser(),
      updateActive: false,
      userPreview: false,
      userPreviewFocus: false,
      relation: Friendship,
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
    this.user = await this.$axios.$get('/api/users/' + this.$route.params.slug)
    socket_chat.connect();
    this.me = await this.$axios.$get('/api/profile/me')
    this.relation = await this.$axios.$get('/api/friends/' + this.user.id)
    var ret = await this.$axios.get('/api/mp/' + this.$route.params.slug + '/messages')
    
    console.log(this.relation)
    this.messagesArray = ret.data
    this.nbMsg = this.messagesArray.length
    
    socket_chat.on("privateMessage", (msg: PrivateMessages) => {
      if (msg.sender.nickName == this.$route.params.slug || (msg.sender.id == this.me.id && msg.target.id == this.user.id))
      {
        this.messagesArray.push(msg)
        this.nbMsg = this.messagesArray.length
      }
    })
    socket_game.on("privateMessage", (msg: PrivateMessages) => {
      this.messagesArray.push(msg)
      this.nbMsg = this.messagesArray.length
    })
    socket_game.on('updateMessage', (msg: PrivateMessages) => {
      if (msg.type == "game") { // en theorie tout le temps game
        var c_msg: PrivateMessages | undefined = this.messagesArray.find(element => element.id == msg.id)
        if (c_msg != undefined) {
          c_msg.game_state = msg.game_state
          c_msg.game_id = msg.game_id
        }
      }
    })
    socket_active.on('stateChanged', (user: LightUser) => {
      if (user.id == this.user.id)
        copyLightUser(this.user, user)
    })
    socket_game.on('notificationPrivateGameInviteFailed', (arg: any) => {
      if (arg['user'].nickName && arg['user'].id == this.user.id)
        this.activeAlert("The user is offline.", 'info')
    })
  },

  methods: {
    sendMessage(): void {
      if (!this.checkMsg())
        return
      var newMsg = new PrivateMessages()
      newMsg.sender = this.me
      newMsg.picture = this.me.picture
      newMsg.message = this.message
      newMsg.time = new Date()
      newMsg.target = new User()
      newMsg.type = "message"
      socket_chat.emit('privateMessageToServer', this.$route.params.slug, this.me.nickName, this.message)
      socket_chat.on('blocked', (msg: string) => {
        this.activeAlert(msg, 'warning')
      })
      this.message = ''
    },

    initiatePongRequest() {
      if (socket_game.connected == false)
        socket_game.connect()
      socket_game.emit('newPrivate', this.user)
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

    redirectToUserProfile() {
      this.$router.push("/users/" + this.$route.params.slug)
    },

    redirectToGame(game_id: string, game_state: string) {
      if (game_state == "canceled")
        null//raise notification
      else
        this.$router.push("/game/" + game_id)
    },

    scrollToEnd() {    	
      window.scrollTo(0, document.body.scrollHeight);
    },

    goToChannelHub() {
      this.$router.push('/chat')
    },

    activeAlert(error: any, type: string)
    {
        this.alertText = error
        this.alertType = type
        this.alertTime = 4
        this.alert = true
    },

    onEnd() {
      this.alert = false
    },

    updateToken() {
      this.tokenUser += 1
      socket_chat.emit('refreshUser', this.$route.params.slug)
    },

    checkMsg(): boolean {
      this.message = this.message.trim()
      if (this.message.length > 180)
      {
        this.activeAlert("Messages are limited at 180 character.", "warning")
        return false
      }
      if (this.message == "")
        return false
      return true
    },

    focusCard(id: number) {
      this.userPreviewFocus = true
    },

    leaveCard(id: number) {
      this.userPreviewFocus = false
    },

    switchFocusCard() {
      if (this.userPreviewFocus == false)
        this.userPreviewFocus = true
    },

    isServerMsg(msg: PrivateMessages) {
      return (msg.type == "server")
    },
    
    isGameMsg(msg: PrivateMessages) {
      return (msg.type == "game")
    },

    isNormaMsg(msg: PrivateMessages) {
      return (msg.type == "message")
    },

    disableInput(): boolean {
      if (this.message.length > 180)
        return true
      if (this.relation.status == FriendshipStatus.BLOCKED)
        return true
      return false
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
