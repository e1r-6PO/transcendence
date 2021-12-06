<template>
  <v-container
    align-items="center"
    style="margin-top: 3%;"
    class="body overflow-y-hidden"
    
  >
    <div class="overflow-y-auto">
      <v-list
        style="max-height: 800px !important; height: 800px"
        class="overflow-y-auto"
        color="#181818"
      >
      <v-list-item
        v-for="(msg, i) in messagesArray"
        :key="i"
        style="margin-top: 15px;"
      >
        <v-card
          class="text-left bubble"
          style="min-width: 70px; max-width: 400px !important"
        >
          <v-list-item-content style="margin-left: 10px; margin-right: 10px">
            <v-list-item-subtitle
              class="text-left"
              v-text="msg.senderNick"
            ></v-list-item-subtitle>
            <v-list-item-title v-text="msg.message"></v-list-item-title>
            <v-list-item-subtitle
              class="text-right"
              v-text="formateTime(msg.time)"
            ></v-list-item-subtitle>
          </v-list-item-content>
        </v-card>
      </v-list-item>
      </v-list>
      <!-- </v-virtual-scroll> -->
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
import { LightUser } from '../../assets/User'

export default Vue.extend({
  middleware: 'login',

  data() {
    return {
      message: '',
      messagesArray: new Array<Messages>(),
      usersNick: new Map()
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
    }
  },

  async mounted() {
    this.messagesArray = await this.$axios.$get('/api/chat/messages')
    console.log(this.$socket)
    this.$socket.$subscribe('msgToClient', (msg: Messages) => {
      this.messagesArray.push(msg)
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
  border-radius: 10px 10px 10px px;
  color: #000; /* bubble text color */
}

.bubble:before,
.bubble:after {
  border-radius: 200px / 5px;
  content: '';
  display: block;
  position: absolute;
}

.bubble:after {
  border: 8px solid transparent !important;
  border-bottom-color: #ffffff !important; /* arrow color */
  bottom: 0px !important;
  left: -7px !important;
}

body {
  overscroll-behavior: none;
  overflow-y: hidden;
}

</style>
