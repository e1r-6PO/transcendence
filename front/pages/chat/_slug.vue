<template>
  <v-container
    style="overflow-y: hidden !important"
    class="body"
    fluid 
    fill-height
  >
   <v-row style="height: 100%; margin-top: 2.5%">
    <v-col cols="12" sm="3" class="border">


    <v-card
      max-width="350"
      color="#181818"
      flat
    >
      <v-virtual-scroll
        :items="channList"
        height="500"
        min-width="100"
        item-height="60"
      >
        <template v-slot:default="{ item }">
          <v-list-item :key="item" @click="redirectToChannel(item)" style="padding-bottom: 10px" align="center">
            <v-card flat height="54" min-width="150" width="300" style="margin-bottom: -8px; border-radius: 15px" color="#181818" class="neon-button">
            <v-card-text style="color: white">
              <h3>{{ item }}</h3>
            </v-card-text>
            </v-card>
          </v-list-item>
          <!-- <v-divider class="divider"></v-divider> -->
        </template>
      </v-virtual-scroll>
    </v-card>




      <!-- <v-virtual-scroll
        :bench="benched"
        :items="channList"
        height="500"
        item-height="64"
      >
      <v-card v-for="(channel, i) in channList" :key="channList[i]"
        tile
        @click="redirectToChannel(channel)"
      >
        <v-card-text>
          {{ channel }}
        </v-card-text>
        <v-divider></v-divider>
      </v-card>
      </v-virtual-scroll> -->
    </v-col>


    <v-col cols="12" sm="6" class="border">
      <v-card
        max-width="1000"
        color="#181818"
        flat
      >
        <v-virtual-scroll
          :items="messagesArray"
          height="500"
          benched="3"
          item-height="200"
        >
          <template v-slot:default="{ item }">
    <!-- <div v-for="(msg, i) in messagesArray" -->
      <!-- :key="i" -->
      <div
        class="overflow-y-auto"
        style="margin-top: 0px; position: relative; padding-right: 45px; padding-left: 45px; padding-bottom: 15px"
      >
      <v-img
        :style="isYourMsg(item) ? 'float: right; margin-left: 20px !important; right: 0' : 'float: left; margin-right: 20px !important; left: 0'"
        style="margin-top: 0px; border-radius: 30px; position: absolute; bottom: 0px;"
        width="30"
        :src="item.picture"
        @click="redirectToUserProfile(item.senderNick)"
      >
      </v-img>
      <v-card
        class="bubble"
        :class="isYourMsg(item) ? 'bubble bubble_right' : 'bubble bubble_left'"
        :color="isYourMsg(item) ? '#1982FC' : '#ffffff'"
        style="min-width: 70px; max-width: 400px !important; margin-top: 20px"
      >
        <v-card-subtitle
          style="padding-bottom: 0px; color: white"
          v-text="item.senderNick"
          class="text-left"
        >

        </v-card-subtitle>
      <v-card-text
        style="padding-bottom: 0px; padding-right: 55px; color: white"
        v-text="item.message"
      >
      </v-card-text>
      <v-card-subtitle
        style="padding-bottom: 5px; padding-top: 0px; color: white"
        v-text="formateTime(item.time)"
        class="text-right"
      >
      </v-card-subtitle>
      </v-card>
    </div>
        </template>
      </v-virtual-scroll>
    </v-card>
    </v-col>

    <v-col cols="12" sm="3">

          <v-card
      max-width="350"
      color="#181818"
      flat
    >
      <v-virtual-scroll
        :items="userList"
        height="500"
        min-width="80"
        item-height="64"
      >
        <template v-slot:default="{ item }">
          <v-list-item :key="item" @click="redirectToUserProfile(item.nickName)">
            <v-card flat height="60" min-width="150" width="300" style="border-radius: 15px;" color="#181818" class="neon-button">
              <v-card-title style="padding-top: 8px; padding-bottom: 0px">
                <v-avatar size="36">
                  <img
                    alt="user"
                    :src="item.picture"
                  >
                </v-avatar>
                <h4 style="color: white; margin-left: 10px">{{ item.nickName }}</h4>
              </v-card-title>
              <v-card-subtitle align="right">
                <h6 style="color: white">{{ item.channelStatus }}</h6>
              </v-card-subtitle>
            </v-card>
          </v-list-item>
          <!-- <v-divider class="divider"></v-divider> -->
        </template>
      </v-virtual-scroll>
          </v-card>
      <!-- <v-card v-for="(user, i) in userList" :key="`user-${i}`"
        tile
        @click="redirectToUserProfile(user.nickName)"
      >

        <v-card-title>
          <v-avatar size="36">
            <img
              alt="user"
              :src="user.picture"
            >
          </v-avatar>
          <p style="margin-bottom: 0px" class="ml-3">{{ user.nickName }}</p>
        </v-card-title>
        <v-card-subtitle style="padding-bottom: 0px; margin-bottom: 4px !important" align="right">
          <p class="ml-12" style="margin-bottom: 0px">{{ user.channelStatus }}</p>
        </v-card-subtitle>
        <v-divider></v-divider>
      </v-card> -->
    </v-col>
  </v-row>
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
import { ChannelUser } from '../../assets/ChannelUser'
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
      nbMsg: -1,
      channList: [],
      userList: new Array<ChannelUser>(),
    }
  },

  updated() {
    if (this.nbMsg == this.messagesArray.length || this.nbMsg == -1)
    {
      this.scrollToEnd();
      this.nbMsg = 0;
    }
  },

  async created() {
    const ret = await this.$axios.$get('/api/chat/messages/access?name=' + this.$route.params.slug)
      .catch(function (error) {
        return error.response
      })
    if (ret.status == 404)
      this.$router.push('/chat?error=Channel%20does%20not%20exist')
    socket_chat.connect();
    socket_chat.emit('joinChannel', this.$route.params.slug);
    this.me = await this.$axios.$get('/api/profile/me')
    this.messagesArray = await this.$axios.$get('/api/chat/' + this.$route.params.slug + '/messages')
    
    socket_chat.on('msgToClient', (msg: Messages) => {
      this.messagesArray.push(msg)
      this.nbMsg = this.messagesArray.length
    })
  },

  async mounted() {
    var myChannelRet = await this.$axios.get('/api/chat/myChannel')
    this.channList = myChannelRet.data
    var userListRet = await this.$axios.get('/api/chat/' + this.$route.params.slug + '/users')
    this.userList = userListRet.data
    console.log(this.userList)
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
    }
  }
})
</script>

