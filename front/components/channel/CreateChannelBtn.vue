<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="600px"
      content-class="custom-dialog-card-shadow"
    >
      <template v-slot:activator="{}">
        <v-row align="center" justify="center" style="margin-top: 0px">
          <BasicBtn @click="dialog = true" isText :width="120" :height="40" content="Create +" style="font-family: OrbitronM !important; font-size: 80% !important"/>
        </v-row>
      </template>
      <v-card class="dialog_card">
        <v-card-title class="white--text justify-center">
          <span class="text-h5">Channel settings</span>
          <v-spacer />
          <BasicBtn @click="dialog = false" content="mdi-close" neonColor="red" />
        </v-card-title>
        <v-card-text class="pt-4 pb-6 pl-8 pr-8">
            <TextField v-model="channName" autofocus placeholder="Channel name" />
            <Select v-model="channType" placeholder="Channel type" :itemsList="typeList" />
            <TextField v-model="channPass" placeholder="Password" :disable="channType != 'Protected'" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <BasicBtn @click="createChannel()" :isText="true" content="Create" :disable="disableCreate()" />
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
    this.formateChannName()
    const ret = await this.$axios.$post('/api/chat/' + this.channName + '/create?type=' + this.channType + '&pass=' + this.channPass)
      .catch(function (error) {
        return error.response
      });
    if (ret.status == 409)
      this.activeAlert(ret.data.message)
    else
    {
      this.$router.push("/chat/" + this.channName)
    }
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

  formateChannName() {
    this.channName = this.channName.trim()
    this.channName = this.channName.replace(/\s\s+/g, ' ');
  }

  activeAlert(error: string)
  {
    this.$emit('error', error)
  }
}
</script>

<style scoped>
@import '../../assets/Classes-scss/main_page.scss';
@import '../../assets/Classes-scss/neon_effects.scss';

</style>