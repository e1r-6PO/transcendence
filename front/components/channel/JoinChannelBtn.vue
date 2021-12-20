<template>
  <div>
    <AlertError :state="alert"> {{ alertText }} </AlertError>
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
          <v-card>
            <v-card-title>
              <span class="text-h5">Channel name</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-text-field
                  label="Channel name"
                  v-model="channName"
                ></v-text-field>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="dialogJoin = false"
              >
                Close
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="tryJoin()"
                :disabled="disableJoin()"
              >
                Join
              </v-btn>
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
              <v-btn
                color="blue darken-1"
                text
                @click="dialogPass = false"
              >
                Close
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="joinChannel()"
                :disabled="disableJoin()"
              >
                Join
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator';
import Vue from 'vue'
import { ChannAccess } from '../../assets/Messages'
import AlertError from '../../components/AlertError.vue';

@Component
export default class JoinChannelBtn extends Vue{
  
  dialogJoin: boolean = false
  dialogPass: boolean = false
  joinFocus: boolean = false
  channName: string = ""
  channPass: string = ""
  channType: string = ""
  alertText: string = ""
  alert: boolean = false

  async tryJoin() {
    this.dialogJoin = false;
    const type = await this.$axios.get('/api/chat/' + this.channName + '/type')
      .catch(function (error) {
        return error.response
      })
    if (type.status == 403)
    this.activeAlert("Channel does not exist")
    else if (type.data == ChannAccess.PROTECTED)
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
    console.log(ret.status)
    if (ret.status == 409)
    this.activeAlert(ret.data['message'])
    else if (ret.status == 403)
    this.activeAlert(ret.data['message'])
    else if (ret.status == 201)
      this.$router.push("/chat/" + this.channName)
  }

  disableJoin() {
    if (!this.dialogPass && this.channName == '')
      return true
    return false
  }
  
  activeAlert(error: any)
  {
      this.alertText = error
      this.alert = true
      setTimeout(() => {
        this.alert = false
    }, 2000)
  }
}
</script>

<style>
@import '../../assets/main_page.scss';
</style>