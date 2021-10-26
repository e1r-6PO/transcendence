<template>
<v-main>
  <v-row>
    <client-only class="background_effect">
      <Particles
        :move-straight="true"
        :hover-effect="false"
        :click-effect="false"
      />
    </client-only>
    <v-col justify="center" align="center">
      <img
        src="/v.png"
        alt="Vuetify.js"
        class="mb-5"
      >
      <v-card class="foreground_element" color="indigo darken-3" height="150" width="450" elevation="12" shaped>
        <v-card-title class="justify-center">
          Signed in
        </v-card-title>
        <p>You are connected as: {{ me.email }}</p>
        <p>Nickname: {{ me.nickName }}</p>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col justify="center" align="center">
      <v-btn
        rounded
        color="blue lighten-3"
        width="300"
        height="140"
        elevation="12"
        href="/game"
        class="foreground_element"
      >
        <v-img
          :src="startImg"
          width="100"
          height="70"
        >
        </v-img>
      </v-btn>
    </v-col>
  </v-row>
</v-main>
</template>

<script>
import Particles from '~/components/Particles.vue'

export default {

  layout: 'home',

  components: {
    Particles
  },

  async asyncData() {
    const me = await fetch(
      '/api/users/me'
    ).then((res) => res.json())

    return { me,
        startImg: require('@/assets/start.png')
    }
  }
}
</script>

<style lang="scss">
  @import '../assets/main_page.scss';

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
