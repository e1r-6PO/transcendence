<template>
  <div>
    <v-dialog
      v-model="dialogJoin"
      max-width="600px"
      content-class="custom-dialog-card-shadow"
    >
      <template v-slot:activator="{}">
        <v-row align="center" justify="center" style="margin-top: 10px; margin-bottom: 20px">
        
        <BasicBtn @click="dialogJoin = true" isText content="Join" :width="120" :height="40"/>
        </v-row>
      </template>
      <v-card class="dialog_card">
        <v-card-title class="white--text justify-center">
          <span class="text-h5">Channel name</span>
          <v-spacer />
          <BasicBtn @click="dialogJoin = false" content="mdi-close" neonColor="red" />
        </v-card-title>
        <v-card-text>
          <v-container>
            <TextField  @enterPress="tryJoin()" autofocus v-model="channName" placeholder="Channel name" />
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <BasicBtn :isText="true" content="Join" @click="tryJoin()" :disable="disableJoin()" />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogPass"
      max-width="600px"
      content-class="custom-dialog-card-shadow"
    >
      <v-card class="dialog_card">
        <v-card-title>
          <span class="text-h5 white--text">Channel password</span>
          <v-spacer />
          <BasicBtn @click="dialogPass = false" content="mdi-close" neonColor="red" />
        </v-card-title>
        <v-card-text>
          <v-container>
            <TextField @enterPress="joinChannel()" autofocus v-model="channPass" placeholder="Channel Password"/>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
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
    if (this.dialogPass && this.channPass == '')
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

</style>