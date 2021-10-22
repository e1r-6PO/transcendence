<template>
  <v-app>
    <client-only class="background_effect">
      <Particles/>
    </client-only>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card-text class="text-center main_title_test foreground_element">
          Welcome to Transcendence
        </v-card-text>
        <v-main>
          <v-btn
            :loading="loading"
            :disabled="loading"
            color="white"
            rounded
            elevation="12"
            width="110"
            height="110"
            href="/api/auth/42"
            style="float: left; backgroundColor:'white' !important"
            @click="loader = 'loading'"
            class="foreground_element"
          >
            <icon-42 
              width="75"
              height="75"
            />
          </v-btn>
          <v-btn
            :loading="loading"
            :disabled="loading"
            color="white"
            rounded
            elevation="12"
            width="110"
            height="110"
            href="/api/auth/google"
            style="float: right;"
            @click="loader = 'loading'"
            class="foreground_element"
          >
            <v-icon
              color="primary"
              x-large
            >
            mdi-google
            </v-icon>
          </v-btn>
        </v-main>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import Particles from '~/components/Particles.vue'

export default {
  
  layout: 'empty',

  components: {
    Particles
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

  .v-button{
    color: whitesmoke !important;
  }
</style>
