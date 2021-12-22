<template>
   <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <template v-slot:activator="{ }">
        <CloseBtn
          v-on:click="dialog = true"
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
            <v-text-field
              v-model="userName"
              placeholder="User name"
              class="mt-3 custom-select-color custom-placeholder-color custom-input-color neonText"
              color="blue"
              hide-details
              filled
              dense
              rounded
            ></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <CloseBtn v-on:click="dialog = false" :isText="true" content="Close" />
          <CloseBtn v-on:click="addUser()" :isText="true" content="Add" />
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
}
</script>