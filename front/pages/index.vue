<template>
  <v-app>
    <client-only class="background_effect">
      <Particles
        :move-straight="false"
        :move-speed="4"
      />
    </client-only>
    <v-container fill-height fluid>
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
          <v-card-text class="text-center foreground_element main_title_test" style="color: #e6ffff">
            Welcome to Tronscendence
          </v-card-text>
          <v-main>
            <v-btn class="foreground_element" @click="$store.commit('increment')">{{ $store.state.counter }}</v-btn>
            <v-row justify="center" align="center">
              <v-col align="center">
                <v-btn  
                href="/api/auth/42"
                class="foreground_element button_auth white"
              >
                <icon-42 
                  width="75"
                  height="75"
                />
                </v-btn>
              </v-col>
              <v-col align="center">
                <v-btn
                  href="/api/auth/google"
                  class="foreground_element button_auth white"
                >
                  <v-icon
                    color="primary"
                    x-large
                  >
                  mdi-google
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col align="center">
                <v-btn
                  href="/api/auth/github"
                  class="foreground_element button_auth white"
                >
                  <icon-github 
                    width="75"
                    height="75"
                  />
                </v-btn>
              </v-col>
            </v-row>
        </v-main>
      </v-col>
    </v-row>
    </v-container>
  </v-app>
</template>

<script lang='ts'>

import Vue from 'vue'

import Component from 'vue-class-component'

import no2login from '../middleware/no2login'

@Component({
  middleware: no2login,
  layout: 'empty'
})
export default class extends Vue {

}
</script>

<style lang="scss">
  @import '../assets/Classes-scss/main_page.scss';
  @import '../assets/Classes-scss/particles.scss';

  @font-face {
    font-family: "Tr2n";
    src: local("Tr2n"),
    url(~assets/Tr2n.ttf) format("truetype");
  }

  html {
    font-family: "Tr2n";
  }

  body {
    font-family: "Tr2n";
  }

  head {
    font-family: "Tr2n";
  }

  .v-application{
    background-color: #181818 !important;
  }

  .v-button{
    color: whitesmoke !important;
  }

  .button_auth{
    min-width: 36px;
    width: 110px;
    height: 110px;
    min-height: 110px;
    border-radius:30px!important;
    box-shadow: 0px 0px 20px 0px rgba(36,31,219,0.89);
  }
</style>
