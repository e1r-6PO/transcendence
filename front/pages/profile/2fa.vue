<template>
  <div class="foreground_elemen flex-container pt-8">
    <AlertError @end="alert = false" :textError="alertText" :type="alertType" :time="5" :state="alert"> {{ alertText }} </AlertError>
    <v-row justify="end" class="mr-6 pb-4">
			<BasicBtn @click="returnToProfile()" content="mdi-close" neonColor="red" />
		</v-row>
    <v-row>
      <v-col justify="center" align="center">
        <v-btn
          class="foreground_element neon-button"
          rounded
          text
          color="#ffffff"
          @click="generate_qr_code()"
        >
          Re-Generate 2fa
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" align="center" style="padding-top: 20px">
      <v-img class="foreground_element"
        width="35%"
        height="35%"
        max-width="250"
        max-height="250"
        style="border-radius: 10px"
        v-if="this.qr_code != null" v-bind:src="this.qr_code"/>
    </v-row>
    <v-row align="center" justify="center" style="padding-top: 3%; column-gap: 15px">
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
  </div>
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
  digit_ref = ["digit_1", "digit_2", "digit_3", "digit_4", "digit_5", "digit_6"]
  alert = false
  alertType = "success"
  alertText = ""

  async mounted() {
  
    const ret = await this.$axios.get('/api/auth/2fa/is_enabled')
    .catch(function (error) {
      alert("error in mounted")
      return error.response
    })
    
    this.$refs[`digit_1`][0]?.focus?.()

    if (ret.status == 200) {
      this.tfa_status = ret.data['isTwoFactorAuthenticationEnabled']
      if (this.tfa_status == false) {
        this.generate_qr_code()
      }
      else
        this.$router.push('/profile')
    }
  }

  async generate_qr_code() {
    const ret = await this.$axios.post('/api/auth/2fa/generate')
    .catch(function (error) {
      // alert("2fa is already enabled")
      return error.response
    });
    if (ret.status == 201)
    {
      this.qr_code = ret.data
      this.tfa_digit = []
      this.alert = false
      this.$refs[`digit_1`][0]?.focus?.()
    }
  }

  async turn_on() {

    this.alert = false
    this.tfa_code = "";
    for (let i = 0; i < 6; i++)
    {
      this.tfa_code += this.tfa_digit[i];
    }
    const ret = await this.$axios.post('/api/auth/2fa/turn-on?2fa=' + this.tfa_code)
    .catch(function (error) {
      return error.response
    });
    if (ret.status == 201) {
      this.tfa_status = true
      this.tfa_code = ""
      this.$router.push("/profile?2fa=on")
      return;
    }
    this.activeAlert("Wrong 2fa code", "error")
    this.tfa_digit = []
    this.$refs[`digit_1`][0]?.focus?.()
  }

    $refs: any = {
      digit_1: HTMLFormElement,
      digit_2: HTMLFormElement,
      digit_3: HTMLFormElement,
      digit_4: HTMLFormElement,
      digit_5: HTMLFormElement,
      digit_6: HTMLFormElement
  }

  createRef(i: number)
  {
    return ("digit_" + i.toString())
  }

  deleteDigit(i: number)
  {
    if (this.tfa_digit[i - 1] == undefined || this.tfa_digit[i - 1] == '')
    {
      if (i > 1)
        i--
      else
        i = 1
      this.$refs[`digit_${i}`][0]?.focus?.()
    }
  }

  tfaIsComplete() {
    for (var i = 0; i < 6; i++)
    {
      if (this.tfa_digit[i] == undefined || this.tfa_digit[i] == '')
      {
        this.$refs[`digit_${i + 1}`][0]?.focus?.()
        return;
      }
    }
    this.turn_on()
  }

  returnToProfile() {
    this.$router.push('/profile')
  }

  activeAlert(text: string, type: string) {
    this.alertType = type
    this.alertText = text
    this.alert = true
  }
}
</script>

<style>
  @import '../../assets/Classes-scss/main_page.scss';

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
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