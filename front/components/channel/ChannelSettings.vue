<template>
  <div>
    <!-- <AlertError :state="alert"> {{ alertText }} </AlertError> -->
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
          <!-- <v-btn
            color="blue darken-1"
            text
            @click="createChannel()"
            :disabled="disableCreate()"
          >
            Create
          </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'

@Component
export default class ChannelSettings extends Vue{
  
  channName: string = ""
  channType: string = ""
  channPass: string =""

  dialog: boolean = false
  settingsFocus: boolean = false
}
</script>