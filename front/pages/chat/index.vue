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
      channName: '',
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
      this.$router.push("/chat/" + this.channName)
    },

    disableCreate() {
      if (this.channName == '' || this.channName.length > 20)
        return true
      if (this.channType == '')
        return true
      return false
    }
  }
})
</script>