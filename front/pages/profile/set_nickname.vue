<template>
  <v-container>
    <div style="padding-top: 5%">
      <AlertError @end="alert = false" :textError="alertText" :state="alert" type="error" />
    </div>
    <div class="flex-container-col" style="padding-top: 2%">
      <p align="center" class="neonText" style="font-size:30px">Set your nickname:</p>
      <TextField @enterPress="setNick()" autofocus width="330" v-model="nickname" placeholder="Nickname" />
      <v-row align="center" justify="center" class="mt-6">
        <BasicBtn
          :neonColor="nickIsValid() ? 'orange' : 'none'"
          isText
          content="Complete Registration"
          :width="250"
          @click="setNick"
          :disabled="!nickIsValid()"  
        />
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">

import Vue from 'vue'

import login from '../../middleware/login'

import Component from 'vue-class-component'
import { Ref } from 'nuxt-property-decorator';

@Component({
  middleware: login,
  head: {
    title: 'Nickname selection'
  }
})
export default class extends Vue {

  nickname = "";
  alertText = "This nick is already register";
  alert = false;

  @Ref() readonly nickname_field!: HTMLInputElement

  async mounted() {
    const ret = await this.$axios.$get('api/profile/me/nickname')

    if (ret.nickname != "")
      this.$router.push('/home')
  }

  nickIsValid() {
    var valid = this.nickname != "" && this.nickname.length <= 20
    return valid
  }

  async setNick() {
    const nick = this.nickname
    this.nickname = ""
    const ret = await this.$axios.post('api/profile/me/nickname?nickname=' + nick)
      .catch(function (error) {
        return error.response
    });
    if (ret.status == 201)
      this.$router.push('/home')
    else
      this.activeAlert()
  }

  activeAlert() {
    this.alert = true
  }
}
</script>

<style scoped>

@import '../../assets/Classes-scss/main_page.scss';
@import '../../assets/Classes-scss/custom_flexBox.scss';
@import '../../assets/Classes-scss/neon_effects.scss';

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