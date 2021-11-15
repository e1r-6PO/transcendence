<template>
  <v-app>
    <client-only class="background_effect">
      <Particles
        :move-straight="false"
        :move-speed="4"
      />
    </client-only>
    <!-- <v-row justify="center" align="center"> -->

        <!-- <v-main> -->
          <!-- <v-row justify="center" align="center"> -->
    <v-container >
      <v-text-field
        class="foreground_element"
        label="6-digit code"
        v-model="tfa_code"
        placeholder="6-digit code"
        solo
        filled
        rounded
        prepend-inner-icon=""
        @keydown.enter="validatetfa"
      >
      </v-text-field>
    </v-container>
          <!-- </v-row> -->
        <!-- </v-main> -->

    <!-- </v-row> -->
  </v-app>
</template>

<script lang="ts">
import Particles from '../components/Particles.vue'

export default {
  
  middleware: 'no22fa',

  layout: 'empty',

  components: {
    Particles
  },

  data () {
    return {
      tfa_code: "",
    }
  },

  methods: {
    async validatetfa() {
      const ret = await this.$axios.post('/api/auth/2fa/authenticate?2fa=' + this.tfa_code)
      .catch(function (error) {
        return error.response;
      });
      if (ret.status == 201)
        window.location.href = "/home"
    }
  }

}
</script>

<style lang="scss">
  @import '../assets/main_page.scss';

  .v-application{
    background-color: darkgrey !important;
  }

  div[id^="particles-instance-"] {
    height: 100vh !important;
    width: 100vw !important;
    position: fixed !important;
    top: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    background: rgba($color: #05114e, $alpha: 0.4);
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
</style>
