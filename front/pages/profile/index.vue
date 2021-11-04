<template>
<v-main>
  <v-row>
    <v-spacer></v-spacer>
      <v-btn
        color="blue darken-3"
        fab
        small
        @click="isEditing = !isEditing"
        class="foreground_element"
      >
        <v-icon color="red lighten-2" v-if="isEditing" >
          mdi-close
        </v-icon>
        <v-icon color="blue-grey lighten-2" v-else>
          mdi-pencil
        </v-icon>
      </v-btn>
    </v-row>
        <v-row style="margin-top: 1%" justify="center" align="center">
          <img v-if="!isEditing && me.picture != ''"
            class="foreground_element round_card"
            :src=me.picture
            width="300"
          >
          <v-btn v-else
            color="black-grey"
            class="text-none foreground_element"
            rounded
            depressed
            width="200"
            height="200"
            :disabled="isEditing ? false: true"
            :loading="isSelecting"
            @click="onButtonClick"
          >
            <v-icon
              x-large
            >
              mdi-camera-enhance
            </v-icon>
            <input
              ref="uploader"
              class="d-none"
              type="file"
              accept="image/*"
              @change="onFileChanged"
            >
          </v-btn>
        </v-row>
        <v-row>
          <v-col justify="center" align="center">
            <v-text-field v-if="isEditing"
              class="foreground_element text-field-dimension round_card"
              v-model="nick"
              label="Nickname"
              counter="20"
              filled
            >
            </v-text-field>
            <v-card class="justify-center foreground_element" color="indigo darken-4 round_card"
              width=550
              heigth=250
              v-if="!isEditing"
              elevation="12"
            > 
            <v-card-text>
              <p class="color_text text-h4 font-weight-medium" align="center">{{ nick }}</p>
              <p class="color_text text-h5" align="center">{{ me.email }}</p>
              <p v-if="me.provider === 'github'" class="color_text text-h6" align="center"> Connected via :</p>
              <icon-github v-if="me.provider === 'github'"
                  width="50"
                  height="50"
              />
              <p v-if="me.provider === '42'" class="color_text text-h6" align="center"> Connected via :</p>
              <icon-42 v-if="me.provider === '42'"
                width="50"
                height="50"
              />
              <p v-if="me.provider === 'google'" class="color_text text-h6" align="center"> Connected via :</p>
              <v-icon v-if="me.provider === 'google'"
                  color="primary"
                  x-large
              >
                mdi-google
              </v-icon>
            </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="2" align="center" justify="center">
            <v-card
              color="indigo darken-4"
              class="foreground_element round_card"
              elevation="12"
              min-width=260
              width=275
            >
              <h1 class="color_win" align="center"> Game Win </h1>
              <h3 class="color_text" align="center">{{ me.gameWin }} </h3>
            </v-card>
          </v-col>
          <v-col cols="12" sm="2" align="left" justify="center">
            <v-card
              color="indigo darken-4"
              class="foreground_element round_card"
              elevation="12"
              min-width=260
              width=275
            >
              <h1 class="color_lose" align="center"> Game Lose </h1>
              <h3 class="color_text" align="center" justify="center"> {{ me.gameLose }} </h3>
            </v-card>
          </v-col>
        </v-row>
      <v-row>
        <v-spacer></v-spacer>
        <v-btn
        class="foreground_element"
        :disabled="!isEditing || nick == me.nickName || nick.length > 20"
        color="success"
        @click="save"
        >
        Save
        </v-btn>
    </v-row>
  </v-main>
</template>

<script>
import Particles from '~/components/Particles.vue'

export default {

  async asyncData({ $axios }) {
    const me = await fetch(
      '/api/profile/me'
    ).then((res) => res.json())
    var mail = me.email

    return { me, nick: me.nickName, isEditing: null, eSize: me.email.length * 10, isSelecting: false}
  },

  data() {
    return { selectedFile: null,
    isSelecting: false,
    }
  },

  methods: {
    async save() {
      const ret = await this.$axios.post('api/profile/me/nickname?nickname=' + this.nick)
        .catch(function (error) {
          alert("nick " + this.nick + " is already taken")
            return error.response
        });
      if (ret.status == 201)
        this.isEditing = !this.isEditing
    },
    emailSize() {
      return me.email.lenght
    },
    colorEditing() {
      if (isEditing)
        return "red lighten-1"
      else
        return "blue darken-3"
    },
    onButtonClick() {
      this.isSelecting = true
      window.addEventListener('focus', () => {
        this.isSelecting = false
      }, { once: true })

      this.$refs.uploader.click()
    },
    onFileChanged(e) {

      if (!e.target.files[0]) {
        e.preventDefault();
        alert('No file chosen');
        return;
      }
      
      if (e.target.files[0].size > 1024 * 1024) {
        e.preventDefault();
        alert('File too big (> 1MB)');
        return;
      }
      this.selectedFile = e.target.files[0]
      console.log(this.selectedFile)
      // do something
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
