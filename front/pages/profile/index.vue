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
      <v-btn
        @click="goto2fapage()"
        class="foreground_element"
      >
        2fa
      </v-btn>
    </v-row>
        <v-row style="margin-top: 1%" justify="center" align="center">
          <img v-if="!isEditing && me.picture != ''"
            class="foreground_element round_card"
            :src=me.picture
            width="300"
          >
          <v-btn v-else
            class="text-none foreground_element btn_camera"
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
              @keydown.enter="save"
            >
            </v-text-field>
            <v-card class="foreground_element card_profile"
              v-if="!isEditing"
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
        <v-container class="flex-container">
          <v-card class="foreground_element card_game flex-item" justify="center" margin-top="5%">
            <h1 class="color_win" align="center"> Game Win </h1>
            <h3 class="color_text" align="center">{{ me.gameWin }} </h3>
          </v-card>
          <v-card class="foreground_element card_game flex-item" margin-top="5%">
            <h1 class="color_lose" align="center"> Game Lose </h1>
            <h3 class="color_text" align="center" justify="center"> {{ me.gameLose }} </h3>
          </v-card>
      </v-container>
      <v-row>
        <v-spacer></v-spacer>
        <v-btn v-if="isEditing"
        class="foreground_element"
        :disabled="(!isEditing || nick == me.nickName || nick.length > 20) && selectedFile == null"
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

    return { me, nick: me.nickName, isEditing: null, eSize: me.email.length * 10}
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
      {
        this.selectedFile = null
        this.isEditing = !this.isEditing
        this.me.nickName = this.nick

        var formData = new FormData();
        formData.append("image", this.selectedFile);
        this.$axios.$post('api/profile/me/picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }
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
      
      if (e.target.files[0].size > 1000000) {
        e.preventDefault();
        alert('File too big (> 1MB)');
        return;
      }
      this.selectedFile = e.target.files[0]
      // console.log(this.selectedFile)
      var formData = new FormData();
      formData.append("image", this.selectedFile);
      this.$axios.$post('api/profile/me/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },

    async goto2fapage() {
      window.location.href = "/profile/2fa"
    }
  }
}
</script>

<style>

.text-field-dimension {
  width: 40%;
  margin-top: 10px;
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

.btn_camera {
  border-radius: 30px!important;
  box-shadow: 0px 0px 20px 0px rgba(31, 31, 50, 0.89);
  color: #38393b;
  min-width: 200px;
  width: 200px;
  min-height: 200px;
  height: 200px;
}

.card_game {
  border-radius:17px!important;
  background-color: #1a237e !important;
  min-width: 260px;
  width: 275px;
  box-shadow: 0px 0px 20px 0px rgba(29, 29, 48, 0.89) !important;
}

.card_profile {
  border-radius: 30px !important;
  background-color: #1a237e !important;
  box-shadow: 0px 0px 20px 0px rgba(29, 29, 48, 0.89) !important;
  min-width: 400px;
  width: 550px;
  height: 250px;
}

.flex-container {
  /* We first create a flex layout context */
  display: flex;
  
  /* Then we define the flow direction 
     and if we allow the items to wrap 
   * Remember this is the same as:
   * flex-direction: row;
   * flex-wrap: wrap;
   */
  flex-flow: row wrap;
  
  /* Then we define how is distributed the remaining space */
  justify-content: space-around;
  align-content: center;
  margin: 0;
  list-style: none;
}

.flex-item {
  background: tomato;
  margin-top: 5%;
  color: white;
  font-weight: bold;
  text-align: center;
}

</style>
