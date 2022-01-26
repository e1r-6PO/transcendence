<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
    content-class="custom-dialog-card-shadow"
  >
    <template v-slot:activator="{ }">
      <BasicBtn
        v-on:click="dialog = true"
        content="Leave"
        :isText="true"
        neonColor="red"
      />
    </template>
    <v-card class="dialog_card">
      <v-card-title class="white--text">
        <p class="mt-4 text-h5">Choose the new Owner of the channel</p>
        <v-spacer />
        <BasicBtn v-on:click="dialog = false" content="mdi-close" neonColor="red" />
      </v-card-title>
      <v-card-text>
        <v-container>
          <TextField @enterPress="giveOwner()" v-model="userName" placeholder="User name" />
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <BasicBtn
          @click="giveOwner()"
          :isText="true"
          :disable="userName == ''"
          content="Leave"
          neonColor="red"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>  
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'
import socket_chat from '../../plugins/chat.io'

@Component
export default class LeaveOwnerBtn extends Vue {
 
 dialog: boolean = false
 userName: string = ""

 async giveOwner() {
   var ret = await this.$axios.patch('/api/chat/' + this.$route.params.slug + '/giveOwner?userName=' + this.userName)
    .catch(function(error) {
      return error.response
    })
  if (ret.status == 404)
    this.$router.push('/chat?error=' + ret.data.message)
  else if (ret.status == 403)
    this.activeAlert(ret.data.message)
  else
  {
    this.$router.push('/chat')
    socket_chat.emit('newOwner', this.$route.params.slug, this.userName)
  }
 }

  activeAlert(error: string)
  {
    this.$emit('error', error)
  }

}
</script>

<style>
</style>