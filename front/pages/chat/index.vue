<template>
<v-container fluid fill-height>
  <v-row style="height:100%">
    <v-col cols="12" sm="3" class="border">

    </v-col>
    <v-col cols="12" sm="6" class="border">
      <div align="center">
        <v-alert
          v-model="alertCode"
          outlined
          :type=alertType
          text
          dismissible
        >
          {{ alertText }}
        </v-alert>
      </div>
      <div align="center">
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
    </v-col>
    <v-col cols="12" sm="3">
    </v-col>
  </v-row>
</v-container>
</template>

<script lang="ts">
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
      alertText: '',
      alertCode: false,
      alertType: 'success',
      typeList: [
        'Public',
        'Private',
        'Protected'
      ]
    }
  },

  methods: {
    async createChannel() {
      this.dialog = false
      const ret = await this.$axios.$post('/api/chat/create?name=' + this.channName + '&type=' + this.channType)
        .catch(function (error) {
          return error.response
        });
      if (ret.status == 409)
      {
        this.alertText = "Channel already"
        this.alertType = "error"
        this.alertCode = true
        // alert("Already in channel")
      }
      else
        this.$router.push("/chat/" + this.channName)
    },

    async joinChannel() {
      this.dialogJoin = false;
      const ret = await this.$axios.post('/api/chat/join?name=' + this.channName)
        .catch(function (error) {
          return error.response
      });
      if (ret.status == 409)
      {
        this.alertText = "Already in channel"
        this.alertType = "error"
        this.alertCode = true
        // alert("Already in channel")
      }
      else if (ret.status == 403)
      {
        this.alertText = "Channel inexist"
        this.alertType = "error"
        this.alertCode = true
      }
      else if (ret.status == 201)
      {
        this.$router.push("/chat/" + this.channName)
      }
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
})
</script>

<style scoped>
.border {
  border-right: 1px solid grey;
}
</style>
