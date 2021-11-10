<template>
<v-main>
  <v-row>
    <v-col justify="center" align="center">
      <v-btn
        class="foreground_element"
        @click="generate_qr_code()"
      >
        Generate QR code
      </v-btn>
      <v-btn
        class="foreground_element"
        @click="disable()"
      >
        disable
      </v-btn>
    </v-col>
  </v-row>
  <v-col justify="center" align="center">
    <img v-if="this.qr_code != null" v-bind:src="this.qr_code"/>
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
</v-main>
</template>

<script>
export default {

    data() {
      return {
        qr_code: null,
        tfa_code: null
      }
    },

  methods: {
    async generate_qr_code() {
      const ret = await this.$axios.post('/api/auth/2fa/generate')

      this.qr_code = ret.data
    },
    async disable() {
      const ret = await this.$axios.post('/api/auth/2fa/turn-off')
      .catch(function (error) {
        alert("Cant turn off 2fa")
        return error.response
      });
      if (ret.status == 201)
        alert("2fa disabled")
    },
    async turn_on() {
      const ret = await this.$axios.post('/api/auth/2fa/turn-on?2fa=' + this.tfa_code)
      .catch(function (error) {
        alert("Wrong code")
        return error.response
      });
      if (ret.status == 201)
        alert("2fa successfully enable")
    }
  }
}
</script>

<style>

</style>