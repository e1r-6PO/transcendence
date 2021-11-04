<template>
<v-main>
  <v-row>
    <v-col justify="center" align="center">
      <img
        src="~/assets/lune.png"
        width="100"
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

  async asyncData() {
    const me = await fetch(
      '/api/profile/me'
    ).then((res) => res.json())

    return { me,
        startImg: require('@/assets/start.png')
    }
  }
}
</script>
