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
    <div class="flex-container">
      <v-text-field class="foreground_element text-field_size"
        ref="digit_0"
        v-model="tfa_digit[0]"
        solo
        filled
        @input="focusDigit1"
      ></v-text-field>
      <v-text-field class="foreground_element text-field_size"
        ref="digit_1"
        v-model="tfa_digit[1]"
        solo
        filled
        @input="focusDigit2"
      ></v-text-field>
      <v-text-field class="foreground_element text-field_size"
        ref="digit_2"
        v-model="tfa_digit[2]"
        solo
        filled
        @input="focusDigit3"
      ></v-text-field>
      <v-text-field class="foreground_element text-field_size"
        ref="digit_3"
        v-model="tfa_digit[3]"
        solo
        filled
        @input="focusDigit4"
      ></v-text-field>
      <v-text-field class="foreground_element text-field_size"
        ref="digit_4"
        v-model="tfa_digit[4]"
        solo
        filled
        @input="focusDigit5"
      ></v-text-field>
      <v-text-field class="foreground_element text-field_size"
        ref="digit_5"
        v-model="tfa_digit[5]"
        solo
        filled
        @input="turn_on"
      ></v-text-field>
    <!--  <li v-for="i in 6" :key="i">
        <v-text-field
          class="foreground_element text-field_size"
          v-model="tfa_digit[i]"
          solo
          filled
          @input="switchFocus"
          @keydown.enter="turn_on"
        >
        </v-text-field>
      </li>
     
      <v-text-field
        class="foreground_element text-field_size"
        v-model="tfa_digit[1]"
        solo
        filled
        @keydown.enter="turn_on"
      >
      </v-text-field>
      <v-text-field
        class="foreground_element text-field_size"
        v-model="tfa_digit[2]"
        solo
        filled
        @keydown.enter="turn_on"
      >
      </v-text-field>
      <v-text-field
        class="foreground_element text-field_size"
        v-model="tfa_digit[3]"
        solo
        filled
        @keydown.enter="turn_on"
      >
      </v-text-field>
      <v-text-field
        class="foreground_element text-field_size"
        v-model="tfa_digit[4]"
        solo
        filled
        @keydown.enter="turn_on"
      >
      </v-text-field>
      <v-text-field
        class="foreground_element text-field_size"
        v-model="tfa_digit[5]"
        solo
        filled
        @keydown.enter="turn_on"
      >
      </v-text-field> -->
    </div>
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
  tfa_digit = []

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

    $refs!: {
      digit_1: HTMLFormElement
      digit_2: HTMLFormElement
      digit_3: HTMLFormElement
      digit_4: HTMLFormElement
      digit_5: HTMLFormElement
  }

  focusDigit1() {
      this.$refs.digit_1.focus()
    }
  focusDigit2() {
      this.$refs.digit_2.focus()
    }
  focusDigit3() {
      this.$refs.digit_3.focus()
    }
  focusDigit4() {
      this.$refs.digit_4.focus()
    }
  focusDigit5() {
      this.$refs.digit_5.focus()
    }
}
</script>

<style>
  @import '../../assets/main_page.scss';


.text-field_size{
  min-width: 2%;
  width: 2%;
  max-width: 2%;
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