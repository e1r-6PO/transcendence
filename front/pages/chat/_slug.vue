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
    <h3 class="neonText" style="color: white; margin-top: 80px">{{ $route.params.slug }}</h3>
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
          <BasicBtn v-on:click="channelDrawer = !channelDrawer" :width="40" neonColor="red" content="mdi-close" />
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
      style="padding-top: 65px"
    >
      <ChannelUserList
        @refreshUser="updateToken"
        :meId="me.id"
        :small="true"
        :refresh="tokenUser"
        class="mt-4"
      >
        <v-subheader class="mt-3 mb-8">
          <ChannelLeaveBtn v-if="isDefaultUser()" @refreshUser="updateToken" class="pl-3"> </ChannelLeaveBtn>
          <ChannelSettings v-if="isOwnerOrAdmin()"
            @error="activeAlert"
            @refreshUser="updateToken"
            @newOwner="newOwner"
            :status="me.channelStatus"
            :meId="me.id"
            class="pl-5 pb-3"
            :refreshToken="tokenUser"
          >
          </ChannelSettings>
          <v-spacer />
          <BasicBtn v-on:click="userDrawer = !userDrawer" content="mdi-close" neonColor="red" :width="40" />
         </v-subheader>
        <v-divider class="mt-4 mb-4 divider" style="border-color: #f27719;"> </v-divider>
      </ChannelUserList>
    </v-navigation-drawer>

    <v-spacer />
    <v-col cols="12" sm="11">
      <v-card
        color="#181818"
        flat
        style="padding-top: 35px"
      >
        <div v-for="(msg, i) in messagesArray"
          :key="i"
          class="overflow-y-auto"
          style="margin-top: 0px; position: relative; padding-right: 45px; padding-left: 45px; padding-bottom: 15px"
        >
        <div v-if="isMsgDefault(msg)">
          <ProfilePicture
            @click="redirectToUserProfile(msg.senderNick)"
            size="30"
            :src="msg.picture"
            :style="isYourMsg(msg) ? 'float: right; margin-left: 20px !important; right: 0px' : 'float: left; margin-right: 20px !important; left: -10px'"
            style="margin-top: 0px; border-radius: 30px; position: absolute; bottom: 0px;"
          />
          <OtherBubbleMsg v-if="!isYourMsg(msg)" :msg="msg"/>
          <MyBubbleMsg v-else :msg="msg" />
        </div>
        <div v-if="isMsgServer(msg)">
          <v-card class="bubble_server" align="center" height="35">
            <v-card-text
              class="white--text pt-1"
              v-text="msg.message"
            />
          </v-card>
        </div>
        </div>
      </v-card>
    </v-col>
    <v-spacer />
  </v-row>
  
  <v-footer app inset color="#181818">
    <TextField @enterPress="sendMessage" v-model="message" append_outer_icon="mdi-send" placeholder="Message" class="mb-2" />
  </v-footer>
</v-container>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Messages, MessagesType } from '../../assets/Classes-ts/Messages'
import { LightUser, User } from '../../assets/Classes-ts/User'
import { ChannelUser } from '../../assets/Classes-ts/ChannelUser'
import { ChannelUserStatus } from '../../assets/Classes-ts/ChannelUser';
import { io, Socket } from "socket.io-client";
import ChannelList from '../../components/channel/ChannelList.vue';
import ChannelUserList from '../../components/channel/ChannelUserList.vue';
import CreateChannelBtn from '../../components/channel/CreateChannelBtn.vue';
import BasicBtn from '../../components/channel/button/BasicBtn.vue';
import ChannelLeaveBtn from '../../components/channel/ChannelLeaveBtn.vue';
import AlertError from '../../components/AlertError.vue';
import ChannelSettings from '../../components/channel/ChannelSettings.vue'

import socket_chat from '../../plugins/chat.io'

