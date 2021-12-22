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
            v-on:mouseover="createFocus = true"
            v-on:mouseleave="createFocus = false"
          >
            <v-card-text align="center" :class="createFocus == true ? 'purple--text text--lighten-1' : 'white--text'"> 
              <b>Create +</b>
            </v-card-text>
          </v-card>
        </v-row>
      </template>
      <v-card class="neon_card">
        <v-card-title class="white--text">
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
            class="neon-button"
            color="#181818"
            v-on:mouseover="createFocus = true"
            v-on:mouseleave="createFocus = false"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="createChannel()"
            :disabled="disableCreate()"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'

@Component
export default class CreateChannelBtn extends Vue{

      dialog: boolean = false
      channName: string = ''
      channPass: string = ''
      channType: string = ''
      createFocus: boolean = false
      typeList: Array<string> = [
        'Public',
        'Private',
        'Protected'
      ]

    async createChannel() {
      this.dialog = false
      const ret = await this.$axios.$post('/api/chat/' + this.channName + '/create?type=' + this.channType + '&pass=' + this.channPass)
        .catch(function (error) {
          return error.response
        });
      if (ret.status == 409)
        this.activeAlert("Channel already exists")
      else
        this.$router.push("/chat/" + this.channName)
    }

    redirectToChannel(channName: string) {
        this.$router.push('/chat/' + channName)
    }

    disableCreate() {
      if (this.channName == '' || this.channName.length > 20)
        return true
      if (this.channType == '')
        return true
      if (this.channType == 'Protected' && (this.channPass == '' || this.channPass.length < 5))
        return true
      return false
    }

    activeAlert(error: string)
    {
      this.$emit('error', error)
    }
}
</script>

<style >
@import '../../assets/Classes-scss/main_page.scss';

.neon_card {
  border: 3px solid #a5fafa !important;
  box-shadow: inset 0px 0px 500px 20px #0affff, 0px 0px 40px 0px #0affff !important;
  background-color: #181818 !important;
}
</style>