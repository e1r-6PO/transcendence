<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-row align="center" justify="center" style="margin-top: 0px">
          <v-card
            class="neon-button"
            color="#181818"
            style="border-radius: 15px;"
            link
            width="100"
            v-bind="attrs"
            v-on="on"
            v-on:mouseover="settingsFocus = true"
            v-on:mouseleave="settingsFocus = false"
          >
            <v-card-text align="center" :class="settingsFocus == true ? 'purple--text text--lighten-1' : 'white--text'"> 
              <b>Settings </b>
            </v-card-text>
          </v-card>
        </v-row>
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
              disabled
            ></v-text-field>
            <v-select
              :items="typeList"
              label="Channel type"
              v-model="channAccess"
            ></v-select>
            <v-text-field
              label="Password"
              v-model="channPass"
              required
              :disabled="channAccess != 'Protected'"
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
            :disabled="disableSave()"
            @click="saveSettings()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator'
import Vue from 'vue'
import { ChannAccess } from '../../assets/Classes-ts/Messages'
import  AlertError  from '../AlertError.vue'

@Component
export default class ChannelSettings extends Vue{
  
  actualAccess: string = ""
  actualPass: string = ""
  channName: string = this.$route.params.slug
  channAccess: string = ""
  channPass: string = ""
  typeList: Array<string> = [
    'Public',
    'Private',
    'Protected'
  ]

  dialog: boolean = false
  settingsFocus: boolean = false

  async mounted() {
    var ret = await this.$axios.get('/api/chat/' + this.$route.params.slug + '/info')
      .catch(function(error) {
        return error.response
      })
    if (ret.status == 409)
      this.$router.push('/chat?error=Channel%20does%20not%20exist')
    else if (ret.status == 403)
      this.$router.push('/chat?error=Not%20in%20channel')
    else
    {
      console.log(ret.data)
      this.actualAccess = ret.data.channAccess
      this.channAccess = ret.data.channAccess
      this.actualPass = ret.data.channPass
    }
  }

  disableSave() {
    if (this.channAccess == this.actualAccess && this.channAccess != ChannAccess.PROTECTED)
      return true
    if (this.channAccess == ChannAccess.PROTECTED && this.channPass == "")
      return true
    return false
  }

  async saveSettings() {
    var ret = await this.$axios.patch('/api/chat/' + this.$route.params.slug + '/info?channAccess=' + this.channAccess + '&channPass=' + this.channPass)
      .catch(function(error) {
        return error.response
      })
    console.log(ret)
    if (ret.status == 404)
      this.$router.push('/chat?error=' + ret.data.message)
    else if (ret.status == 403)
      this.activeAlert(ret.data.message)
    else
    {
      this.dialog = false
      this.actualAccess = this.channAccess
      this.actualPass = this.channPass
      console.log("success")
    }
  }
  
  activeAlert(error: any)
  {
    this.$emit('error', error)
  }
}
</script>