<template>
  <v-app>
    <client-only class="background_effect">
      <Particles
        :move-straight="false"
        :move-speed="4"
      />
    </client-only>
    <v-container fill-height fluid>
      <v-row align="center" justify="center">
        <p class="text-center main_title_test foreground_element">
          Logging you in...
        </p>
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">

import Vue from 'vue'

import Component from 'vue-class-component'

// import axios from 'Axios'

export default Vue.extend({
  layout: 'empty',

  head() {
    return {
      title: 'Redirect'
    }
  },

  async mounted() {
    const { params: { provider } } = this.$route

    var url : string

    url = window.location.origin
    url += '/api/auth/'
    url += provider
    url += '/callback'
    url += window.location.search

    const ret = await this.$axios.$get(url)

    this.$router.push(await this.getRedirectUrl())
  },

  methods: {
    async getRedirectUrl() {

      const tfa = await this.$axios.$get('api/auth/2fa/is_enabled')

      if (tfa.isTwoFactorAuthenticationEnabled == true)
        return '/2fa'

      const nick = await this.$axios.$get('api/profile/me/nickname')
      if (nick.nickname == "")
        return '/profile/set_nickname'
      return '/home'
    }
  }
})
</script>

<style lang="scss">
  @import '../../../assets/Classes-scss/main_page.scss';
  @import '../../../assets/Classes-scss/particles.scss';

  .v-application{
    background-color: #181818 !important;
  }

</style>
