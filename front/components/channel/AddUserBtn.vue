<template>
   <v-dialog
      v-model="dialog"
      max-width="600px"
      content-class="custom-dialog-card-shadow"
    >
      <template v-slot:activator="{ }">
        <BasicBtn
          v-on:click="dialog = true"
          :iconSize="22"
          content="mdi-account-plus"
          class="mt-4"
        />
      </template>
      <v-card class="dialog_card">
        <v-card-title class="white--text">
          <span class="text-h5">Channel settings</span>
          <v-spacer />
        <BasicBtn @click="dialog = false" content="mdi-close" neonColor="red"/>
        </v-card-title>
        <v-card-text class="pt-4 pb-7 pr-8 pl-8">
          <TextField
            @enterPress="addUser()"
            autofocus
            v-model="userName"
            append_outer_icon="mdi-account-plus"
            placeholder="User name"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <BasicBtn v-on:click="addUser()" :disable="disableAdd()" :isText="true" content="Add" />
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator';
import Vue from 'vue'
import socket_chat from '../../plugins/chat.io'

@Component
export default class AddUserBtn extends Vue{
  
  dialog: boolean = false
  userName: string = ""

  async addUser() {
    const ret = await this.$axios.post('/api/chat/' + this.$route.params.slug + '/addUser?userName=' + this.userName)
      .catch(function(error) {
        return error.response
    })
    if (ret.status == 403)
      this.activeAlert(ret.data.message)
    else if (ret.status == 404)
      this.$router.push('/chat?error=' + ret.data.message)
    else
    {
      socket_chat.emit("userAdd", this.$route.params.slug, this.userName)
      this.$emit('refreshUser')
    }
    this.dialog = false
    this.userName = ""
  }

  disableAdd(): boolean {
    return this.userName == "" || this.userName.length > 20
  }

  activeAlert(error: string)
  {
    this.$emit('error', error)
  }
}
</script>

<style>
@import '../../assets/Classes-scss/main_page.scss';
@import '../../assets/Classes-scss/neon_effects.scss';
@import '../../assets/Classes-scss/chat_bubble.scss';
</style>