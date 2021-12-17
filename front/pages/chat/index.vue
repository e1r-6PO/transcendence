<template>
<v-container
  fluid 
  fill-height
 >
  <div>
    <v-alert
      v-model="alertCode"
      outlined
      :type=alertType
      text
      dismissible
      style="position: absolute; right: 0px; top: 30px; z-index: 12; width: 100%"
      align="center"
    >
      {{ alertText }}
    </v-alert>
  </div>
  
  <v-row style="height: 100%">
    <v-col cols="12" sm="3" class="border">
      <div align="center"
        style="margin-bottom: 14.5px"
      >
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
              style="margin-bottom: 10px"
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
                <v-select
                  :items="typeList"
                  label="Channel type"
                  v-model="channType"
                ></v-select>
                <v-text-field
                  label="Password"
                  v-model="channPass"
                  required
                  :disabled="channType != 'Protected'"
                ></v-text-field>
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
                @click="tryJoin()"
                :disabled="disableJoin()"
              >
                Join
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="dialogPass"
          max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Channel password</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-text-field
                  label="Channel Password"
                  v-model="channPass"
                ></v-text-field>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="dialogPass = false"
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
      
      <v-divider
        class="side-bar" 
        color="#ffa768"
        style="margin-bottom: 14.5px; max-height: 5px; height: 3px"
      >
      </v-divider>
      
      <v-card
        tile
        v-for="channel, i in channList" :key="channList[i]"
      >
        <v-card-text>
          {{ channel }}
        </v-card-text>
        <v-divider></v-divider>
      </v-card>
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
import { ChannAccess, Messages } from '../../assets/Messages'
import { LightUser, User } from '../../assets/User'

export default Vue.extend({
  middleware: 'login',

  data() {
    return {
      dialog: false,
      dialogJoin: false,
      dialogPass: false,
      channName: '',
      channPass: '',
      channType: '',
      alertText: '',
      alertCode: false,
      alertType: 'success',
      typeList: [
        'Public',
        'Private',
        'Protected'
      ],
      channList: []
    }
  },

  async mounted() {
    if (this.$route.query['error'] != undefined && this.$route.query['error'] != "")
      this.activeAlert('error', this.$route.query['error'])
    
    var ret = await this.$axios.get('/api/chat/myChannel')
    this.channList = ret.data
    console.log(this.channList)
  },

  methods: {
    
    activeAlert(type: string, text: any) {
      this.alertType = type
      this.alertCode = true
      this.alertText = text
      setTimeout(() => {
        this.alertCode = false
      }, 2000)
    },

    async createChannel() {
      this.dialog = false
      const ret = await this.$axios.$post('/api/chat/create?name=' + this.channName + '&type=' + this.channType + '&pass=' + this.channPass)
        .catch(function (error) {
          return error.response
        });
      if (ret.status == 409)
        this.activeAlert('error', "Channel already exists")
      else
        this.$router.push("/chat/" + this.channName)
    },

    async tryJoin() {
      this.dialogJoin = false;
      const type = await this.$axios.get('/api/chat/' + this.channName + '/type')
        .catch(function (error) {
          return error.response
        })
      if (type.status == 403)
        this.activeAlert('error', "Channel does not exist")
      else if (type.data == ChannAccess.PROTECTED)
        this.dialogPass = true
      else
        this.joinChannel()
    },

    async joinChannel() {
      this.dialogPass = false;
      const ret = await this.$axios.post('/api/chat/join?name=' + this.channName + '&pass=' + this.channPass)
        .catch(function (error) {
          return error.response
      });
      console.log(ret.data)
      if (ret.status == 409)
        this.activeAlert('error', ret.data['message'])
      else if (ret.status == 403)
        this.activeAlert('error', ret.data['message'])
      else if (ret.status == 201)
        this.$router.push("/chat/" + this.channName)
    },

    async joinChannelWithPass()
    {
      const ret = await this.$axios.post('/api/chat/messages')
    },

    disableCreate() {
      if (this.channName == '' || this.channName.length > 20)
        return true
      if (this.channType == '')
        return true
      if (this.channType == 'Protected' && (this.channPass == '' || this.channPass.length < 5))
        return true
      return false
    },

    disableJoin() {
      if (!this.dialogPass && this.channName == '')
        return true
      return false
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
