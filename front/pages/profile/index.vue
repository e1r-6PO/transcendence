<template>
<v-main>
  <v-toolbar
    flat
    color="indigo darken-4"
    class="foreground_element round_card"
    elevation="12"
  >
    <v-icon color="blue-grey lighten-2" size="30" >mdi-account</v-icon>
      <v-toolbar-title class="font-weight-light font-size">
        <b class="color_text">User Profile</b>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="blue darken-3"
        fab
        small
        @click="isEditing = !isEditing"
      >
        <v-icon color="blue-grey lighten-2" v-if="isEditing" >
          mdi-close
        </v-icon>
        <v-icon color="blue-grey lighten-2" v-else>
          mdi-pencil
        </v-icon>
      </v-btn>
    </v-toolbar>
        <v-row style="margin-top: 1%" justify="center" align="center">
            <img
              class="foreground_element"
              src="~/assets/lune.png"
              width="200"
            >
        </v-row>
        <v-row>
          <v-col justify="center" align="center">
            <v-text-field v-if="isEditing"
              class="foreground_element text-field-dimension round_card"
              v-model="nick"
              label="Nickname"
              filled
            >
            </v-text-field>
            <v-card class="justify-center foreground_element" color="indigo darken-4 round_card"
              :width="(nick.length + 20) * 10"
              min-width=300
              max-width=450
              v-if="!isEditing"
              elevation="12"
              r
            > 
              <h2 class="color_text" align="center">{{ nick }}</h2>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col justify="center" align="center">
            <v-text-field v-if="isEditing"
              class="foreground_element text-field-dimension"
              v-model="me.email"
              label="Email"
              filled
            >
            </v-text-field>
            <v-card class="justify-center foreground_element round_card" color="indigo darken-4"
              :width="(me.email.length + 30) * 10"
              min-width=400
              max-width=1000
              v-if="!isEditing"
              elevation="12"
            > 
              <h2 class="color_text" align="center">{{ me.email }} </h2>
            </v-card>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="2" align="center" justify="center">
            <h1 class="color_win" align="center"> Game Win </h1>
            <h3 class="color_text" align="center">{{ me.gameWin }} </h3>
          </v-col>
          <v-col cols="12" sm="2" align="left" justify="center">
            <h1 class="color_lose" align="center"> Game Lose </h1>
            <h3 class="color_text" align="center" justify="center"> {{ me.gameLose }} </h3>
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
    var mail = me.email

    return { me, nick: me.nickName, isEditing: null, eSize: me.email.length * 10}
  },

  methids: {
    save() {
      isEditing = !isEditing
    },
    emailSize() {
      return me.email.lenght
    }
  }
}
</script>

<style>

.text-field-dimension {
  width: 40%;
  margin-top: 10px;
}

.font_size {
  font-size: 30px;
}

.font-size-icon {
  font-size: 5px;
}

.margin_right {
  margin-right: 10%;
}

.color_lose {
  z-index: 6;
  color: #E57373;
}

.color_win {
  z-index: 6;
  color: #00796B; 
}

.color_text { 
  z-index: 6;
  color: #90A4AE;
}

.round_card {
  border-radius:30px!important;
}

</style>
