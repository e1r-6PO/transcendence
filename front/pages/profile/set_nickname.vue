<template>
  <v-main>
    <div class="flex-container" style="padding-top: 5%">
      <p align="center" class="neonText" style="padding-bottom: 1%; font-size:30px">Set your nickname:</p>
      <v-row justify="center" align="center">
        <v-text-field
          class="foreground_element text-field_size custom-placeholer-color neonText"
          v-model="nickname"
          placeholder="Nickname"
          color="#e6ffff"
          @keydown.enter="setNick"
          hide-details
          filled
          rounded
          dense
          counter="20"
          ref="nickname_field"
        >
        </v-text-field>
      </v-row>
      <v-row justify="center" align="center" style="padding-top: 1%">
        <v-btn 
          class="foreground_element"
          :class = '[{"neonText": nickIsValid()}]'
          text
          color="#e6ffff"
          :disabled="nickname.length == 0 || nickname.length > 20"
          @click="setNick"
        >
          Complete Registration
        </v-btn>
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
    this.$refs.nickname_field.focus()
    const ret = await this.$axios.$get('api/profile/me/nickname')

    if (ret.nickname != "")
      window.location.href = '/home'
  }

  nickname = "";

  nickIsValid() {
    var valid = this.nickname != "" && this.nickname.length <= 20

    console.log(valid)
    return valid
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
  
  $refs!: {
    nickname_field: HTMLFormElement
  }
}
</script>

<style>

.custom-placeholer-color input::placeholder {
  color: #e6ffff!important;
  opacity: 1;
}

.custom-label-color .v-label {
  color: #e6ffff;
  opacity: 1;
}

.custom-placeholer-color input,
.custom-label-color input{
  color: #e6ffff!important;
}

.text-field_size {
  color: #e6ffff;
  text-shadow:
    0 0 7px #69acb8,
    0 0 10px #49A2B2,
    0 0 21px #49A2B2,
    0 0 31px #225560,;
  min-width: 250px;
  width: 500px;
  border: 3px solid #ffffff !important;
  box-shadow: inset 0px 0px 20px 0px #63f3f3, 0px 0px 20px 0px #63f3f3 !important;
}

.neonText {
  color: #e6ffff;
  text-shadow:
    0 0 7px #63f3f3,
    0 0 8px #63f3f3,
    0 0 50px #63f3f3;
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
  flex-flow: column wrap;
  
  /* Then we define how is distributed the remaining space */
  justify-content: space-evenly;
  align-content: center;
  /* padding-top: 5%; */
  list-style: none;
}

.text-field_size{
  min-width: 35px;
  width: 500px;
  max-width: 1000px;
}

</style>