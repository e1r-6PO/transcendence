<template>
  <v-app>
    <client-only class="background_effect">
      <Particles
        :move-straight="false"
        :move-speed="4"
      />
    </client-only>
    <v-card-text class="text-center main_title_test foreground_element">
      Logging you in...
    </v-card-text>
  </v-app>
</template>

<script lang="ts">

import Vue from 'vue'

import Component from 'vue-class-component'

// import axios from 'Axios'

@Component({
  layout: 'empty'
})
export default class extends Vue {
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
  }

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
</script>

<style lang="scss">
  @import '../../../assets/main_page.scss';

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
</style>
