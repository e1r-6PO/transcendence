<template>
<div>
  <BasicBtn neonColor="red" isText content="Delete" @click="dialog = true" style="padding-top: 3px; font-family: OrbitronM; font-size: 70%"/>
  <v-dialog
    v-model="dialog"
    max-width="290"
    content-class="custom-dialog-card-shadow"
  >
    <v-card class="dialog_card">
      <v-card-title class="text-h5 white--text" style="font-family: OrbitronM !important; font-size: 150% !important">
        Are you sure you want to delete the channel ?
      </v-card-title>

      <v-card-text class="white--text">
        This action will delete the entirety of the channel. click on confirm to delete or cancel to get back on settings.
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <BasicBtn @click="dialog = false" isText content="Cancel" style="padding-top: 3px; font-family: OrbitronM; font-size: 70%"/>
        <BasicBtn @click="eraseChannel()" neonColor="red" isText content="Confirm" style="padding-top: 3px; font-family: OrbitronM; font-size: 70%"/>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator';
import Vue from 'vue'
import socket_chat from '../../plugins/chat.io'


@Component
export default class DeleteChannelBtn extends Vue {
  
  dialog: boolean = false


  async eraseChannel() {
    var ret = await this.$axios.delete('/api/chat/' + this.$route.params.slug + '/delete')
    
    if (ret.status == 404)
      this.$router.push('/chat?error=' + ret.data.message)
    else if (ret.status == 403)
      this.$router.push('/chat?error=403' + ret.data.message)
    else
    {
      this.$router.push('/chat?success=Channel ' + this.$route.params.slug + ' successfully deleted.')
      socket_chat.emit('deleteChannel', this.$route.params.slug)
    }
  }
}
</script>