export default Vue.extend({
  components: { CreateChannelBtn, ChannelList, ChannelUserList, BasicBtn,
      ChannelLeaveBtn, ChannelSettings, AlertError },
  middleware: 'login',

  data() {
    return {
      message: '',
      messagesArray: new Array<Messages>(),
      me: new ChannelUser(),
      nbMsg: -1,
      userList: new Array<ChannelUser>(),
      userDrawer: false,
      channelDrawer: false,
      userFocus: false,
      channelFocus: false,
      createFocus: false,
      alert: false,
      alertText: "",
      tokenUser: 1,
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
      .catch(function (this: any, error) {
        if (error.response.satus == 404)
          this.$router.push('/chat?error=' + ret.data.message)
        return error.response
      })
    if (ret.status == 404)
      this.$router.push('/chat?error=' + ret.data.message)
    else if (ret.status == 403)
      this.activeAlert(ret.data.message)
    else
    {
      if (socket_chat.connected == false)
      {
        socket_chat.connect();
        socket_chat.emit('joinChannel', this.$route.params.slug, "");
      }
      this.me = await this.$axios.$get('/api/chat/' + this.$route.params.slug + '/me')
      this.messagesArray = await this.$axios.$get('/api/chat/' + this.$route.params.slug + '/messages')
      this.nbMsg = this.messagesArray.length
      socket_chat.on('msgToClient', (msg: Messages) => {
        this.messagesArray.push(msg)
        this.nbMsg = this.messagesArray.length
      })
      socket_chat.on('refreshUser', (msg: string) => {
        this.tokenUser = -this.tokenUser
      })
      socket_chat.on('newUser', (servMsg: Messages) => {
        this.messagesArray.push(servMsg)
        this.nbMsg = this.messagesArray.length
      })
      socket_chat.on('kickUser', (servMsg: Messages) => {
        this.messagesArray.push(servMsg)
        this.nbMsg = this.messagesArray.length
      })
      socket_chat.on('leaveUser', (servMsg: Messages) => {
        this.messagesArray.push(servMsg)
        this.nbMsg = this.messagesArray.length
      })
      socket_chat.on('newOwner', (ownerId: number) => {
        if (ownerId == this.me.id)
          this.me.channelStatus = ChannelUserStatus.OWNER
        this.tokenUser = -this.tokenUser
      })
      socket_chat.on('switchGrade', (ownerId: number) => {
        if (ownerId == this.me.id)
          this.me.channelStatus = this.me.channelStatus == ChannelUserStatus.ADMINISTRATOR ? ChannelUserStatus.DEFAULT : ChannelUserStatus.ADMINISTRATOR;
        this.tokenUser = -this.tokenUser
      })
      socket_chat.on('kickMe', (userId: number, channName: string) => {
        if (userId == this.me.id)
          this.$router.push('/chat')
        else
          this.tokenUser = -this.tokenUser
      })
      socket_chat.on('ChannelDelete', (owner: string) => {
        this.$router.push('/chat?event=' + owner + ' has deleted the channel ' + this.$route.params.slug + '.')
      })
    }
  },

  methods: {
    sendMessage(): void {
      if (this.message.length > 240)
        return
      var test = socket_chat.emit('msgToServer', this.message, this.$route.params.slug)
      socket_chat.on('MuteError', (msg: string) => {
        this.activeAlert(msg)
      })
      this.message = ''
    },

    formateTime(time: Date): string {
      var newTime: Date = new Date(time)
      return newTime.getHours() + ':' + (newTime.getMinutes() < 10 ? '0' + newTime.getMinutes() : newTime.getMinutes())
    },

    isYourMsg(msg: Messages): boolean {
      if (this.me.nickName == msg.sender.nickName)
        return (true)
      return (false)
    },

    isMsgDefault(msg: Messages) {
      return msg.type == MessagesType.DEFAULT
    },

    isMsgServer(msg: Messages) {
      return msg.type == MessagesType.SERVER
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
    },

    isDefaultUser(): boolean {
      return this.me.channelStatus == ChannelUserStatus.DEFAULT
    },

    isOwnerOrAdmin(): boolean {
      return this.me.channelStatus == ChannelUserStatus.OWNER || this.me.channelStatus == ChannelUserStatus.ADMINISTRATOR
    },

    activeAlert(error: any)
    {
        this.alertText = error
        this.alert = true
    },

    newOwner(userName: string) {
      socket_chat.emit('newOwner', this.$route.params.slug, userName)
    },

    onEnd() {
      this.alert = false
    },

    updateUser() {
    },

    updateToken() {
      this.tokenUser = -this.tokenUser
      socket_chat.emit('refreshUser', this.$route.params.slug)
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

</style>
