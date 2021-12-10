<template>
<v-container>
  <div style="padding-top: 50px" align="center">
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Create channel
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Channel settings</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              label="Channel name"
              v-model="channName"
            ></v-text-field>
          <!-- <v-col cols="12">
            <v-text-field
              label="Password*"
              type="password"
              required
            ></v-text-field>
          </v-col> -->
            <v-select
              :items="typeList"
              label="Channel type"
              v-model="channType"
            ></v-select>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="createChannel()"
            :disabled="disableCreate()"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogJoin"
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Join channel
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Channel settings</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              label="Channel name"
              v-model="channName"
            ></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialogJoin = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="joinChannel()"
            :disabled="disableJoin()"
          >
            Join
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</v-container>
</template>

<script>
import Vue from 'vue'
import { Messages } from '../../assets/Messages'
import { LightUser, User } from '../../assets/User'

export default Vue.extend({
  middleware: 'login',

  data() {
    return {
      dialog: false,
      dialogJoin: false,
      channName: '',
      channPass: '',
      channType: '',
      typeList: [
        'Public',
        'Private',
        'Protected'
      ]
    }
  },

  methods: {
    createChannel() {
      console.log("Chan name: " + this.channName)
      console.log("Chan type: " + this.channType)
      this.dialog = false
      this.$axios.$post('/api/chat/create?name=' + this.channName + '&type=' + this.channType)
      this.$router.push("/chat/" + this.channName)
    },

    joinChannel() {
      this.dialogJoin = false;
      this.$axios.$post('/api/chat/join?name=' + this.channName)
    },

    disableCreate() {
      if (this.channName == '' || this.channName.length > 20)
        return true
      if (this.channType == '')
        return true
      return false
    },

    disableJoin() {
      if (this.channName == '')
        return true
      return false
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
