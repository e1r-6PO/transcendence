<template>
  <v-row>
    <client-only class="background_effect">
      <Particles
        :move-straight="true"
      />
    </client-only>
    <v-col class="text-center">
      <img
        src="/v.png"
        alt="Vuetify.js"
        class="mb-5"
      >
      <v-card>
        <v-card-title class="justify-center">
          Signed in
        </v-card-title>
        <p>You are connected as: {{ me.email }}</p>
        <p>Nickname: {{ me.nickName }}</p>
      </v-card>
    </v-col>
  </v-row>
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

    return { me }
  }
}
</script>

<style lang="scss">

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
