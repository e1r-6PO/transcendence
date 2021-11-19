<template>
  <v-main>
    <div class="foreground_element" style="padding-top: 3%;">
      <v-row>
        <v-col justify="center" align="center">
          <v-btn
            class="foreground_element"
            @click="generate_qr_code()"
          >
            Re-Generate 2fa
          </v-btn>
        </v-col>
      </v-row>
      <v-row justify="center" align="center">
        <!-- mettre le qr code au bon endroit  -->
        <v-img class="foreground_element"
          width="35%"
          height="35%"
          max-width="250"
          max-height="250"
          v-if="this.qr_code != null" v-bind:src="this.qr_code"/>
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
          @input="focusDigit2"
        ></v-text-field>
        <v-text-field class="foreground_element text-field_size"
          ref="digit_2"
          v-model="tfa_digit[1]"
          filled
          background-color="white"
          type="number"
          maxlength="1"
          oninput="typescript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
          @input="focusDigit3"
        ></v-text-field>
        <v-text-field class="foreground_element text-field_size"
          ref="digit_3"
          v-model="tfa_digit[2]"
          filled
          background-color="white"
          type="number"
          maxlength="1"
          oninput="typescript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
          @input="focusDigit4"
        ></v-text-field>
        <v-text-field class="foreground_element text-field_size"
          ref="digit_4"
          v-model="tfa_digit[3]"
          filled
          background-color="white"
          type="number"
          maxlength="1"
          oninput="typescript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
          @input="focusDigit5"
        ></v-text-field>
        <v-text-field class="foreground_element text-field_size"
          ref="digit_5"
          v-model="tfa_digit[4]"
          filled
          background-color="white"
          type="number"
          maxlength="1"
          oninput="typescript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
          @input="focusDigit6"
        ></v-text-field>
        <v-text-field class="foreground_element text-field_size"
          ref="digit_6"
          v-model="tfa_digit[5]"
          filled
          background-color="white"
          type="number"
          maxlength="1"
          oninput="typescript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
          @input="turn_on"
        ></v-text-field> 
      </v-row>
<!--
    <div class="flex-container">
      <li v-for="i in 6" :key="i">
        <v-text-field class="foreground_element text-field_size"
          :ref="'digit_' + i.toString()"
          v-model="tfa_digit[i - 1]"
          filled
          background-color="white"
          @input="focusDigit(i)"
        ></v-text-field> 
      </li>
    </div>
-->
      <v-row justify="center" align="center">
        <v-btn
          class="foreground_element"
          :disabled="qr_code == null || tfa_code.length != 6"
          color="success"
          @click="turn_on"
        >
          enable 2fa
        </v-btn>
      </v-row>
    </div>
  </v-main>
</template>

<script lang='ts'>
import login from '../../middleware/login';

import Component from 'vue-class-component'

import Vue from 'vue'

@Component({
  middleware: login
})
export default class extends Vue {

  qr_code = null
  tfa_status = false
  tfa_code = ""
  tfa_digit = []

  async mounted() {
  
    const ret = await this.$axios.get('/api/auth/2fa/is_enabled')
    .catch(function (error) {
      alert("error in mounted")
      return error.response
    })
    
    this.$refs.digit_1.focus()

    if (ret.status == 200) {
      this.tfa_status = ret.data['isTwoFactorAuthenticationEnabled']
      if (this.tfa_status == false) {
        this.generate_qr_code()
      }
    }
  }

  async generate_qr_code() {
    const ret = await this.$axios.post('/api/auth/2fa/generate')
    .catch(function (error) {
      alert("2fa is already enabled")
      return error.response
    });
    if (ret.status == 201)
      this.qr_code = ret.data
  }

  async turn_on() {

    this.tfa_code = "";
    for (let i = 0; i < 6; i++)
    {
      this.tfa_code += this.tfa_digit[i];
    }
    const ret = await this.$axios.post('/api/auth/2fa/turn-on?2fa=' + this.tfa_code)
    .catch(function (error) {
      alert("Wrong code")
      return error.response
    });
    if (ret.status == 201) {
      this.tfa_status = true
      this.tfa_code = ""
      alert("2fa successfully enable")
      this.$router.push("/profile")
    }
    else {
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

  createRef(i: number)
  {
      console.log("digit_" + i.toString())
    return ("digit_" + i.toString())
  }
/*
  focusDigit(i: number) {

    console.log("i: " + i)
      switch (i) {
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
          console.log("default: " + i)
          break;
      }
  }
  */ 

  
  focusDigit2() {
    if (this.tfa_digit[0] != '')
      this.$refs.digit_2.focus()
  }

  focusDigit3() {
    if (this.tfa_digit[1] != '')
      this.$refs.digit_3.focus()
  }

  focusDigit4() {
    if (this.tfa_digit[2] != '')
      this.$refs.digit_4.focus()
  }

  focusDigit5() {
    if (this.tfa_digit[3] != '')
      this.$refs.digit_5.focus()
  }

  focusDigit6() {
    if (this.tfa_digit[4] != '')
    this.$refs.digit_6.focus()
  }

}
</script>

<style>
  @import '../../assets/main_page.scss';


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
  justify-content: center;
  align-content: center;
  /* padding-top: 5%; */
  list-style: none;
  gap: 1%
}

.flex-item {
  background: tomato;
  margin-top: 5%;
  color: white;
  font-weight: bold;
  text-align: center;
}

</style>