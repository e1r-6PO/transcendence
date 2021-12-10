<template>
  <v-container
    align-items="center"
    style="margin-top: 3%;"
    class="body overflow-y-hidden"
  >
    <!-- <v-card
      flat
      color="#181818"
      height="50"
      width="100%"
      style="z-index: 1 !important; position: fixed; left: 0px; top: 65px; padding-bottom: 0px"
    >
      <v-card-title class="justify-center" style="color: red">
        channel title
      </v-card-title>
    </v-card> -->
    <div v-for="(msg, i) in messagesArray"
      max-height="400"
      class="overflow-y-auto"
      :key="i"
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
        style="min-width: 70px; max-width: 400px !important;"
      >
        <v-card-subtitle
          style="padding-bottom: 0px"
          v-text="msg.senderNick"
          class="text-left"
        >

        </v-card-subtitle>
      <v-card-text
        style="padding-bottom: 0px; padding-right: 55px"
        v-text="msg.message"
      >
      </v-card-text>
      <v-card-subtitle
        style="padding-bottom: 5px; padding-top: 0px;"
        v-text="formateTime(msg.time)"
        class="text-right"
      >
      </v-card-subtitle>
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
import { Messages } from '../../assets/Messages'
import { LightUser, User } from '../../assets/User'
import { io, Socket } from "socket.io-client";

const socket_chat = io("http://localhost:3000/chat", { withCredentials: true});

export default Vue.extend({
  middleware: 'login',

  data() {
    return {
      message: '',
      messagesArray: new Array<Messages>(),
      usersNick: new Map(),
      me: new User(),
      nbMsg: -1
    }
  },

  methods: {
    sendMessage(): void {
      socket_chat.emit('msgToServer', this.message)
      this.message = ''
    },

    formateTime(time: Date): string {
      var newTime: Date = new Date(time)
      return newTime.getHours() + ':' + (newTime.getMinutes() < 10 ? '0' + newTime.getMinutes() : newTime.getMinutes())
    },

    isYourMsg(msg: Messages): boolean {
      if (this.me.nickName == msg.senderNick)
      {
        return (true)
      }
      return (false)
    },

    redirectToUserProfile(userNick: string) {
      this.$router.push("/users/" + userNick)
    },

    scrollToEnd() {    	
      window.scrollTo(0, document.body.scrollHeight);
    }
  },

    updated() {
    console.log("msg :" + this.nbMsg + " array : " + this.messagesArray.length)
    if (this.nbMsg == this.messagesArray.length || this.nbMsg == -1)
    {
      this.scrollToEnd();
      this.nbMsg = 0;
    }
  },

  async created() {
    //connect the socket
    // this.$socket.client.connect()
    console.log(socket_chat.connect());
    this.me = await this.$axios.$get('/api/profile/me')
    this.messagesArray = await this.$axios.$get('/api/chat/messages')
    socket_chat.on('connect', () =>{
      console.log('Connected')
    })
    socket_chat.on('msgToClient', (msg: Messages) => {
      this.messagesArray.push(msg)
      this.nbMsg = this.messagesArray.length
    })
  }
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
}

.bubble_blue:after {
  border: 8px solid transparent !important;
  border-bottom-color: #1982FC !important; /* arrow color */
}

.bubble_left {
  float: left;
}

.bubble_left:after {
  border: 8px solid transparent !important;
  border-bottom-color: #ffffff !important; /* arrow color */
  bottom: 0px!important;
  left: -7px !important;
}

.bubble_right {
  float: right;
}

.bubble_right:after {
  right: -8px !important;
  border: 10px solid transparent !important;
  border-bottom-color: #1982FC !important; /* arrow color */
  bottom: 0px !important;
}

body {
  overscroll-behavior: none !important;
  overflow-y: hidden !important;
}


</style>
