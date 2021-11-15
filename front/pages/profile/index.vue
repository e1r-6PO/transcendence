<template>
<v-main>
  <div class="flex-container" style="padding-top: 5%">
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
        class="foreground_element"
        to="/profile/2fa" nuxt
      >
        2fa
      </v-btn>
  </div>
  <div class="flex-container" >
    <img v-if="!isEditing && me.picture != ''"
      class="foreground_element round_card item"
      :src=me.picture
      width="300"
    />
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
  </div>
  <div class="flex-container" style="padding-top: 3%">
      <v-text-field v-if="isEditing"
        class="foreground_element text-field-dimension round_card"
        v-model="nick"
        label="Nickname"
        counter="20"
        filled
      >
      </v-text-field>
      <v-card class="foreground_element card_profile"
        v-if="!isEditing"
      > 
      <v-card-text align="center">
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
    </div>
    <div class="flex-container">
      <v-card class="foreground_element card_game flex-item" justify="center" margin-top="5%">
        <h1 class="color_win" align="center"> Game Win </h1>
        <h3 class="color_text" align="center">{{ me.gameWin }} </h3>
      </v-card>
      <v-card class="foreground_element card_game flex-item" margin-top="5%">
        <h1 class="color_lose" align="center"> Game Lose </h1>
        <h3 class="color_text" align="center" justify="center"> {{ me.gameLose }} </h3>
      </v-card>
  </div>
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

<script lang="ts">
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
      if (this.me.nickName != this.nick) {
        const ret = await this.$axios.post('api/profile/me/nickname?nickname=' + this.nick)
          .catch(function (error) {
            alert("nick " + this.nick + " is already taken")
              return error.response
          });
        console.log(ret.status)
        this.me.nickName = this.nick
      }
      if (this.selectedFile != null)
      {
        var formData = new FormData();
        formData.append("image", this.selectedFile);
        this.$axios.$post('api/profile/me/picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        this.selectedFile = null
      }
      window.location.href = "/profile"
    },
    emailSize() {
      return this.me.email.lenght
    },
    colorEditing() {
      if (this.isEditing)
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
    },
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
  border-radius:100%!important;
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
  background-color: #00A3A3 !important;
  min-width: 260px;
  width: 275px;
  /* box-shadow: 0px 0px 20px 0px rgba(29, 29, 48, 0.89) !important; */
}

.card_profile {
  border-radius: 30px !important;
  background-color: #00A3A3 !important;
  /* box-shadow: 0px 0px 20px 0px rgba(29, 29, 48, 0.89) !important; */
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
  justify-content: space-evenly;
  align-content: center;
  /* padding-top: 5%; */
  list-style: none;
}

.item {
  align-self: flex-end;
}

.flex-item {
  background: tomato;
  margin-top: 5%;
  color: white;
  font-weight: bold;
  text-align: center;
}

</style>