<style scoped>
@import '../../assets/main_page.scss';

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
  border-bottom-color: #ffc79c !important; /* arrow color */
}

.bubble_blue:after {
  border: 3px solid #a5fafa !important;
  box-shadow: inset 0px 0px 110px 0px #0affff, 0px 0px 40px 0px #0affff !important;
  border-radius: 15px !important;
  background-color: #181818 !important;

  /* border: 8px solid transparent !important; */
  /* border-bottom-color: #1982FC !important; arrow color */
}

.bubble_left {
  border: 3px solid #ffc79c !important;
  box-shadow: inset 0px 0px 110px 0px #f27719 !important;
  border-radius: 15px !important;
  background-color: #181818 !important;
  float: left;
}

.bubble_left:after {
  border: 8px solid transparent !important;
  border-bottom-color: #ffc79c !important; /* arrow color */
  bottom: -2px!important;
  left: -9px !important;
}

.bubble_right {
    border: 3px solid #a5fafa !important;
  box-shadow: inset 0px 0px 110px 0px #0affff!important;
  border-radius: 15px !important;
  background-color: #181818 !important;
  float: right;
}

.bubble_right:after {
  right: -12px !important;
  border: 10px solid transparent !important;
  border-bottom-color: #a5fafa !important; /* arrow color */
  bottom: -2px !important;
}

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

</style>
