<template>
  <v-app>
    <client-only class="background_effect">
      <Particles
        :move-straight="false"
        :move-speed="4"
      />
    </client-only>
    <v-btn
      icon
      href="/api/auth/logout"
      class="logout-btn foreground_element"
      style="margin-left: auto; margin-right: 20px; margin-top: 20px"
      :color="exitFocus == true ? '#ffc79c' : 'black'"
      v-on:mouseover="exitFocus = true"
      v-on:mouseleave="exitFocus = false"
    >
      <v-icon
        large
      >
        mdi-exit-to-app
      </v-icon>
    </v-btn>
    <v-container style="justify-content: center; padding-top: 20%">
      <v-row justify="center" align="center">
        <p class="foreground_element main_title_test" align="center" style="font-size:30px"> Please enter 2fa code </p>
      </v-row>
      <v-row align="center" justify="center" style="column-gap: 15px; padding-top: 2%">
        <p v-for="i in 6" :key="i">
          <v-text-field class="foreground_element text-field_size"
            :ref="createRef(i)"
            v-model="tfa_digit[i - 1]"
            filled
            background-color="white"
            type="number"
            maxlength="1"
            oninput="typescript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
            @input="tfaIsComplete"
            @keydown.delete="deleteDigit(i)"
          ></v-text-field> 
        </p>
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang='ts'>
import Particles from '../components/Particles.vue';

import Vue, {ComponentOptions} from 'vue';

import Component from 'vue-class-component'

import no22fa from '../middleware/no22fa'

import axios from '@nuxtjs/axios'

@Component({
  middleware: no22fa,
  layout: 'empty',
  head: {
    title: '2fa'
  },
})
export default class extends Vue {

  tfa_code =  ""
  tfa_digit = ["", "", "", "", "", ""];
  exitFocus = false

  mounted() {
    this.$refs[`digit_1`][0]?.focus?.()
  }

  createRef(i: number)
  {
    return ("digit_" + i.toString())
  }

  deleteDigit(i: number)
  {
    if (this.tfa_digit[i - 1] == undefined || this.tfa_digit[i - 1] == '')
    {
      this.tfa_digit[i - 1] = ""
      if (i > 1)
        i--
      else
        i = 1
      this.$refs[`digit_${i}`][0]?.focus?.()
    }
    else
      this.tfa_digit[i - 1] = ''
  }

  async validatetfa() {
    
    this.tfa_code = "";
    for (let i = 0; i < 6; i++)
    {
      if (this.tfa_digit[i] == '')
      {
        this.$refs[`digit_${i + 1}`][0]?.focus?.()
        break;
      }
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
      this.$refs[`digit_1`][0]?.focus?.()
    }
  }

    $refs: any = {
      digit_1: HTMLFormElement,
      digit_2: HTMLFormElement,
      digit_3: HTMLFormElement,
      digit_4: HTMLFormElement,
      digit_5: HTMLFormElement,
      digit_6: HTMLFormElement
  }

  tfaIsComplete() {
    for (var i = 0; i < 6; i++)
    {
      if (this.tfa_digit[i] == undefined ||  this.tfa_digit[i] == '')
      {
        this.$refs[`digit_${i + 1}`][0]?.focus?.()
        return;
      }
    }
    this.validatetfa()
  }
}
</script>

<style lang="scss">
  @import '../assets/Classes-scss/main_page.scss';
  @import '../assets/Classes-scss/particles.scss';

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}


  .v-application{
    background-color: #181818 !important;
  }

.container {
    display: flexbox;
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
