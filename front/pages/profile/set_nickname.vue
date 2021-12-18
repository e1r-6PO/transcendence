<template>
  <v-container>
    <div style="padding-top: 3%">
    <v-alert
      v-model="alertCode"
      type="error"
      text
      dismissible
      outlined
    >
      This nick is already register
    </v-alert>
    </div>
    <div class="flex-container-col" style="padding-top: 2%">
      <p align="center" class="neonText" style="padding-bottom: 1%; font-size:30px">Set your nickname:</p>
      <v-row justify="center" align="center">
        <v-text-field
          class="foreground_element text-field-nick-neon custom-placeholder-color custom-input-color"
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
  </v-container>
</template>

<script lang="ts">

import Vue from 'vue'

import login from '../../middleware/login'

import Component from 'vue-class-component'

@Component({
  middleware: login
})
export default class extends Vue {

  nickname = "";
  alertCode = false

  async mounted() {
    this.$refs.nickname_field.focus()
    const ret = await this.$axios.$get('api/profile/me/nickname')

    if (ret.nickname != "")
      this.$router.push('/home')
  }

  nickIsValid() {
    var valid = this.nickname != "" && this.nickname.length <= 20

    console.log(valid)
    return valid
  }

  async setNick() {
    const nick = this.nickname
    const ret = await this.$axios.post('api/profile/me/nickname?nickname=' + nick)
      .catch(function (error) {
        return error.response
    });
    if (ret.status == 201)
      this.$router.push('/home')
    else
      this.alertCode = true
  }
  
  $refs!: {
    nickname_field: HTMLFormElement
  }
}
</script>

<style scoped>

@import '../../assets/main_page.scss';
@import '../../assets/custom_flexBox.scss';
@import '../../assets/neon_effects';

.neonText {
  color: #e6ffff;
  text-shadow:
    0 0 7px #63f3f3,
    0 0 8px #63f3f3,
    0 0 50px #63f3f3;
}

.text-field_size{
  min-width: 35px;
  width: 500px;
  max-width: 1000px;
}

</style>