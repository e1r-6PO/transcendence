<template>
  <v-container>
    <client-only class="background_effect">
      <Particles
        :move-straight="false"
        :move-speed="4"
      />
    </client-only>
    <v-row justify="center" align="center">
    <p class="foreground_element" align="center" style="font-size:30px"> Please enter 2fa code </p>
    </v-row>
    <v-row align="center" justify="center" style="padding-top: 2%; column-gap: 15px">
      <v-text-field class="foreground_element text-field_size"
        ref="digit_1"
        v-model="tfa_digit[0]"
        filled
        background-color="white"
        type="number"
        maxlength="1"
        oninput="typescript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
        @keyup="tfaIsComplete"
      ></v-text-field>
      <v-text-field class="foreground_element text-field_size"
        ref="digit_2"
        v-model="tfa_digit[1]"
        filled
        background-color="white"
        type="number"
        maxlength="1"
        oninput="typescript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
        @input="tfaIsComplete"
      ></v-text-field>
      <v-text-field class="foreground_element text-field_size"
        ref="digit_3"
        v-model="tfa_digit[2]"
        filled
        background-color="white"
        type="number"
        maxlength="1"
        oninput="typescript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
        @input="tfaIsComplete"
      ></v-text-field>
      <v-text-field class="foreground_element text-field_size"
        ref="digit_4"
        v-model="tfa_digit[3]"
        filled
        background-color="white"
        type="number"
        maxlength="1"
        oninput="typescript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
        @input="tfaIsComplete"
      ></v-text-field>
      <v-text-field class="foreground_element text-field_size"
        ref="digit_5"
        v-model="tfa_digit[4]"
        filled
        background-color="white"
        type="number"
        maxlength="1"
        oninput="typescript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
        @input="tfaIsComplete"
      ></v-text-field>
      <v-text-field class="foreground_element text-field_size"
        ref="digit_6"
        v-model="tfa_digit[5]"
        filled
        background-color="white"
        type="number"
        maxlength="1"
        oninput="typescript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
        @input="tfaIsComplete"
      ></v-text-field> 
    </v-row>
  </v-container>
</template>

<script lang='ts'>
import Particles from '../components/Particles.vue';

import Vue, {ComponentOptions} from 'vue';

import Component from 'vue-class-component'

import no22fa from '../middleware/no22fa'

import axios from '@nuxtjs/axios'

@Component({
  middleware: no22fa,
  layout: 'empty'
})
export default class extends Vue {

  tfa_code =  ""
  tfa_digit = ["", "", "", "", "", ""];

  mounted() {
    this.$refs.digit_1.focus()
  }

  async validatetfa() {
    
    this.tfa_code = "";
    for (let i = 0; i < 6; i++)
    {
      if (this.tfa_digit[i] == '')
        this.focusDigit(i);
      this.tfa_code += this.tfa_digit[i];
    }
    const ret = await this.$axios.post('/api/auth/2fa/authenticate?2fa=' + this.tfa_code)
    .catch(function (error) {
      return error.response;
    });
    if (ret.status == 201)
      this.$router.push("/home")
    else
    {
      this.tfa_digit = []
      this.tfa_code = ""
      this.$refs.digit_1.focus()
    }
  }

  $refs!: {
      digit_1: HTMLFormElement
      digit_2: HTMLFormElement
      digit_3: HTMLFormElement
      digit_4: HTMLFormElement
      digit_5: HTMLFormElement
      digit_6: HTMLFormElement
  }

  tfaIsComplete() {
    for (var i = 0; i < 6; i++)
    {
      if (this.tfa_digit[i] == undefined ||  this.tfa_digit[i] == '')
      {
        this.focusDigit(i);
        return;
      }
    }
    this.validatetfa()
  }

  focusDigit(i: number) {
      switch (i) {
        case 0:
          this.$refs.digit_1.focus()
          break;
        case 1:
          this.$refs.digit_2.focus()
          break;
        case 2:
          this.$refs.digit_3.focus()
          break;
        case 3:
          this.$refs.digit_4.focus()
          break;
        case 4:
          this.$refs.digit_5.focus()
          break;
        case 5:
          this.$refs.digit_6.focus()
          break;
        case 6:
          this.$refs.digit_6.focus()
          break;
        default:
          break;
      }
  }
};
</script>

<style lang="scss">
  @import '../assets/main_page.scss';

  .v-application{
    background-color: #181818 !important;
  }

  div[id^="particles-instance-"] {
    height: 100vh !important;
    width: 100vw !important;
    position: fixed !important;
    top: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    // background: rgba($color: #05114e, $alpha: 0.4);
    z-index: 2 !important;
  }

  .container {
    display: flexbox;
    // margin-left: 45%;
    // margin-top: 25%;
    // align-items: center;
    // align-content: space;
    // justify-content: center;
  }

  .item {
    align-self: center;
  }

.text-field_size{
  min-width: 35px;
  width: 1.8%;
  max-width: 35px;
  border-radius: 10%;
}

.text-field_size input::-webkit-inner-spin-button {
    -webkit-appearance: none; /* disable arrows in input text-field */ 
}

.text-field_size > .v-input__control > .v-input__slot:after {
  border-style: none !important;
}

.text-field_size > .v-input__control > .v-input__slot:before {
  border-bottom-style: none !important;
}
</style>
