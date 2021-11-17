<template>
  <v-main>
    <div class="flex-container" style="padding-top: 5%">
      <v-row justify="center" align="center">
        <v-col justify="center" align="center">
          <v-text-field
            class="foreground_element text-field_size"
            v-model="nickname"
            label="Nickname"
            @keydown.enter="setNick"
            width="200"
            counter="20"
            shaped
            filled
          >
          </v-text-field>
          <v-btn 
            class="foreground_element"
            text
            :disabled="!nickIsValid"
            @click="setNick"
          >
            Complet Registration
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-main>
</template>

<script lang="ts">

import Vue from 'vue'

import login from '../../middleware/login'

import Component from 'vue-class-component'

@Component({
  middleware: login
})
export default class extends Vue {

  async mounted() {
    const ret = await this.$axios.$get('api/profile/me/nickname')

    if (ret.nickname != "")
      window.location.href = '/home'
  }

  nickname = "";

  nickIsValid() {
    return this.nickname != "" &&
    this.nickname.length <= 20
  }

  async setNick() {
    const nick = this.nickname
    const ret = await this.$axios.post('api/profile/me/nickname?nickname=' + nick)
      .catch(function (error) {
        alert("nick " + nick + " is already taken")
        return error.response
    });
    if (ret.status == 201)
      window.location.href = '/home'
  }
}
</script>

<style>

.text-field_size{
  min-width: 250px;
  width: 500px;
}

.flex-container {
  /* We first create a flex layout context */
  display: flex;
  
  /* Then we define the flow direction 
     and if we allow the items to wrap 
   * Remember this is the same as:
   * flex-direction: row;
   * flex-wrap: wrap;
   */
  flex-flow: row wrap;
  
  /* Then we define how is distributed the remaining space */
  justify-content: space-evenly;
  align-content: center;
  /* padding-top: 5%; */
  list-style: none;
}

</style>