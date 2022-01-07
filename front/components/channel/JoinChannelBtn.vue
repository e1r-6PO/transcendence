<template>
  <div>
    <v-dialog
      v-model="dialogJoin"
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-row align="center" justify="center" style="margin-top: 10px; margin-bottom: 20px">
        <v-card
          class="neon-button"
          color="#181818"
          width="100"
          style="border-radius: 15px;"
          link
          v-bind="attrs"
          v-on="on"
          v-on:mouseover="joinFocus = true"
          v-on:mouseleave="joinFocus = false"
        >
        <v-card-text align="center" :class="joinFocus == true ? 'purple--text text--lighten-1' : 'white--text'"> 
          <b>Join</b>
        </v-card-text>
      </v-card>
        </v-row>
      </template>
      <v-card class="neon_card">
        <v-card-title class="white--text justify-center">
          <span class="text-h5">Channel name</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <TextField v-model="channName" placeholder="Channel name" />
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <BasicBtn @click="dialogJoin = false" :isText="true" content="Close" />
          <BasicBtn :isText="true" content="Join" @click="tryJoin()" :disable="disableJoin()" />
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
          <BasicBtn @click="dialogPass = false" :isText="true" content="Close" />
          <BasicBtn @click="joinChannel()" :isText="true" content="Join" :disable="disableJoin()" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator';
import Vue from 'vue'
import { ChannAccess } from '../../assets/Classes-ts/Messages'
import socket_chat from '../../plugins/chat.io'

@Component
export default class JoinChannelBtn extends Vue{
  
  dialogJoin: boolean = false
  dialogPass: boolean = false
  joinFocus: boolean = false
  channName: string = ""
  channPass: string = ""
  channType: string = ""

  async tryJoin() {
    this.dialogJoin = false;
    this.formateChannName()
    const ret = await this.$axios.get('/api/chat/' + this.channName + '/info')
      .catch(function (error) {
        return error.response
      })
    if (ret.status == 403 || ret.status == 404)
      this.activeAlert(ret.data.message)
    else if (ret.data.channAccess == ChannAccess.PROTECTED)
      this.dialogPass = true
    else
      this.joinChannel()
  }

  redirectToChannel(channName: string) {
      this.$router.push('/chat/' + channName)
  }

  async joinChannel() {
    this.dialogPass = false;
    const ret = await this.$axios.post('/api/chat/' + this.channName + '/join?pass=' + this.channPass)
      .catch(function (error) {
        return error.response
    });
    if (ret.status == 409)
    this.activeAlert(ret.data['message'])
    else if (ret.status == 403)
    this.activeAlert(ret.data['message'])
    else if (ret.status == 201)
    {
      socket_chat.connect();
      socket_chat.emit('joinChannel', this.channName, "join");
      this.$router.push("/chat/" + this.channName)
    }
  }

  disableJoin() {
    if (!this.dialogPass && this.channName == '')
      return true
    return false
  }

  formateChannName() {
    this.channName = this.channName.trim()
    this.channName = this.channName.replace(/\s\s+/g, ' ');
  }
  
  activeAlert(error: any)
  {
    this.$emit('error', error)
  }
}
</script>

<style>
@import '../../assets/Classes-scss/main_page.scss';
@import '../../assets/Classes-scss/neon_effects.scss';

.neon_card {
  border: 3px solid #a5fafa !important;
  box-shadow: inset 0px 0px 500px 20px #0affff, 0px 0px 0px 0px #0affff !important;
  background-color: #262e2e !important;
}
</style>