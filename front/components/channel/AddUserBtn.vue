<template>
   <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <template v-slot:activator="{ }">
        <BasicBtn
          v-on:click="dialog = true"
          :iconSize="22"
          content="mdi-account-plus"
          class="mt-4"
        />
      </template>
      <v-card style="background-color: #181818">
        <v-card-title class="white--text">
          <span class="text-h5">Channel settings</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <TextField v-model="userName" append_outer_icon="mdi-send" placeholder="User name"/>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <BasicBtn v-on:click="dialog = false" :isText="true" content="Close" />
          <BasicBtn v-on:click="addUser()" :diasable="userName == ''" :isText="true" content="Add" />
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator';
import Vue from 'vue'

@Component
export default class AddUserBtn extends Vue{
  
  addFocus: boolean = false
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
      this.$emit('refreshUser')
    this.dialog = false
    this.userName = ""
  }

  activeAlert(error: string)
  {
    this.$emit('error', error)
  }

  addInput(text: string) {
    this.userName = text
  }
}
</script>

<style>
@import '../../assets/Classes-scss/main_page.scss';
@import '../../assets/Classes-scss/neon_effects.scss';
@import '../../assets/Classes-scss/chat_bubble.scss';
</style>