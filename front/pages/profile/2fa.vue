<template>
<v-main>
  <div v-if="tfa_status == false" class="foreground_element">
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
    <v-col justify="center" align="center">
      <!-- mettre le qr code au bon endroit  -->
      <v-img class="foreground_element"
        width="35%"
        height="35%"
        max-width="250"
        max-height="250"
        v-if="this.qr_code != null" v-bind:src="this.qr_code"/>
    </v-col>
    <v-col justify="center" align="center">
      <v-text-field
        class="foreground_element"
        label="6-digit code"
        v-model="tfa_code"
        placeholder="6-digit code"
        solo
        filled
        rounded
        prepend-inner-icon=""
        @keydown.enter="turn_on"
      >
      </v-text-field>
    </v-col>
    <v-col justify="center" align="center">
      <v-btn
        class="foreground_element"
        :disabled="qr_code == null || tfa_code.length != 6"
        color="success"
        @click="turn_on"
      >
        enable 2fa
      </v-btn>
    </v-col>
  </div>
  <div v-else>
    <v-col justify="center" align="center">
      <v-btn
        class="foreground_element"
        @click="disable()"
        color="error"
        to="/profile" nuxt
      >
        disable 2fa
      </v-btn>
    </v-col>
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

  async mounted() {
    const ret = await this.$axios.get('/api/auth/2fa/is_enabled')
    .catch(function (error) {
      alert("error in mounted")
      return error.response
    })

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
  async disable() {
    const qr = await this.$axios.post('/api/auth/2fa/turn-off')
    .catch(function (error) {
      alert("Cant turn off 2fa")
      return error.response
    });
    if (qr.status == 201) {
      this.tfa_status = false
      alert("2fa disabled")
    }
  }
  async turn_on() {
    const ret = await this.$axios.post('/api/auth/2fa/turn-on?2fa=' + this.tfa_code)
    .catch(function (error) {
      alert("Wrong code")
      return error.response
    });
    if (ret.status == 201) {
      this.tfa_status = true
      this.tfa_code = ""
      alert("2fa successfully enable")
    }
  }
}
</script>

<style>
  @import '../../assets/main_page.scss';
</style>