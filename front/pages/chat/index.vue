<template>
  <v-container
    align-items="center"
    style="margin-top: 3%;"
    class="body overflow-y-hidden"
    
  >
    <div v-for="(msg, i) in messagesArray"
      class="overflow-y-auto"
      :key="i"
      style="margin-top: 15px; padding-left: 1%; padding-right: 2%"
    >
      <v-card
        class="bubble"
        :class="isYourMsg(msg) ? 'bubble bubble_blue bubble-alt' : 'bubble bubble_white'"
        :color="isYourMsg(msg) ? '#1982FC' : '#ffffff'"
        style="min-width: 70px; max-width: 400px !important;"
      >
        <v-list-item-content style="margin-left: 10px; margin-right: 10px">
          <v-list-item-subtitle
            class="text-left"
            v-text="msg.senderNick"
          ></v-list-item-subtitle>
          <v-list-item-title :class="isYourMsg(msg) ? 'text-left' : 'text-left'" v-text="msg.message"></v-list-item-title>
          <v-list-item-subtitle
            class="text-right"
            v-text="formateTime(msg.time)"
          ></v-list-item-subtitle>
        </v-list-item-content>
      </v-card>
    </div>

    <v-footer app inset color="#181818">
      <v-text-field
        style="margin-top: 3%"
        background-color="white"
        color="blue"
        v-model="message"
        filled
        clear-icon="mdi-close-circle"
        clearable
        label="Message"
        elevation="2"
        @keypress.enter="sendMessage"
      >
        <v-icon slot="append-outer" color="blue"> mdi-send </v-icon>
      </v-text-field>
    </v-footer>
  </v-container>
</template>

<script lang='ts'>
import Vue from 'vue'
import { io } from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'
import { Messages } from '../../assets/Messages'
import { LightUser, User } from '../../assets/User'

const socket = io('http://localhost:3000', {
  withCredentials: true,
})
Vue.use(VueSocketIOExt, socket)

export default Vue.extend({
  middleware: 'login',

  data() {
    return {
      message: '',
      messagesArray: new Array<Messages>(),
      usersNick: new Map(),
      me: new User()
    }
  },

  methods: {
    sendMessage(): void {
      this.$socket.client.emit('msgToServer', this.message)
      this.message = ''
    },

    formateTime(time: Date): string {
      var newTime: Date = new Date(time)
      return newTime.getHours() + ':' + (newTime.getMinutes() < 10 ? '0' + newTime.getMinutes() : newTime.getMinutes())
    },

    isYourMsg(msg: Messages): boolean {
      console.log("me :" + this.me.nickName + " msg :" + msg.senderNick)
      if (this.me.nickName == msg.senderNick)
      {
      console.log("res : " + (this.me.nickName == msg.senderNick))
        return (true)
      }
      return (false)
    }
  },

  async created() {
    this.me = await this.$axios.$get('/api/profile/me')
    this.messagesArray = await this.$axios.$get('/api/chat/messages')


    // console.log("socket :" + this.$socket.$subscribe)
    this.$socket.$subscribe('msgToClient', (msg: Messages) => {
      this.messagesArray.push(msg)
    })
  },
})
</script>

<style scoped>
.flex-container {
  /* We first create a flex layout context */
  display: flex;

  /* Then we define the flow direction 
     and if we allow the items to wrap 
   * Remember this is the same as:
   * flex-direction: row;
   * flex-wrap: wrap;
   */
  flex-flow: column wrap;

  /* Then we define how is distributed the remaining space */
  justify-content: center;
  align-content: center;
  list-style: none;
  row-gap: 50px;
}

.bubble {
  background: #ffffff;
  border-radius: 8px 8px 8px 8px;
  color: #000; /* bubble text color */
}

.bubble:after {
  border-radius: 200px / 5px;
  content: '';
  display: block;
  position: absolute;
}

.bubble_white:after {
  border: 8px solid transparent !important;
  border-bottom-color: #ffffff !important; /* arrow color */
  bottom: 0px !important;
  left: -7px !important;
}

.bubble_blue:after {
  border: 8px solid transparent !important;
  border-bottom-color: #1982FC !important; /* arrow color */
  bottom: -1px !important;
  left: 17px !important;
}

.bubble-alt {
  float: right;
}
.bubble-alt:before {
  left: auto;
  right: -10px;
  bottom: -10px;
}
.bubble-alt:after {
  left: auto;
  right: -8px;
  bottom: -2px;
}

body {
  overscroll-behavior: none;
  overflow-y: hidden;
}


</style>
