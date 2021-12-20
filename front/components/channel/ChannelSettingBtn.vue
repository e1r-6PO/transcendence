<template>
  <div>
    <!-- <AlertError :state="alert"> {{ alertText }} </AlertError> -->
    <!-- <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-row align="center" justify="center" style="margin-top: 0px"> -->
        <v-row align="center" justify="center" style="margin-top: 0px">
          <v-card
            class="neon-button"
            color="#181818"
            style="border-radius: 15px;"
            link
            width="100"
            @click="leaveChannel()"
            v-on:mouseover="btnFocus = true"
            v-on:mouseleave="btnFocus = false"
          >
            <v-card-text align="center" :class="btnFocus == true ? 'purple--text text--lighten-1' : 'white--text'"> 
              <b>Leave</b>
            </v-card-text>
          </v-card>
        </v-row>
        <!-- </v-row>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Channel settings</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-btn
              color="blue darken-1"
              text
            >
              Leave
            </v-btn> -->
            <!-- <v-text-field
              label="Channel name"
              v-model="channName"
            ></v-text-field>
            <v-select
              :items="typeList"
              label="Channel type"
              v-model="channType"
            ></v-select>
            <v-text-field
              label="Password"
              v-model="channPass"
              required
              :disabled="channType != 'Protected'"
            ></v-text-field> -->
          <!-- </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn> -->
          <!-- <v-btn
            color="blue darken-1"
            text
            @click="createChannel()"
            :disabled="disableCreate()"
          >
            Create
          </v-btn> -->
        <!-- </v-card-actions>
      </v-card>
    </v-dialog> -->
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'

@Component
export default class ChannelSettingsBtn extends Vue{
  
  dialog: boolean = false
  btnFocus: boolean = false

  leaveChannel() {
    console.log("COUCOU c est moi")
    console.log(this.$route.params.slug)
    this.$axios.post('/api/chat/' + this.$route.params.slug + '/leave')
    this.$router.push('/chat')
  }
}
</script>